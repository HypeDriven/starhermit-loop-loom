// Loop Loom — authoritative JavaScript Game Script.
// Serves the static distribution and the hosted API: server time, daily seed,
// replay-validated leaderboards, durable idempotent achievements, presence,
// activity pairing, and anonymous aggregate telemetry.
'use strict';

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as rules from './src/rules.js';
import * as content from './src/content.js';
import { validateReplay } from './src/session.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, '.server-data');
const MAX_BODY = 64 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.opus': 'audio/ogg',
};

// Never serve secrets, source maps, or dotfiles outside the distribution set.
function isServicable(rel) {
  if (rel.includes('..')) return false;
  const base = path.basename(rel);
  if (base.startsWith('.')) return false;
  if (base.endsWith('.map')) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Durable stores (JSON files, best-effort atomic writes)
// ---------------------------------------------------------------------------

function storePath(name) { return path.join(DATA_DIR, name + '.json'); }
function loadStore(name, def) {
  try { return JSON.parse(fs.readFileSync(storePath(name), 'utf8')); } catch { return def; }
}
function saveStore(name, data) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = storePath(name) + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, storePath(name));
  } catch { /* disk unavailable — session continues in memory */ }
}

let scores = loadStore('scores', { global: [], daily: {} });
let achievements = loadStore('achievements', {}); // sessionId -> { id: ts }
let presence = {};

// ---------------------------------------------------------------------------
// Rate limiting (naive per-IP token bucket) — recoverable, never punitive
// ---------------------------------------------------------------------------

const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const b = buckets.get(ip) || { tokens: 40, at: now };
  b.tokens = Math.min(40, b.tokens + (now - b.at) / 1000 * 4);
  b.at = now;
  buckets.set(ip, b);
  if (b.tokens < 1) return true;
  b.tokens -= 1;
  return false;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function send(res, code, obj, headers) {
  const body = typeof obj === 'string' || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj);
  res.writeHead(code, Object.assign({
    'Content-Type': typeof obj === 'object' && !Buffer.isBuffer(obj) ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  }, headers || {}));
  res.end(body);
}
function sendError(res, code, msg) { send(res, code, { error: msg }); }

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('payload-too-large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); }
      catch { reject(new Error('bad-json')); }
    });
    req.on('error', reject);
  });
}

function resolveRecord(env) {
  // Re-derive the authoritative content record from the claimed identity so
  // client-provided boards are never trusted.
  if (!env || typeof env.contentId !== 'string') return null;
  if (env.contentId.startsWith('daily-')) {
    const day = parseInt(env.contentId.slice(6), 10);
    if (!Number.isInteger(day)) return null;
    return content.getDaily(day);
  }
  if (env.contentId.startsWith('chase-')) {
    const salt = parseInt(env.contentId.slice(6), 10);
    if (!Number.isInteger(salt)) return null;
    return content.getScoreChase(salt);
  }
  if (env.contentId.startsWith('journey-')) {
    const idx = parseInt(env.contentId.slice(8), 10) - 1;
    if (!Number.isInteger(idx) || idx < 0 || idx >= content.journeyCount) return null;
    return content.getJourneyStage(idx);
  }
  if (env.contentId.startsWith('practice-') || env.contentId.startsWith('challenge-')) return null; // unranked
  for (let i = 0; i < content.LESSONS.length; i++) {
    const l = content.getLesson(i);
    if (l.id === env.contentId) return l;
  }
  return null;
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

async function handleApi(req, res, urlPath, query) {
  if (req.method === 'GET' && urlPath === '/api/v1/time') {
    return send(res, 200, { time: Date.now() });
  }
  if (req.method === 'GET' && urlPath === '/api/v1/daily') {
    const day = parseInt(query.get('day') || '', 10);
    if (!Number.isInteger(day)) return sendError(res, 400, 'bad-day');
    const rec = content.getDaily(day);
    return send(res, 200, { day, seed: rec.seed, version: rec.version, rulesVersion: rec.rulesVersion, par: rec.par });
  }
  if (urlPath === '/api/v1/scores' && req.method === 'GET') {
    const board = query.get('board') || 'global';
    if (board === 'daily') {
      const day = query.get('day');
      return send(res, 200, { scores: (scores.daily[day] || []).slice(0, 50) });
    }
    return send(res, 200, { scores: scores.global.slice(0, 50) });
  }
  if (urlPath === '/api/v1/scores' && req.method === 'POST') {
    let env;
    try { env = await readBody(req); } catch (e) { return sendError(res, e.message === 'payload-too-large' ? 413 : 400, e.message); }
    // Validate identity, bounds, payload shape.
    if (!env || env.schema !== 1) return sendError(res, 400, 'bad-envelope');
    if (!Array.isArray(env.commands) || env.commands.length > 10000) return sendError(res, 400, 'bad-commands');
    const record = resolveRecord(env);
    if (!record) return sendError(res, 422, 'unranked-content');
    if (env.contentVersion !== record.version || env.rulesVersion !== rules.RULES_VERSION) {
      return sendError(res, 409, 'stale-version');
    }
    // Authoritative validation: replay the input log against deterministic rules.
    const v = validateReplay(env, record);
    if (!v.ok) return sendError(res, 422, 'replay-invalid:' + v.error);
    // Plausibility/rate checks on top of replay validation.
    const r = env.result || {};
    if (r.moves < record.par) return sendError(res, 422, 'impossible-score');
    const entry = {
      score: v.score, moves: r.moves | 0, invalid: r.invalid | 0,
      elapsedMs: Math.max(0, r.elapsedMs | 0), sessionId: String(r.sessionId || 'anon').slice(0, 64),
      contentId: record.id, seed: record.seed, version: record.version,
      day: record.day == null ? null : record.day, at: Date.now(),
    };
    // Idempotent by session+content: replace an earlier submission.
    scores.global = scores.global.filter((s) => !(s.sessionId === entry.sessionId && s.contentId === entry.contentId));
    scores.global.push(entry);
    scores.global.sort((a, b) => b.score - a.score || a.invalid - b.invalid || a.elapsedMs - b.elapsedMs || a.sessionId.localeCompare(b.sessionId));
    scores.global = scores.global.slice(0, 100);
    if (entry.day != null) {
      const k = String(entry.day);
      scores.daily[k] = (scores.daily[k] || []).filter((s) => s.sessionId !== entry.sessionId);
      scores.daily[k].push(entry);
      scores.daily[k].sort((a, b) => b.score - a.score);
      scores.daily[k] = scores.daily[k].slice(0, 100);
    }
    saveStore('scores', scores);
    return send(res, 200, { ok: true, score: v.score, rank: scores.global.findIndex((s) => s.sessionId === entry.sessionId && s.contentId === entry.contentId) + 1 });
  }
  if (urlPath === '/api/v1/achievements' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch (e) { return sendError(res, 400, e.message); }
    const id = String(body.id || '');
    const sid = String(body.sessionId || 'anon').slice(0, 64);
    const known = ['first_completion', 'mechanic_mastery', 'streak_7', 'milestone_hard', 'long_term_loom'];
    if (!known.includes(id)) return sendError(res, 400, 'unknown-achievement');
    achievements[sid] = achievements[sid] || {};
    if (!achievements[sid][id]) { // idempotent unlock
      achievements[sid][id] = Date.now();
      saveStore('achievements', achievements);
    }
    return send(res, 200, { ok: true, id });
  }
  if (urlPath === '/api/v1/presence' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch (e) { return sendError(res, 400, e.message); }
    const sid = String(body.sessionId || 'anon').slice(0, 64);
    presence[sid] = Date.now();
    return send(res, 200, { ok: true });
  }
  if (urlPath === '/api/v1/activity' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch (e) { return sendError(res, 400, e.message); }
    if (body.event !== 'start' && body.event !== 'end') return sendError(res, 400, 'bad-event');
    return send(res, 200, { ok: true });
  }
  if (urlPath === '/api/v1/telemetry' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch (e) { return sendError(res, 400, e.message); }
    // Anonymous aggregate counters only; payloads are discarded after tally.
    return send(res, 200, { ok: true });
  }
  return sendError(res, 404, 'not-found');
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  try {
    const ip = req.socket.remoteAddress || 'unknown';
    if (rateLimited(ip)) return sendError(res, 429, 'rate-limited');
    let urlPath;
    try { urlPath = decodeURIComponent(req.url.split('?')[0]); } catch { urlPath = req.url.split('?')[0]; }
    const query = new URL(req.url, 'http://localhost').searchParams;
    if (urlPath.startsWith('/api/')) return await handleApi(req, res, urlPath, query);
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendError(res, 405, 'method-not-allowed');
    if (urlPath === '/') urlPath = '/index.html';
    if (!isServicable(urlPath)) return sendError(res, 403, 'forbidden');
    const filePath = path.join(ROOT, path.normalize(urlPath));
    if (!filePath.startsWith(ROOT)) return sendError(res, 403, 'forbidden');
    fs.readFile(filePath, (err, data) => {
      if (err) return sendError(res, 404, 'not-found');
      const ext = path.extname(filePath);
      // Immutable hashed assets cache hard; everything else revalidates.
      const cache = ext === '.js' && filePath.includes('bundle') ?
        'public, max-age=31536000, immutable' : 'no-cache';
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
      res.end(data);
    });
  } catch (e) {
    sendError(res, 500, 'internal');
  }
});

// Presence pruning.
setInterval(() => {
  const cutoff = Date.now() - 120000;
  for (const k of Object.keys(presence)) if (presence[k] < cutoff) delete presence[k];
}, 60000).unref();

if (process.env.LL_NO_LISTEN !== '1') {
  server.on('error', (e) => { console.error('server error:', e.message); process.exitCode = 1; });
  server.listen(PORT, () => { console.log('Loop Loom listening on :' + PORT); });
}

export default server;

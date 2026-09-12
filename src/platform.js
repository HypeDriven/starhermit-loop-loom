'use strict';

// Loop Loom — platform: StarHermit launch-token handshake (fragment
// #game_token, 45-min refresh), authenticated REST adapter, account nickname,
// cloud-save mirror (zip+base64) and read-only leaderboards. Hosted mode
// activates iff a fragment token was read; query-param tokens are a
// local-dev fallback for the repo's own server.js. The game is fully
// playable offline; every host call degrades gracefully.

import * as serverTime from './server-time.js';
import { getSessionId } from './session.js';

let launchToken = ''; // short-lived launch token; NEVER persisted to storage.
let fromFragment = false;
let userSub = '';     // JWT sub claim (user id).
let gameScope = '';   // JWT game_scope claim (the game slug / cloud key).
let nickname = '';
let online = false;
let syncState = 'offline'; // 'synced' | 'saving' | 'offline' | 'error'
let refreshTimer = 0;
let saveTimer = 0;
let pendingDoc = null;
let hostedBoard = null;
const nickCache = new Map();

export function getLaunchToken() { return launchToken; }
export function isOnline() { return online; }
export function isHosted() { return fromFragment; } // hosted iff a fragment token was read
export function getGameScope() { return gameScope; }
export function getNickname() { return nickname; }
export function getSyncStatus() { return syncState; }
export function getHostedBoard() { return hostedBoard; }

// Base64url-decode the JWT payload segment (no signature verification).
function decodeJwtPayload(t) {
  try {
    const seg = String(t).split('.')[1];
    if (!seg) return null;
    const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64 + '='.repeat((4 - b64.length % 4) % 4)));
  } catch { return null; }
}

function acceptToken(t, fragment) {
  launchToken = t || '';
  fromFragment = !!(fragment && launchToken);
  const claims = decodeJwtPayload(launchToken);
  userSub = claims && typeof claims.sub === 'string' ? claims.sub : '';
  gameScope = claims && typeof claims.game_scope === 'string' ? claims.game_scope : '';
  if (userSub && !nickname) nickname = 'Player ' + userSub.slice(0, 8);
  scheduleRefresh(45 * 60 * 1000);
}

export function setLaunchToken(t) { acceptToken(t, false); } // local-dev injection

// Read the launch token from the host shell, then scrub the URL. The
// platform delivers it in the fragment (#game_token=<jwt>[&session_id=…]);
// query params are kept ONLY as local-dev fallbacks.
export function handshake() {
  try {
    const u = new URL(window.location.href);
    if (u.hash.length > 1) {
      const frag = new URLSearchParams(u.hash.slice(1));
      const t = frag.get('game_token');
      if (t) {
        acceptToken(t, true);
        window.history.replaceState({}, '', u.pathname + u.search);
        return;
      }
    }
    const t = u.searchParams.get('launch_token') || u.searchParams.get('token');
    if (t) {
      acceptToken(t, false);
      u.searchParams.delete('launch_token');
      u.searchParams.delete('token');
      window.history.replaceState({}, '', u.pathname + u.search);
    }
  } catch { /* non-browser context */ }
}

async function api(path, opts, retries) {
  const headers = { 'Content-Type': 'application/json' };
  if (launchToken) headers.Authorization = 'Bearer ' + launchToken;
  const attempts = (retries == null ? 1 : retries) + 1;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(path, Object.assign({}, opts, { headers }));
      if (r.status === 429) { // rate limit: recoverable UI state
        const wait = Math.min(4000, 500 * (i + 1));
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      const body = await r.json().catch(() => ({}));
      if (!r.ok) return { ok: false, error: body.error || ('http-' + r.status) };
      online = true;
      return { ok: true, data: body };
    } catch {
      online = false;
      if (i + 1 < attempts) await new Promise((res) => setTimeout(res, 300 * (i + 1)));
    }
  }
  return { ok: false, error: 'offline' };
}

function authHeaders(extra) {
  const h = Object.assign({}, extra || {});
  if (launchToken) h.Authorization = 'Bearer ' + launchToken;
  return h;
}

// Token lifetime is 60 min; re-mint on a 45-min cadence, retrying a failed
// refresh after ~60 s. Scoped launch tokens may re-mint with the current one.
function scheduleRefresh(ms) {
  clearTimeout(refreshTimer);
  refreshTimer = 0;
  if (!isHosted() || !gameScope || !launchToken) return;
  refreshTimer = setTimeout(refreshToken, ms || 45 * 60 * 1000);
}

async function refreshToken() {
  const r = await api('/api/v1/games/' + encodeURIComponent(gameScope) + '/launch-token', { method: 'POST', body: '{}' }, 0);
  const t = r.ok && r.data ? (r.data.token || r.data.launchToken) : '';
  if (typeof t === 'string' && t) launchToken = t;
  scheduleRefresh(t ? 45 * 60 * 1000 : 60 * 1000);
}

// ---------------------------------------------------------------------------
// Minimal ZIP writer/reader (stored entries only, no compression).
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function zipStore(name, dataBytes) {
  const enc = new TextEncoder();
  const nameB = enc.encode(name);
  const crc = crc32(dataBytes);
  const out = [];
  const u16 = (v) => out.push(v & 0xff, (v >> 8) & 0xff);
  const u32 = (v) => out.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff);
  u32(0x04034b50); u16(20); u16(0); u16(0); u16(0); u16(0);
  u32(crc); u32(dataBytes.length); u32(dataBytes.length);
  u16(nameB.length); u16(0);
  const local = out.length;
  const head = new Uint8Array(out);
  const cd = [];
  const c16 = (v) => cd.push(v & 0xff, (v >> 8) & 0xff);
  const c32 = (v) => cd.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff);
  c32(0x02014b50); c16(20); c16(20); c16(0); c16(0); c16(0); c16(0);
  c32(crc); c32(dataBytes.length); c32(dataBytes.length);
  c16(nameB.length); c16(0); c16(0); c16(0); c16(0); c32(0); c32(0); // attrs + local-header offset
  const cdHead = new Uint8Array(cd);
  const cdOff = head.length + nameB.length + dataBytes.length;
  const parts = [head, nameB, dataBytes, cdHead, nameB];
  const eocd = [];
  const e32 = (v) => eocd.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff);
  const e16 = (v) => eocd.push(v & 0xff, (v >> 8) & 0xff);
  e32(0x06054b50); e16(0); e16(0); e16(1); e16(1);
  e32(cdHead.length + nameB.length); e32(cdOff); e16(0);
  parts.push(new Uint8Array(eocd));
  const total = parts.reduce((n, p) => n + p.length, 0);
  const buf = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { buf.set(p, o); o += p.length; }
  return buf;
}
function unzipFirstEntry(zipBytes) {
  // Stored single-entry reader: scan local headers for compression 0.
  const dv = new DataView(zipBytes.buffer, zipBytes.byteOffset, zipBytes.byteLength);
  let off = 0;
  while (off + 30 <= zipBytes.length && dv.getUint32(off, true) === 0x04034b50) {
    const method = dv.getUint16(off + 8, true);
    const size = dv.getUint32(off + 18, true);
    const nameLen = dv.getUint16(off + 26, true);
    const extraLen = dv.getUint16(off + 28, true);
    const dataOff = off + 30 + nameLen + extraLen;
    if (method !== 0) throw new Error('unsupported zip entry');
    return zipBytes.slice(dataOff, dataOff + size);
  }
  throw new Error('bad zip');
}
function bytesToBase64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000)
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function base64ToBytes(b64) {
  const s = atob(b64);
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
  return b;
}
export { zipStore, unzipFirstEntry, bytesToBase64, base64ToBytes };

// ---------------------------------------------------------------------------
// Cloud save: ONE slot keyed by the game slug; zip+base64. localStorage stays
// the offline cache, the cloud is a mirror; on conflict the remote wins.
// ---------------------------------------------------------------------------

export async function cloudLoad() {
  if (!isHosted() || !gameScope) return null;
  try {
    const r = await fetch('/api/v1/me/cloud-saves/' + encodeURIComponent(gameScope), { headers: authHeaders() });
    if (!r.ok) { syncState = r.status === 404 ? 'synced' : 'offline'; return null; }
    const doc = JSON.parse(new TextDecoder().decode(unzipFirstEntry(new Uint8Array(await r.arrayBuffer()))));
    syncState = 'synced';
    online = true;
    return doc;
  } catch { syncState = 'offline'; return null; }
}

export function cloudSave(doc) {
  if (!isHosted() || !gameScope || !doc) return;
  pendingDoc = doc;
  syncState = 'saving';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushCloudSave, 2000); // ~2 s debounce
}

async function flushCloudSave() {
  clearTimeout(saveTimer);
  saveTimer = 0;
  const doc = pendingDoc;
  pendingDoc = null;
  if (!doc || !isHosted() || !gameScope) return;
  try {
    const zip = zipStore('save.json', new TextEncoder().encode(JSON.stringify(doc)));
    const r = await fetch('/api/v1/me/cloud-saves/' + encodeURIComponent(gameScope), {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ dataBase64: bytesToBase64(zip) }),
    });
    syncState = r.ok ? 'synced' : 'offline';
    if (r.ok) online = true;
  } catch { syncState = 'offline'; }
}

// Flush a pending debounced save when the page is hidden or torn down.
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { if (saveTimer) flushCloudSave(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && saveTimer) flushCloudSave();
  });
}

// ---------------------------------------------------------------------------
// Account nickname via the profile route (NEVER /api/v1/me, never usernames).
// ---------------------------------------------------------------------------

export async function fetchProfile() {
  if (!isHosted() || !userSub) return false;
  const r = await api('/api/v1/users/' + encodeURIComponent(userSub) + '/profile', { method: 'GET' }, 1);
  if (r.ok && r.data) {
    const n = typeof r.data.nickname === 'string' ? r.data.nickname.trim() : '';
    nickname = n || ('Player ' + String(r.data.id || userSub).slice(0, 8));
    nickCache.set(userSub, nickname);
    return true;
  }
  if (!nickname) nickname = 'Player ' + userSub.slice(0, 8);
  return false;
}

async function resolveNickname(userId) {
  const id = String(userId || '');
  if (!id) return '';
  if (nickCache.has(id)) return nickCache.get(id);
  let name = 'Player ' + id.slice(0, 8);
  const r = await api('/api/v1/users/' + encodeURIComponent(id) + '/profile', { method: 'GET' }, 0);
  if (r.ok && r.data) {
    const n = typeof r.data.nickname === 'string' ? r.data.nickname.trim() : '';
    if (n) name = n;
  }
  nickCache.set(id, name);
  return name;
}

// ---------------------------------------------------------------------------
// Leaderboards are script/elo-owned: on-platform they are READ-ONLY via the
// documented routes. Personal bests stay local and cloud-mirrored.
// ---------------------------------------------------------------------------

export async function refreshHostedBoard() {
  hostedBoard = null;
  if (!isHosted() || !gameScope) return null;
  const g = await api('/api/v1/games/' + encodeURIComponent(gameScope), { method: 'GET' }, 1);
  const leaderboardId = g.ok && g.data ? g.data.leaderboardId : null;
  if (!leaderboardId) return null; // no board: local records only
  const e = await api('/api/v1/leaderboards/' + encodeURIComponent(leaderboardId) +
    '/entries?pageSize=8', { method: 'GET' }, 1);
  const entries = e.ok && e.data && Array.isArray(e.data.entries) ? e.data.entries : null;
  if (!entries) return null;
  hostedBoard = await Promise.all(entries.slice(0, 8).map(async (en) => ({
    score: en.score | 0,
    name: await resolveNickname(en.userId != null ? en.userId : en.user),
  })));
  return hostedBoard;
}

// ---------------------------------------------------------------------------
// Local-dev backend (the repo's own server.js). These routes exist only on
// the development server; hosted on StarHermit the platform owns /api and
// none of them are called (no fabricated hosted routes, no console errors).
// ---------------------------------------------------------------------------

function devCall(path, body) {
  if (isHosted()) return { ok: false, error: 'offline' };
  return api(path, { method: 'POST', body: JSON.stringify(body) }, 0);
}

// Server time is a dev-server concept; the platform has no time endpoint, so
// hosted play uses the local clock for the Daily's UTC day.
export async function syncTime() {
  if (isHosted()) return null;
  return serverTime.fetchServerTime();
}

// Activity lifecycle so dev playtime is accurate.
export async function activityStart() { return devCall('/api/v1/activity', { event: 'start', sessionId: getSessionId() }); }
export async function activityEnd() { return devCall('/api/v1/activity', { event: 'end', sessionId: getSessionId() }); }

// Throttled presence heartbeat while actively playing (dev server only).
let lastBeat = 0;
export async function presenceHeartbeat() {
  if (isHosted()) return { ok: false, error: 'offline' };
  const t = Date.now();
  if (t - lastBeat < 30000) return;
  lastBeat = t;
  return devCall('/api/v1/presence', { sessionId: getSessionId(), at: t });
}

// Replay-validated score submission (dev server only; read-only on-platform).
export async function submitScore(envelope) {
  if (isHosted()) return { ok: false, error: 'read-only' };
  return api('/api/v1/scores', { method: 'POST', body: JSON.stringify(envelope) }, 1);
}

export async function fetchScores(board, day) {
  if (isHosted()) return null;
  const q = board === 'daily' && day != null ? ('?board=daily&day=' + (day | 0)) : '?board=global';
  const r = await api('/api/v1/scores' + q, { method: 'GET' }, 1);
  return r.ok ? r.data.scores : null;
}

// Achievements stay local on-platform (part of the cloud-saved doc); the dev
// server keeps durable idempotent unlocks per session id.
export async function unlockAchievement(id) {
  if (isHosted()) return { ok: true };
  return api('/api/v1/achievements', { method: 'POST', body: JSON.stringify({ id, sessionId: getSessionId() }) }, 0);
}

// Anonymous aggregate funnel events; only sent with explicit consent (dev).
export async function sendTelemetry(events, consent) {
  if (isHosted() || !consent || !Array.isArray(events) || events.length === 0) return;
  return api('/api/v1/telemetry', { method: 'POST', body: JSON.stringify({ events }) }, 0);
}

export default {
  setLaunchToken, getLaunchToken, isOnline, isHosted, handshake,
  getGameScope, getNickname, fetchProfile, getSyncStatus,
  cloudLoad, cloudSave, getHostedBoard, refreshHostedBoard, syncTime,
  activityStart, activityEnd, presenceHeartbeat,
  submitScore, fetchScores, unlockAchievement, sendTelemetry,
};

'use strict';

// Loop Loom — session: round lifecycle, validated commands, snapshots,
// undo, replay envelope, persistence, achievements, leaderboards.

import * as rules from './rules.js';

const LS = {
  settings: 'looploom.settings.v1',
  progress: 'looploom.progress.v1',
  snapshot: 'looploom.snapshot.v1',
  scores: 'looploom.scores.v1',
  sessionId: 'looploom.sessionid.v1',
  analytics: 'looploom.analytics.v1',
};

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full/blocked */ }
}

export function getSessionId() {
  let id = lsGet(LS.sessionId, null);
  if (!id) {
    id = 's' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
    lsSet(LS.sessionId, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Settings (accessibility, audio, graphics tier, tutorial completion, camera,
// rules options) — per-game, versioned.
// ---------------------------------------------------------------------------

export const DEFAULT_SETTINGS = {
  version: 1,
  music: 0.6, effects: 0.8, ambience: 0.4, voice: 0.7,
  muted: false,
  palette: 'default',
  reducedMotion: false,
  highContrast: false,
  largerText: false,
  leftHanded: false,
  holdToLift: false, // false = tap to select (toggle)
  timingAssist: false,
  haptics: true,
  quality: 'auto',
  cameraShake: true,
  tutorialSeen: {},
  telemetryConsent: false,
  difficulty: 3,
  bindings: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', confirm: 'Enter', cancel: 'Escape', undo: 'KeyU', hint: 'KeyH', pause: 'KeyP', camera: 'KeyR' },
  gamepad: { confirm: 0, cancel: 1, undo: 2, hint: 3, pause: 9 },
};

export function loadSettings() {
  const s = lsGet(LS.settings, {});
  return Object.assign({}, DEFAULT_SETTINGS, s, {
    bindings: Object.assign({}, DEFAULT_SETTINGS.bindings, s.bindings || {}),
    gamepad: Object.assign({}, DEFAULT_SETTINGS.gamepad, s.gamepad || {}),
    tutorialSeen: Object.assign({}, s.tutorialSeen || {}),
  });
}
export function saveSettings(s) { lsSet(LS.settings, s); }

// ---------------------------------------------------------------------------
// Progress (journey, achievements, daily history) — versioned + checksummed.
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS = [
  { id: 'first_completion', name: 'First Weave', text: 'Complete your first loom.' },
  { id: 'mechanic_mastery', name: 'Apprentice of the Loom', text: 'Finish every Learn lesson.' },
  { id: 'streak_7', name: 'Seven Suns', text: 'Finish the Daily Loom on 7 different days.' },
  { id: 'milestone_hard', name: 'Master Weaver', text: 'Complete a difficulty 8+ journey stage.' },
  { id: 'long_term_loom', name: 'Hundred Hands', text: 'Complete 100 rounds in total.' },
];

function checksum(obj) {
  const s = JSON.stringify(obj);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function loadProgress() {
  const def = { version: 1, journeyUnlocked: 0, journeyDone: {}, lessonsDone: {}, dailyDays: [], achievements: {}, roundsCompleted: 0, bestScores: {} };
  const doc = lsGet(LS.progress, null);
  if (!doc || doc.version !== 1 || doc.sum !== checksum(doc.data)) return def;
  return Object.assign(def, doc.data);
}
export function saveProgress(data) {
  const d = Object.assign({ version: 1 }, data, { version: 1 });
  lsSet(LS.progress, { version: 1, data: d, sum: checksum(d) });
}

// ---------------------------------------------------------------------------
// Round session
// ---------------------------------------------------------------------------

export class Session {
  // record: a content record from content.js. opts: { mode, assists }
  constructor(record, opts) {
    this.record = record;
    this.mode = (opts && opts.mode) || 'practice';
    this.assists = (opts && opts.assists) || {};
    this.state = rules.createState({
      pegs: record.pegs, cap: record.cap, colors: record.colors,
      seed: record.seed, moveLimit: record.moveLimit,
    });
    this.commands = [];       // ordered input log (replay envelope)
    this.seenCmdIds = new Set();
    this.snapshots = [];      // undo stack of prior states
    this.hashTrail = [rules.hashState(this.state)];
    this.startedAt = Date.now();
    this.endedAt = null;
    this.result = null;
    this.tutorial = record.tutorial ? { step: 0 } : null;
  }

  get status() { return this.state.status; }

  legalActions() { return rules.legalActions(this.state); }
  canMove(from, to) { return rules.canMove(this.state, from, to); }
  reason(from, to) { return rules.moveReason(this.state, from, to); }
  hint() { return rules.hint(this.state); }

  // Validated command entry point. Idempotent by command id.
  applyCommand(cmd) {
    if (!cmd || typeof cmd.id !== 'string') return { ok: false, reason: 'bad-command' };
    if (this.seenCmdIds.has(cmd.id)) return { ok: true, duplicate: true, state: this.state };
    if (this.state.status !== 'active') return { ok: false, reason: 'round-over' };
    if (cmd.type === 'move') {
      const from = cmd.from | 0, to = cmd.to | 0;
      const before = this.state;
      const r = rules.applyMove(before, from, to);
      if (!r.ok) {
        this.state = r.state; // counts the invalid attempt
        return { ok: false, reason: r.reason, state: this.state };
      }
      this.seenCmdIds.add(cmd.id);
      this.snapshots.push(rules.cloneState(before));
      this.state = r.state;
      this.commands.push({ id: cmd.id, type: 'move', from, to });
      this.hashTrail.push(rules.hashState(this.state));
      if (this.state.status !== 'active') this.finish();
      return { ok: true, moved: r.moved, state: this.state };
    }
    if (cmd.type === 'undo') {
      if (this.record.noUndo) return { ok: false, reason: 'undo-disabled' };
      if (this.snapshots.length === 0) return { ok: false, reason: 'nothing-to-undo' };
      this.seenCmdIds.add(cmd.id);
      this.state = this.snapshots.pop();
      this.state = rules.cloneState(this.state);
      this.state.undos++;
      this.state.tick++;
      this.commands.push({ id: cmd.id, type: 'undo' });
      this.hashTrail.push(rules.hashState(this.state));
      return { ok: true, state: this.state };
    }
    return { ok: false, reason: 'unknown-command' };
  }

  elapsedMs() { return (this.endedAt || Date.now()) - this.startedAt; }

  finish() {
    if (this.endedAt) return;
    this.endedAt = Date.now();
    this.result = rules.scoreComponents(this.state, this.record.par, this.elapsedMs());
    this.result.sessionId = getSessionId();
    this.result.mode = this.mode;
  }

  // Replay envelope: schema version, build/content version, seed, initial
  // hash, timestamp offset, ordered commands, periodic state hashes, result.
  replayEnvelope() {
    return {
      schema: 1,
      rulesVersion: rules.RULES_VERSION,
      contentVersion: this.record.version,
      contentId: this.record.id,
      seed: this.record.seed,
      initialHash: this.hashTrail[0],
      startedAt: this.startedAt,
      commands: this.commands.slice(),
      hashes: this.hashTrail.filter((_, i) => i % 5 === 0 || i === this.hashTrail.length - 1),
      result: this.result,
    };
  }

  snapshot() {
    return {
      record: this.record, mode: this.mode, assists: this.assists,
      state: rules.serialize(this.state), commands: this.commands,
      snapshots: this.snapshots.map((s) => rules.serialize(s)),
      hashTrail: this.hashTrail, startedAt: this.startedAt,
      tutorial: this.tutorial,
    };
  }

  static restore(snap) {
    if (!snap || !snap.record || !snap.state) return null;
    const s = new Session(snap.record, { mode: snap.mode, assists: snap.assists });
    s.state = rules.deserialize(snap.state);
    s.commands = snap.commands || [];
    s.seenCmdIds = new Set(s.commands.map((c) => c.id));
    s.snapshots = (snap.snapshots || []).map((x) => rules.deserialize(x));
    s.hashTrail = snap.hashTrail || [rules.hashState(s.state)];
    s.startedAt = snap.startedAt || Date.now();
    s.tutorial = snap.tutorial || null;
    if (s.state.status !== 'active') s.finish();
    return s;
  }
}

// Deterministic replay validation: same seed + commands must reproduce
// identical hashes and result. Used by tests and the authoritative server.
export function validateReplay(envelope, record) {
  if (!envelope || envelope.schema !== 1) return { ok: false, error: 'bad-envelope' };
  if (!record || record.seed !== envelope.seed) return { ok: false, error: 'seed-mismatch' };
  const s = new Session(record, { mode: envelope.result ? envelope.result.mode : 'replay' });
  if (rules.hashState(s.state) !== envelope.initialHash) return { ok: false, error: 'initial-hash' };
  for (const cmd of envelope.commands) {
    const r = s.applyCommand(cmd);
    if (!r.ok) return { ok: false, error: 'illegal-command:' + r.reason };
  }
  const finalHash = rules.hashState(s.state);
  const claimed = envelope.hashes[envelope.hashes.length - 1];
  if (finalHash !== claimed) return { ok: false, error: 'final-hash' };
  const mine = rules.scoreComponents(s.state, record.par, s.elapsedMs());
  const theirs = envelope.result || {};
  if ((theirs.total | 0) !== mine.total) return { ok: false, error: 'score-mismatch', expected: mine.total };
  return { ok: true, score: mine.total };
}

// ---------------------------------------------------------------------------
// Snapshot persistence (resume after backgrounding / reload)
// ---------------------------------------------------------------------------

export function saveSnapshot(session) {
  if (!session || session.status !== 'active') { clearSnapshot(); return; }
  lsSet(LS.snapshot, session.snapshot());
}
export function loadSnapshot() {
  const snap = lsGet(LS.snapshot, null);
  if (!snap) return null;
  try { return Session.restore(snap); } catch { return null; }
}
export function clearSnapshot() { try { localStorage.removeItem(LS.snapshot); } catch { /* ignore */ } }

// ---------------------------------------------------------------------------
// Local leaderboards + daily history (casual board when server is unavailable)
// ---------------------------------------------------------------------------

export function recordScore(entry) {
  const all = lsGet(LS.scores, { global: [], daily: {} });
  const e = {
    score: entry.total | 0, moves: entry.moves | 0, invalid: entry.invalid | 0,
    elapsedMs: entry.elapsedMs | 0, mode: entry.mode, contentId: entry.contentId,
    seed: entry.seed | 0, version: entry.version | 0, sessionId: entry.sessionId,
    day: entry.day == null ? null : entry.day | 0, at: Date.now(),
  };
  all.global.push(e);
  all.global.sort((a, b) => rules.compareResults(
    { total: a.score, solved: true, invalid: a.invalid, elapsedMs: a.elapsedMs, sessionId: a.sessionId },
    { total: b.score, solved: true, invalid: b.invalid, elapsedMs: b.elapsedMs, sessionId: b.sessionId }));
  all.global = all.global.slice(0, 50);
  if (e.day != null) {
    const k = String(e.day);
    all.daily[k] = all.daily[k] || [];
    all.daily[k].push(e);
    all.daily[k].sort((a, b) => b.score - a.score);
    all.daily[k] = all.daily[k].slice(0, 20);
  }
  lsSet(LS.scores, all);
  return e;
}

export function getScores(board, day) {
  const all = lsGet(LS.scores, { global: [], daily: {} });
  if (board === 'daily' && day != null) return (all.daily[String(day)] || []).slice();
  return (all.global || []).slice();
}

// ---------------------------------------------------------------------------
// Achievements — stable lowercase keys, idempotent unlocks.
// ---------------------------------------------------------------------------

export function checkAchievements(progress, session) {
  const unlocked = [];
  const grant = (id) => {
    if (!progress.achievements[id]) {
      progress.achievements[id] = Date.now();
      unlocked.push(id);
    }
  };
  if (session.result && session.result.solved) {
    progress.roundsCompleted++;
    grant('first_completion');
    if (progress.roundsCompleted >= 100) grant('long_term_loom');
    if (session.mode === 'journey') {
      const idx = parseInt(session.record.id.split('-')[1], 10) - 1;
      progress.journeyDone[session.record.id] = true;
      progress.journeyUnlocked = Math.max(progress.journeyUnlocked, Math.min(idx + 2, 48));
      if ((session.record.difficulty || 0) >= 8) grant('milestone_hard');
    }
    if (session.mode === 'learn') {
      progress.lessonsDone[session.record.id] = true;
      if (Object.keys(progress.lessonsDone).length >= 4) grant('mechanic_mastery');
    }
    if (session.mode === 'daily' && session.record.day != null) {
      if (!progress.dailyDays.includes(session.record.day)) progress.dailyDays.push(session.record.day);
      if (progress.dailyDays.length >= 7) grant('streak_7');
    }
  }
  return unlocked;
}

// ---------------------------------------------------------------------------
// Anonymous aggregate funnel counters (no raw text, no pointer trails).
// ---------------------------------------------------------------------------

export function track(eventName) {
  const allowed = ['start', 'tutorial-step', 'round-end', 'retry', 'settings-change', 'error'];
  if (!allowed.includes(eventName)) return;
  const a = lsGet(LS.analytics, {});
  a[eventName] = (a[eventName] || 0) + 1;
  lsSet(LS.analytics, a);
}

export default {
  Session, DEFAULT_SETTINGS, loadSettings, saveSettings, ACHIEVEMENTS,
  loadProgress, saveProgress, saveSnapshot, loadSnapshot, clearSnapshot,
  recordScore, getScores, checkAchievements, validateReplay, getSessionId, track,
};

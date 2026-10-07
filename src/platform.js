'use strict';

// Loop Loom — platform adapter over the shared StarHermit SDK
// (window.StarHermit from starhermit-sdk.js): launch token + renewal,
// sign-in, account nickname, game:<slug> cloud-save mirror, settings KV,
// key bindings, invite link and read-only leaderboards. Hosted mode is
// "signed in"; then the only own-server route used is GET /api/v1/time.
// Standalone (no launch token) makes no network request at all.

import * as serverTime from './server-time.js';

const SH = () => globalThis.StarHermit || null;
let nickname = '';
let syncState = 'offline'; // 'synced' | 'saving' | 'offline' | 'error'
let hostedBoard = null;
let initialized = false;
const authListeners = new Set();

export function getLaunchToken() { const sh = SH(); return (sh && sh.token) || ''; }
export function isHosted() { const sh = SH(); return !!(sh && sh.signedIn); }
export function getGameScope() { const sh = SH(); return (sh && sh.slug) || ''; }
export function getNickname() { return nickname; }
export function getSyncStatus() { return syncState; }
export function getHostedBoard() { return hostedBoard; }
export function onPlatformHost() {
  return typeof location !== 'undefined' && /\.starhermit\.com$/.test(location.hostname || '');
}
export function onAuth(fn) { authListeners.add(fn); }
export function canSignIn() { const sh = SH(); return !!sh && sh.canSignIn(); }
export function signIn() { const sh = SH(); return !!sh && sh.signIn(); }
export function inviteLink() { return isHosted() ? SH().inviteLink() : null; }
export function loadBindings(defaults) { return isHosted() ? SH().loadBindings(defaults) : Promise.resolve(defaults); }

// Local-dev injection of a token (tests / own server.js).
export function setLaunchToken(t) { const sh = SH(); if (sh) sh.setToken(t || null); }

// Read the launch token (#game_token= / #access_token=) once and scrub the URL.
export function handshake() {
  const sh = SH();
  if (!sh || initialized) return;
  initialized = true;
  sh.init();
  sh.on('saved', (ok) => { syncState = ok ? 'synced' : 'offline'; });
  sh.on('auth', (a) => {
    if (!a.signedIn) { syncState = 'offline'; hostedBoard = null; }
    for (const fn of authListeners) { try { fn(a); } catch { /* ignore */ } }
  });
  if (sh.signedIn) nickname = 'Player ' + String(sh.userId).slice(0, 6);
}

// ---------------------------------------------------------------------------
// Cloud save: the game:<slug> slot. localStorage stays the offline cache, the
// cloud is a mirror; on conflict the remote wins.
// ---------------------------------------------------------------------------

export async function cloudLoad() {
  if (!isHosted()) return null;
  const doc = await SH().loadJSON();
  syncState = 'synced';
  return doc;
}

export function cloudSave(doc) {
  if (!isHosted() || !doc) return;
  syncState = 'saving';
  SH().saveJSON(doc, 2000); // ~2 s debounce
}

export function flushCloudSave() { return isHosted() ? SH().flushSave(true) : Promise.resolve(false); }

// Flush pending saves when the page is hidden or torn down (keepalive).
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const flush = () => { if (isHosted()) { flushCloudSave(); flushSettings(); } };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
}

// ---------------------------------------------------------------------------
// Settings KV: per-player preferences mirrored key by key (changed keys only).
// ---------------------------------------------------------------------------

let lastSettings = null;
let pendingPatch = null;
let settingsTimer = 0;
export async function loadSettings() { return isHosted() ? (await SH().getSettings()) || {} : {}; }
export function primeSettings(obj) { lastSettings = JSON.stringify(obj); }
export function pushSettings(obj) {
  if (!isHosted() || lastSettings === null) return;
  const json = JSON.stringify(obj);
  if (json === lastSettings) return;
  const prev = JSON.parse(lastSettings);
  lastSettings = json;
  pendingPatch = pendingPatch || {};
  for (const k of Object.keys(obj)) {
    if (JSON.stringify(obj[k]) !== JSON.stringify(prev[k])) pendingPatch[k] = obj[k];
  }
  clearTimeout(settingsTimer);
  settingsTimer = setTimeout(flushSettings, 1500);
}
export function flushSettings() {
  clearTimeout(settingsTimer);
  settingsTimer = 0;
  if (!pendingPatch || !isHosted()) return Promise.resolve(null);
  const patch = pendingPatch;
  pendingPatch = null;
  return SH().patchSettings(patch);
}

// ---------------------------------------------------------------------------
// Account nickname via the profile route (NEVER /api/v1/me, never usernames).
// ---------------------------------------------------------------------------

export async function fetchProfile() {
  if (!isHosted()) return false;
  const p = await SH().profile();
  if (p) nickname = p.displayName;
  return !!(p && p.nickname);
}

async function resolveNickname(userId) {
  const id = String(userId || '');
  if (!id) return '';
  const p = await SH().profile(id);
  return p ? p.displayName : 'Player ' + id.slice(0, 6);
}

// ---------------------------------------------------------------------------
// The title rail reads the platform board; personal bests stay local and
// cloud-mirrored. Finished rounds post through submitScore below.
// ---------------------------------------------------------------------------

export async function refreshHostedBoard() {
  hostedBoard = null;
  if (!isHosted()) return null;
  const lb = await SH().leaderboard(null, { pageSize: 8 });
  if (!lb || !lb.board || !(lb.items || []).length) return null; // no board: local records only
  hostedBoard = await Promise.all(lb.items.slice(0, 8).map(async (en) => ({
    score: en.score | 0,
    name: await resolveNickname(en.userId),
  })));
  return hostedBoard;
}

// Signed in: post a finished round's total to the high-score board through
// score-script.js. Resolves { posted, rank }. Standalone: no request.
export async function submitScore(total) {
  const sh = SH();
  if (!sh || !isHosted()) return { posted: false, rank: null };
  const keys = await sh.submitScores({ 'high-score': total }).catch(() => []);
  if (keys.indexOf('high-score') < 0) return { posted: false, rank: null };
  try {
    const r = await sh.leaderboard('high-score', { pageSize: 100 });
    const me = (r.items || []).find((i) => i.userId === sh.userId);
    return { posted: true, rank: me ? me.rank : null };
  } catch (e) { return { posted: true, rank: null }; }
}

// Signed in only: round-trip-adjusted GET /api/v1/time sets the Daily's UTC
// day. Standalone uses the local clock and makes no request.
export async function syncTime() {
  if (!isHosted()) return null;
  return serverTime.fetchServerTime(null, { Authorization: 'Bearer ' + getLaunchToken() });
}

export default {
  setLaunchToken, getLaunchToken, isHosted, handshake,
  getGameScope, getNickname, fetchProfile, getSyncStatus, onAuth, onPlatformHost,
  canSignIn, signIn, inviteLink, loadBindings,
  loadSettings, primeSettings, pushSettings, flushSettings,
  cloudLoad, cloudSave, flushCloudSave, getHostedBoard, refreshHostedBoard, syncTime, submitScore,
};

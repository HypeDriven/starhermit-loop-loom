'use strict';

// Loop Loom — platform: token-aware REST adapter, retries, rate-limit
// handling, telemetry consent, presence heartbeats, activity lifecycle.
// The game is fully playable offline; every host call degrades gracefully.

import * as serverTime from './server-time.js';
import { getSessionId } from './session.js';

let launchToken = ''; // short-lived launch token; NEVER persisted to storage.
let online = false;

export function setLaunchToken(t) { launchToken = t || ''; }
export function getLaunchToken() { return launchToken; }
export function isOnline() { return online; }

// Read the launch token from the host shell (query param), then scrub the URL.
export function handshake() {
  try {
    const u = new URL(window.location.href);
    const t = u.searchParams.get('launch_token');
    if (t) {
      setLaunchToken(t);
      u.searchParams.delete('launch_token');
      window.history.replaceState({}, '', u.pathname + u.search);
    }
  } catch { /* non-browser context */ }
}

async function api(path, opts, retries) {
  if (typeof location !== 'undefined' && /^[0-9a-f-]{36}\.starhermit\.com$/i.test(location.hostname)) {
    return { ok: false, error: 'offline' };
  }
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

export async function syncTime() { return serverTime.fetchServerTime(); }

// Activity lifecycle so host playtime is accurate.
export async function activityStart() { return api('/api/v1/activity', { method: 'POST', body: JSON.stringify({ event: 'start', sessionId: getSessionId() }) }, 0); }
export async function activityEnd() { return api('/api/v1/activity', { method: 'POST', body: JSON.stringify({ event: 'end', sessionId: getSessionId() }) }, 0); }

// Throttled presence heartbeat while actively playing.
let lastBeat = 0;
export async function presenceHeartbeat() {
  const t = Date.now();
  if (t - lastBeat < 30000) return;
  lastBeat = t;
  return api('/api/v1/presence', { method: 'POST', body: JSON.stringify({ sessionId: getSessionId(), at: t }) }, 0);
}

// Score submission with replay envelope for authoritative validation.
export async function submitScore(envelope) {
  return api('/api/v1/scores', { method: 'POST', body: JSON.stringify(envelope) }, 1);
}

export async function fetchScores(board, day) {
  const q = board === 'daily' && day != null ? ('?board=daily&day=' + (day | 0)) : '?board=global';
  const r = await api('/api/v1/scores' + q, { method: 'GET' }, 1);
  return r.ok ? r.data.scores : null;
}

export async function unlockAchievement(id) {
  return api('/api/v1/achievements', { method: 'POST', body: JSON.stringify({ id, sessionId: getSessionId() }) }, 0);
}

// Anonymous aggregate funnel events; only sent with explicit consent.
export async function sendTelemetry(events, consent) {
  if (!consent || !Array.isArray(events) || events.length === 0) return;
  return api('/api/v1/telemetry', { method: 'POST', body: JSON.stringify({ events }) }, 0);
}

export default {
  setLaunchToken, getLaunchToken, isOnline, handshake, syncTime,
  activityStart, activityEnd, presenceHeartbeat,
  submitScore, fetchScores, unlockAchievement, sendTelemetry,
};

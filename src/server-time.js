'use strict';

// Loop Loom — server time (UTC ms) with round-trip-adjusted offset. Only
// called when signed in (platform.syncTime); standalone uses the local clock.
let offsetMs = 0;
let synced = false;

export function getOffset() { return offsetMs; }
export function isSynced() { return synced; }

// Fetch server time; returns null when the host API is unavailable (offline).
export async function fetchServerTime(fetchImpl, headers) {
  const f = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!f) return null;
  try {
    const t0 = Date.now();
    const r = await f('/api/v1/time', { method: 'GET', headers: headers || {} });
    if (!r.ok) return null;
    const j = await r.json();
    const st = Number(j.serverTime ?? j.now ?? j.time);
    if (!Number.isFinite(st)) return null;
    offsetMs = st - ((t0 + Date.now()) >> 1);
    synced = true;
    return st;
  } catch {
    return null;
  }
}

export function now() { return Date.now() + offsetMs; }

// Current UTC day number, synchronized when possible.
export function utcDay() { return Math.floor(now() / 86400000); }

export default { getOffset, isSynced, fetchServerTime, now, utcDay };

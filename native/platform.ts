// The game's data and the StarHermit platform, on the runtime's modules:
// - session.js keeps its records in localStorage; here a stand-in over the
//   runtime: the progress (looploom.progress.v1, checksummed) and the local
//   score boards (looploom.scores.v1) are the game's save (starhermit:storage
//   `saves`, on the device and in the player's cloud slot), the round in
//   progress ("Resume saved round"), the session id and the anonymous usage
//   counters stay in the device's key/value storage, as they stayed in the
//   browser's localStorage;
// - two devices' saves merge on a conflict through session.js mergeDocs (the
//   browser build's saveconflict merge); the slot the browser build wrote
//   (the JS SDK's saveJSON of the whole cloud document under game:<slug>)
//   shows as foreign: it is merged in and replaced once, and its game options
//   adopted where this game has not set them;
// - the game's own options (palette, left-handed tray, hold to lift, timing
//   assistance, haptics, usage counters, practice difficulty) are engine
//   `settings` (game.<key>, synced with the account); the browser build's
//   values in the account's settings KV are migrated, then all its KV keys
//   removed;
// - the player, the invite link, the platform's clock for the Daily, the
//   high-score board for the rail, and posting a finished round's total
//   through score-script.js (a practice session whose socket carries
//   { type: 'result', scores }, as the JS SDK's submitScores did) with the
//   rank on the board.
import type { JsonValue } from "starhermit:engine";
import {
  connectGame, inviteLink as fetchInviteLink, leaderboards, onPlayerChange, player, serverNow, serverTime, sessions, type Leaderboard,
} from "starhermit:platform";
import { saves, settings as store, storage } from "starhermit:storage";
import * as S from "../src/save.js";
import { Sess, type Doc } from "./game.ts";

export interface Options {
  palette: string; leftHanded: boolean; holdToLift: boolean; timingAssist: boolean; haptics: boolean; telemetryConsent: boolean; difficulty: number;
}
type Key = keyof Options;
const Save = S as unknown as {
  DEFAULT_OPTIONS: Options; OPTION_KEYS: Key[]; BROWSER_KEYS: string[]; PALETTE_IDS: string[];
  pickOptions(raw: unknown): Partial<Options>;
  saveData(doc: unknown): Doc;
  sameData(a: unknown, b: unknown): boolean;
  readForeign(text: string | null): { doc: Doc; options: Partial<Options> } | null;
};
export const PALETTE_IDS = Save.PALETTE_IDS;

// --- session.js's localStorage ------------------------------------------------------------------
const SAVED_KEYS = new Set(["looploom.progress.v1", "looploom.scores.v1"]);
const inSave = new Map<string, string>();
let dirty = false;
const local = {
  getItem(key: string): string | null {
    if (SAVED_KEYS.has(key)) return inSave.get(key) ?? null;
    try { return storage.getText(key); } catch { return null; }
  },
  setItem(key: string, value: string): void {
    if (SAVED_KEYS.has(key)) { inSave.set(key, String(value)); dirty = true; return; }
    if (key === "looploom.settings.v1") return; // the options are engine settings here
    try { storage.set(key, String(value)); } catch (e) { console.warn(`storage ${key}: ${String(e)}`); }
  },
  removeItem(key: string): void {
    if (SAVED_KEYS.has(key)) { inSave.delete(key); dirty = true; return; }
    try { storage.remove(key); } catch { /* gone */ }
  },
};
(globalThis as unknown as { localStorage: typeof local }).localStorage = local;

// --- the save ------------------------------------------------------------------------------
let lastSavedAt = 0;
const mergedListeners = new Set<() => void>();
/** fn() after progress from the account (another device, the browser build) was merged in. */
export function onProgressMerged(fn: () => void): void { mergedListeners.add(fn); }
function merged(): void { for (const fn of mergedListeners) fn(); }

/** Saves progress and scores (device at once, the account debounced by the runtime). */
export function persist(opts: { replaceForeign?: boolean } = {}): void {
  dirty = false;
  try {
    saves.save(Save.saveData(Sess.exportDoc()) as unknown as JsonValue, { schema: 1, ...opts });
    lastSavedAt = saves.load()?.savedAt ?? lastSavedAt;
  } catch (e) { console.warn(`save: ${String(e)}`); }
}
/** Each frame: a progress or score write by session.js reaches the save. */
export function flushWrites(): void { if (dirty) persist(); }
/** Merges another document into the live one; whether anything changed (then saved). */
function adopt(other: unknown): boolean {
  const mine = Sess.exportDoc();
  const next = Sess.mergeDocs(other, mine);
  if (Save.sameData(next, mine)) return false;
  Sess.importDoc({ ...next, settings: null });
  persist();
  return true;
}
saves.onConflict((localSave, remote) => ({
  merged: Save.saveData(Sess.mergeDocs(remote.data, localSave?.data ?? null)) as unknown as JsonValue,
}));
saves.onStatus((_status, state) => {
  if (state === "foreign") { migrateForeign(); return; }
  const cur = saves.load();
  if (cur && cur.savedAt !== lastSavedAt) {
    lastSavedAt = cur.savedAt;
    if (adopt(cur.data)) merged();
  }
});
/** The browser build's cloud document: merged with this device's, saved over it once. */
function migrateForeign(): void {
  const old = saves.foreign();
  if (!old) return;
  const f = Save.readForeign(old.text);
  let changed = false;
  if (f) {
    changed = adopt(f.doc);
    for (const [k, v] of Object.entries(f.options)) adoptOption(k as Key, v);
  }
  persist({ replaceForeign: true });
  if (changed) merged();
}

/** For the status line: local (a guest) | syncing | saving | synced | offline. */
export function syncState(): "local" | "syncing" | "saving" | "synced" | "offline" {
  if (!player()) return "local";
  const st = saves.state();
  if (st === "error" || st === "read-blocked") return "offline";
  if (st === "loading" || st === "foreign") return "syncing";
  if (st === "uploading" || saves.status() === "pending") return "saving";
  return "synced";
}
export function flush(): void { flushWrites(); void saves.flush().catch(() => undefined); }

// --- the game's options --------------------------------------------------------------------
export const options: Options = { ...Save.DEFAULT_OPTIONS };
const KEYS = Save.OPTION_KEYS;
const optionListeners = new Set<() => void>();
export function onOptionsChange(fn: () => void): void { optionListeners.add(fn); }
function optionsChanged(): void { for (const fn of optionListeners) fn(); }
function check<K extends Key>(key: K, v: unknown): Options[K] | undefined { return Save.pickOptions({ [key]: v })[key] as Options[K] | undefined; }
function readOption(key: Key): void {
  let v: JsonValue | undefined;
  try { v = store.get(key); } catch { return; }
  const ok = check(key, v);
  if (ok !== undefined) (options as unknown as Record<string, unknown>)[key] = ok;
}
/** A migrated value, kept unless this game set the key since. */
function adoptOption(key: Key, value: unknown): void {
  const v = check(key, value);
  if (v === undefined) return;
  try {
    if (store.get(key) !== undefined) return;
    store.set(key, v as JsonValue);
    (options as unknown as Record<string, unknown>)[key] = v;
    optionsChanged();
  } catch { /* keep the device's */ }
}
/** Changes one of the game's options (device and account). */
export function setOption<K extends Key>(key: K, value: Options[K]): void {
  if (options[key] === value) return;
  options[key] = value;
  try { store.set(key, value as JsonValue); } catch (e) { console.warn(`option ${key}: ${String(e)}`); }
  optionsChanged();
}
// The browser build patched its whole settings object into the account's settings KV key by key (plus the
// language helper's ui.language): the game's options carry over (unless set here since), then all are removed.
function importLegacy(): void {
  const keys = store.legacyKeys();
  if (!keys) return;
  for (const key of keys) if ((KEYS as string[]).includes(key)) adoptOption(key as Key, store.legacy(key));
  for (const key of keys) if (Save.BROWSER_KEYS.includes(key)) store.removeLegacy(key);
}

/** Reads the device's save and the game's options (from onStart). */
export function initPlatform(): void {
  const cur = saves.load();
  lastSavedAt = cur?.savedAt ?? 0;
  if (cur) Sess.importDoc({ ...Save.saveData(cur.data), settings: null });
  dirty = false;
  for (const k of KEYS) readOption(k);
  store.onChange((key) => {
    if (!(KEYS as string[]).includes(key)) return;
    readOption(key as Key);
    optionsChanged();
  });
  store.onLegacy(importLegacy);
  importLegacy();
  if (saves.state() === "foreign") migrateForeign();
  optionsChanged();
  refreshPlayer();
  void serverTime().catch(() => undefined);
}

// --- the player and the clock ------------------------------------------------------
export function signedIn(): boolean { return !!player(); }
export function displayName(): string { return player()?.displayName ?? ""; }
let invite: string | null = null;
/** The invite link, fetched ahead so a button press can copy it at once. */
export function inviteLink(): string | null { return player() ? invite : null; }
function refreshPlayer(): void {
  invite = null;
  board = undefined;
  top = null;
  if (!player()) return;
  fetchInviteLink().then((u) => { invite = u; }, () => { invite = null; });
  refreshBoard();
}
onPlayerChange(() => refreshPlayer());

/** Now in ms by the platform's clock when it has answered, else the device's. */
export function nowMs(): number {
  try { return serverNow() ?? Date.now(); } catch { return Date.now(); }
}
/** The Daily's UTC day number (server-time.js utcDay). */
export function utcDay(): number { return Math.floor(nowMs() / 86400000); }

// --- leaderboards --------------------------------------------------------------------------
let board: Leaderboard | null | undefined;
let top: { score: number; name: string }[] | null = null;
async function highScoreBoard(): Promise<Leaderboard | null> {
  if (board !== undefined) return board;
  const list = await leaderboards.list();
  board = list.find((b) => b.key === "high-score") ?? list[0] ?? null;
  return board;
}
/** The board's top eight for the status rail (null: none or not signed in). */
export function topScores(): { score: number; name: string }[] | null { return top; }
export function refreshBoard(): void {
  if (!player()) { top = null; return; }
  void (async () => {
    try {
      const b = await highScoreBoard();
      if (!b) { top = null; return; }
      const r = await leaderboards.entries(b.id, { pageSize: 8 });
      top = r.items.length ? r.items.slice(0, 8).map((e) => ({ score: e.score ?? 0, name: e.displayName || e.username })) : null;
    } catch { top = null; }
  })();
}

/** Signed in only: post a finished round's total through score-script.js; { posted, rank }. Never rejects. */
export async function postLeaderboard(total: number): Promise<{ posted: boolean; rank: number | null }> {
  const me = player();
  if (!me) return { posted: false, rank: null };
  const score = Math.max(0, Math.round(total));
  let accepted: string[] = [];
  try {
    const sessionId = await sessions.practice();
    accepted = await new Promise<string[]>((resolve) => {
      const socket = connectGame(sessionId);
      let done = false;
      const finish = (list: string[]): void => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        socket.close();
        resolve(list);
      };
      const timer = setTimeout(() => finish([]), 15000);
      socket.on("open", () => { socket.sendCommand({ type: "result", scores: { "high-score": score } }); });
      socket.on("game", (data) => {
        const d = data as { type?: string; accepted?: string[] } | null;
        if (d && d.type === "result-ack") finish(Array.isArray(d.accepted) ? d.accepted : []);
      });
      socket.on("error", () => finish([]));
      socket.on("stopped", () => finish([]));
      socket.on("abandoned", () => finish([]));
    });
  } catch { return { posted: false, rank: null }; }
  if (!accepted.includes("high-score")) return { posted: false, rank: null };
  refreshBoard();
  try {
    const b = await highScoreBoard();
    if (!b) return { posted: true, rank: null };
    const r = await leaderboards.entries(b.id, { pageSize: 100 });
    const mine = r.items.find((e) => e.userId === me.userId);
    return { posted: true, rank: mine ? mine.rank : null };
  } catch { return { posted: true, rank: null }; }
}

// Loop Loom on the StarHermit engine: the entry module (starhermit.txt
// engine.entry), played natively by the StarHermit client and in browsers by
// the engine's web runtime. The rules (src/rules.js), the content
// (src/content.js) and the session with its command log, undo stack, replay
// envelope, snapshot, local boards and achievements (src/session.js) are the
// browser build's, unchanged but for an injectable round clock and lazily
// built Journey stages; this module is what its main.js did around them:
// the state machine (boot → title → mode select → setup → active | tutorial
// ⇄ paused → resolving → results, every transition announced with its
// reason), the screens (title, modes, setup, play, pause, settings, results,
// help), the round lifecycle (lift, drop, refusals with their sentence, undo,
// hint, the Learn step gate, the Swift Shuttle timer), achievements and the
// local boards, posting finished rounds to the high-score board, and input:
// the round's keys and pad buttons, taps and drags on the 3D pegs, and the
// accessible peg mirror's buttons.
//
// Time is the runtime's fixed steps (60 a second): the round clock
// (session.js setClock) counts steps from the launch's wall-clock time, so
// the Swift Shuttle timer and play scripts replay exactly.
import "./i18n.ts";
import {
  clipboard, frame, onFixedUpdate, onPreferencesChange, onQuit, onRender, onResume, onStart, onSuspend, onUpdate, preferences, setFixedRate,
} from "starhermit:engine";
import { bindings, onAction, onPointerButton, onPointerMove, onTouch, vibrate } from "starhermit:input";
import * as ui from "starhermit:ui";
import { onSessionEnded, requestSignIn } from "starhermit:platform";
import * as audio from "./audio.ts";
import { Content, Rules, Sess, type Progress, type RecordT, type Session } from "./game.ts";
import { account, N, T } from "./i18n.ts";
import * as platform from "./platform.ts";
import { lookFor } from "./quality.ts";
import * as render from "./render.ts";
import { drawScreens } from "./screens.ts";
import { applyPalette, initStyles } from "./style.ts";

export type Screen = "title" | "modes" | "setup" | "play" | "pause" | "settings" | "results" | "help";
export type AppState = "boot" | "title" | "mode-select" | "active" | "tutorial" | "paused" | "resolving" | "results";
export type Mode = "learn" | "journey" | "daily" | "practice" | "challenge" | "chase";

export const app = {
  state: "boot" as AppState,
  screen: "title" as Screen,
  /** Frame the screen opened on (the press that opened it must not also act on it). */
  openedFrame: 0,
  focusNext: null as string | null,
  helpReturn: "title" as Screen,
  settingsReturn: "title" as Screen,
  current: null as Session | null,
  pendingRecord: null as RecordT | null,
  pendingMode: "practice" as Mode,
  journeyPick: 0,
  selectedPeg: null as number | null,
  kbFocusPeg: 0,
  /** Open rail drawers on narrow layouts (index.html .rail.drawer-open). */
  drawerLeft: false,
  drawerRight: false,
  results: null as null | { unlocked: string[]; reason: string },
  lb: null as null | "posting" | { posted: boolean; rank: number | null },
  toast: null as null | { text: string; until: number },
  caption: null as null | { text: string; until: number },
  hintUntil: 0,
  warnedLowTime: false,
};
export let progress: Progress = Sess.loadProgress();
export const options = platform.options;
const now = (): number => frame().time;
let cmdCounter = 0;

// ------------------------------------------------------------------ text helpers
export const REASONS: Record<string, string> = {
  "same-peg": N("That is the same peg."),
  "empty-source": N("That peg is empty."),
  "no-space": N("That peg is full."),
  "color-mismatch": N("Loops may only land on a matching color or an empty peg."),
  "round-over": N("The round is over."),
  "bad-peg": N("Unknown peg."),
};
export const MODE_NAMES: Record<string, string> = {
  learn: N("Learn"), journey: N("Journey"), daily: N("Daily"), practice: N("Practice"), challenge: N("Challenge"), chase: N("Score chase"),
};
const STATE_LABELS: Record<AppState, string> = {
  boot: N("Loading"), title: N("Title screen"), "mode-select": N("Mode selection"), active: N("Round active"), tutorial: N("Tutorial"),
  paused: N("Paused"), resolving: N("Resolving"), results: N("Results"),
};
export const colorName = (c: number): string => T(Content.COLOR_NAMES[c] ?? "");
/** main.js recordTitle: a round's title in the current language. */
export function recordTitle(record: RecordT | null): string {
  if (!record) return "";
  const id = String(record.id || "");
  if (id.startsWith("journey-")) return T("Stage {n}", { n: id.slice(8) });
  if (record.tutorial) return T(record.tutorial.title);
  if (id.startsWith("practice")) return T("Practice · difficulty {n}", { n: record.difficulty ?? options.difficulty });
  const ch = Content.CHALLENGES.find((c) => c.title === record.title);
  if (ch) return T(ch.title);
  return T(record.title || record.id);
}
export function announce(text: string): void { if (text) ui.announce(text.slice(0, 600)); }
/** main.js toast(): 2.6 s at the top. */
export function toast(text: string): void { app.toast = { text, until: now() + 2.6 }; }
function haptic(pattern: number | number[]): void {
  if (!options.haptics) return;
  try { vibrate(Array.isArray(pattern) ? pattern.reduce((a, b) => a + b, 0) : pattern); } catch { /* unsupported */ }
}
const KEY_GLYPHS: Record<string, string> = { "Arrow Left": "←", "Arrow Right": "→", "Arrow Up": "↑", "Arrow Down": "↓", Escape: "Esc" };
/** main.js keysFor: an action's effective keys, e.g. "Enter/Space". */
export function keysFor(action: string): string {
  const names = bindings(action).filter((b) => b.device === "keyboard").map((b) => KEY_GLYPHS[b.label] ?? b.label);
  return [...new Set(names)].join("/") || "—";
}
export function boardDescription(): string {
  const c = app.current;
  if (!c) return "";
  return c.state.pegs.map((p, i) => T("Peg {n}: {loops}", { n: i + 1, loops: p.length ? p.map(colorName).join(", ") : T("empty") })).join(". ");
}
export function hasSnapshot(): boolean { return !!local().getItem("looploom.snapshot.v1"); }
const local = (): { getItem(k: string): string | null } => (globalThis as unknown as { localStorage: { getItem(k: string): string | null } }).localStorage;

// ------------------------------------------------------------------ state and screens
function transition(next: AppState): void {
  app.state = next;
  announce(T(STATE_LABELS[next]));
}
export function setScreen(name: Screen, focus: string | null = null): void {
  app.screen = name;
  app.openedFrame = frame().frame;
  app.focusNext = focus;
  if (name !== "play") { app.drawerLeft = false; app.drawerRight = false; }
  ui.setFocus(null);
}
export function click(): void { audio.play("click"); }
export function back(): void { audio.play("back"); }

export function leaveToTitle(): void {
  transition("title");
  setScreen("title", "btn-play");
}
export function openModes(): void { transition("mode-select"); setScreen("modes", "mode-learn"); }
export function openSetup(mode: Mode, record: RecordT): void {
  app.pendingMode = mode;
  app.pendingRecord = record;
  transition("mode-select");
  setScreen("setup", "btn-start-round");
}
export function openHelp(from: Screen): void { app.helpReturn = from; setScreen("help", "btn-help-close"); }
export function openSettings(from: Screen): void { app.settingsReturn = from; setScreen("settings", "btn-settings-close"); }
export function closeHelp(): void { setScreen(app.helpReturn, app.helpReturn === "play" ? null : app.helpReturn === "pause" ? "btn-resume" : "btn-play"); }
export function closeSettings(): void { setScreen(app.settingsReturn, app.settingsReturn === "pause" ? "btn-resume" : "btn-play"); }

// ------------------------------------------------------------------ mode starts
const salt = (m: number): number => Math.floor(platform.nowMs()) % m;
export function playLearn(i = 0): void { openSetup("learn", Content.getLesson(i)); }
export function playJourney(i: number): void { app.journeyPick = i; openSetup("journey", Content.getJourneyStage(i)); }
export function playDaily(): void { openSetup("daily", Content.getDaily(platform.utcDay())); }
export function playPractice(): void { openSetup("practice", Content.getPractice(options.difficulty, salt(100000))); }
export function playChallenge(i: number): void { openSetup("challenge", Content.getChallenge(i, salt(100000))); }
export function playChase(): void { openSetup("chase", Content.getScoreChase(salt(1000))); }
export function setDifficulty(d: number): void {
  platform.setOption("difficulty", d);
  app.pendingRecord = Content.getPractice(d, salt(100000));
}
/** Play: the saved round when there is one, else the Journey stage at the frontier. */
export function play(): void {
  const saved = Sess.loadSnapshot();
  if (saved) { app.current = saved; resumeRound(); return; }
  playJourney(progress.journeyUnlocked);
}
export function resumeSaved(): void { const s = Sess.loadSnapshot(); if (s) { app.current = s; resumeRound(); } }

// ------------------------------------------------------------------ round lifecycle
function nextCmdId(): string { cmdCounter++; return `c${cmdCounter}-${Math.floor(clockMs).toString(36)}`; }
export function progressFraction(): number {
  const c = app.current;
  if (!c) return 0;
  const pegs = c.state.pegs;
  const total = pegs.reduce((n, p) => n + p.length, 0);
  let sorted = 0;
  for (const p of pegs) for (let i = 1; i < p.length; i++) if (p[i] === p[0]) sorted++;
  return total ? sorted / Math.max(1, total - pegs.filter((p) => p.length <= 1).length) : 0;
}
export function startRound(record: RecordT, mode: Mode): void {
  app.current = new Sess.Session(record, { mode });
  app.pendingMode = mode;
  app.selectedPeg = null;
  app.kbFocusPeg = 0;
  app.hintUntil = 0;
  app.warnedLowTime = false;
  cmdCounter = 0;
  audio.setSeed(record.seed);
  audio.startRound(progressFraction);
  render.setTheme(record.theme);
  render.resetBoard(app.current.state);
  render.clearPreview();
  Sess.track("start");
  Sess.saveSnapshot(app.current);
  audio.play("round-start");
  transition(record.tutorial ? "tutorial" : "active");
  setScreen("play");
  if (record.tutorial) showTutorialStep();
  announce(T("Round started. {title}.", { title: recordTitle(record) }) + " " + boardDescription());
}
function resumeRound(): void {
  const c = app.current!;
  app.pendingMode = c.mode as Mode;
  app.selectedPeg = null;
  audio.setSeed(c.record.seed);
  audio.startRound(progressFraction);
  render.setTheme(c.record.theme);
  render.resetBoard(c.state);
  transition("active");
  setScreen("play");
  toast(T("Round restored from your last safe snapshot."));
}
export function retry(): void {
  const c = app.current;
  if (!c) return;
  Sess.track("retry");
  startRound(c.record, c.mode as Mode);
}
export function restart(): void { const c = app.current; if (c) startRound(c.record, c.mode as Mode); }
/** results "Next": the next stage, the next lesson (then the Journey), or the same board again. */
export function next(): void {
  const c = app.current;
  if (!c || !c.result) return;
  if (c.mode === "journey" && c.result.solved && app.journeyPick + 1 < Content.journeyCount) { playJourney(app.journeyPick + 1); return; }
  if (c.mode === "learn" && c.result.solved) {
    const idx = Content.LESSONS.findIndex((l) => l.id === c.record.id);
    if (idx + 1 < Content.LESSONS.length) playLearn(idx + 1);
    else playJourney(progress.journeyUnlocked);
    return;
  }
  startRound(c.record, c.mode as Mode);
}
export function nextLabel(): string {
  const c = app.current;
  if (!c || !c.result) return T("Play again");
  if (c.mode === "journey" && c.result.solved && app.journeyPick + 1 < Content.journeyCount) return T("Next stage");
  if (c.mode === "learn" && c.result.solved) {
    const idx = Content.LESSONS.findIndex((l) => l.id === c.record.id);
    return idx + 1 < Content.LESSONS.length ? T("Next lesson") : T("Start the Journey");
  }
  return T("Play again");
}

function endRound(reason: string): void {
  const c = app.current;
  if (!c) return;
  transition("resolving");
  render.settle();
  c.finish();
  const r = c.result!;
  if (r.solved) { audio.play("win"); render.winEffect(); } else audio.play("lose");
  Sess.track("round-end");
  Sess.clearSnapshot();
  const unlocked = Sess.checkAchievements(progress, c);
  Sess.saveProgress(progress);
  if (unlocked.length) achievementAt = now() + 0.4;
  if (r.solved) Sess.recordScore({ ...r, contentId: c.record.id, seed: c.record.seed, version: c.record.version, day: c.record.day });
  platform.persist();
  app.results = { unlocked, reason };
  app.selectedPeg = null;
  postToLeaderboard(r.total);
  transition("results");
  setScreen("results", "btn-next");
  announce(T(r.solved ? "Loom complete. Total score {score}." : "Round over. Total score {score}.", { score: r.total }));
}
let achievementAt = 0;
/** Signed in: Journey, Daily, Challenge and Score Chase rounds post their total; Practice and lessons post nothing. */
function postToLeaderboard(total: number): void {
  const c = app.current!;
  if (!platform.signedIn() || !["journey", "daily", "challenge", "chase"].includes(c.mode)) { app.lb = null; return; }
  app.lb = "posting";
  const res = app.results;
  void platform.postLeaderboard(total).then((r) => { if (app.results === res) app.lb = r; });
}
export function leaderboardLine(): string | null {
  const lb = app.lb;
  if (!lb) return null;
  const a = account();
  if (lb === "posting") return a.lbPosting;
  return !lb.posted ? a.lbNotPosted : lb.rank ? a.lbRank.replace("{rank}", String(lb.rank)) : a.lbPosted;
}

function showTutorialStep(): void {
  const c = app.current!;
  const t = c.tutorial;
  const steps = c.record.tutorial!.steps;
  if (!t || t.step >= steps.length) return;
  announce(T(steps[t.step]!.prompt));
}
/** The HUD's objective line (main.js updateHud). */
export function objectiveText(): string {
  const c = app.current;
  if (!c) return "";
  const st = c.state;
  if (!c.record.tutorial) {
    const done = st.pegs.filter((p) => p.length > 1 && p.every((x) => x === p[0])).length;
    return T("Uniform pegs: {done} / {total}", { done, total: st.colors });
  }
  const steps = c.record.tutorial.steps;
  if (c.tutorial && c.tutorial.step >= steps.length) return T("Good! Finish the loom.");
  const step = c.tutorial ? steps[c.tutorial.step] : null;
  return step ? T(c.record.tutorial.title) + ": " + T(step.prompt) : T(c.record.tutorial.title);
}
export function statusText(): string {
  const c = app.current;
  if (!c) return "";
  const st = c.state;
  const score = Rules.scoreComponents(st, c.record.par, c.elapsedMs()).total;
  let txt = (st.moveLimit ? T("Moves {n}/{limit}", { n: st.moves, limit: st.moveLimit }) : T("Moves {n}", { n: st.moves })) + " · " + T("Score {n}", { n: score });
  if (c.record.timeTargetMs && !options.timingAssist) txt += ` · ${(Math.max(0, c.record.timeTargetMs - c.elapsedMs()) / 1000).toFixed(0)}s`;
  return txt;
}

// ------------------------------------------------------------------ core interaction
const active = (): boolean => !!app.current && app.current.status === "active" && (app.state === "active" || app.state === "tutorial");
export function legalTargets(): Set<number> {
  const c = app.current;
  if (!c || app.selectedPeg == null) return new Set();
  return new Set(Rules.legalActions(c.state).filter((a) => a.from === app.selectedPeg).map((a) => a.to));
}
function lowerLift(): void {
  app.selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  audio.play("deselect");
}
export function onPegChosen(i: number): void {
  const c = app.current;
  if (!c || !active()) return;
  app.hintUntil = 0;
  if (app.selectedPeg === null) {
    if (c.state.pegs[i]!.length === 0) { feedbackInvalid(i, "empty-source", false); return; }
    const g = Rules.topGroup(c.state, i)!;
    app.selectedPeg = i;
    render.setSelection({ peg: i, size: g.size });
    render.previewTargets(c.state, i);
    audio.play("select");
    haptic(8);
    announce(T(g.size > 1 ? "Lifted {n} {color} loops from peg {peg}. Choose a target peg." : "Lifted {n} {color} loop from peg {peg}. Choose a target peg.",
      { n: g.size, color: colorName(g.color), peg: i + 1 }));
    return;
  }
  if (i === app.selectedPeg) { lowerLift(); return; }
  const r = c.applyCommand({ id: nextCmdId(), type: "move", from: app.selectedPeg, to: i });
  if (!r.ok) { feedbackInvalid(i, r.reason ?? "", true); return; }
  app.selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  render.setBoard(c.state);
  render.dropEffect(i);
  audio.play("move");
  haptic(14);
  Sess.saveSnapshot(c);
  announce(T("Moved to peg {n}.", { n: i + 1 }) + " " + boardDescription());
  // Learn: the lesson advances only on the exact move it asked for.
  if (c.tutorial && c.record.tutorial) {
    const steps = c.record.tutorial.steps;
    const t = c.tutorial;
    if (t.step < steps.length) {
      const exp = steps[t.step]!.expect;
      const last = c.commands[c.commands.length - 1];
      if (last && exp && last.from === exp.from && last.to === exp.to) {
        t.step++;
        Sess.track("tutorial-step");
        if (t.step < steps.length) showTutorialStep();
        else announce(T("Lesson step complete. Now finish the loom on your own."));
      }
    }
  }
  if (c.status !== "active") endRound(c.state.terminal || "solved");
}
function feedbackInvalid(peg: number, reason: string, counted: boolean): void {
  const c = app.current!;
  if (!counted) c.applyCommand({ id: nextCmdId(), type: "invalid" });
  render.invalidFeedback(peg);
  audio.play("invalid");
  haptic([30, 40, 30]);
  const msg = T(REASONS[reason] ?? N("That move is not allowed."));
  toast(msg);
  announce(msg);
}
export function canUndo(): boolean { const c = app.current; return !!c && c.snapshots.length > 0 && !c.record.noUndo; }
export function doUndo(): void {
  const c = app.current;
  if (!c || !active()) return;
  const r = c.applyCommand({ id: nextCmdId(), type: "undo" });
  if (!r.ok) { toast(T(REASONS[r.reason ?? ""] ?? N("Nothing to undo."))); return; }
  app.selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  render.setBoard(c.state);
  audio.play("undo");
  Sess.saveSnapshot(c);
  announce(T("Move undone."));
}
export function doHint(): void {
  const c = app.current;
  if (!c || !active()) return;
  const h = c.hint();
  audio.play("hint");
  if (!h) { toast(T("No useful move found — try undo.")); return; }
  toast(T("Hint: try peg {from} → peg {to}.", { from: h.from + 1, to: h.to + 1 }));
  announce(T("Hint: move from peg {from} to peg {to}.", { from: h.from + 1, to: h.to + 1 }));
  render.setSelection({ peg: h.from, size: Rules.topGroup(c.state, h.from)!.size });
  render.previewTargets(c.state, h.from);
  app.hintUntil = now() + 1.6;
}
export function cameraReset(): void { render.resetCamera(); }
export function settleAnim(): void { render.settle(); }
export function focusPeg(i: number): void {
  const n = app.current?.state.pegs.length ?? 0;
  if (!n) return;
  app.kbFocusPeg = Math.max(0, Math.min(n - 1, i));
}

// ------------------------------------------------------------------ pause
export function togglePause(): void {
  if (app.state === "active" || app.state === "tutorial") {
    transition("paused");
    setScreen("pause", "btn-resume");
    Sess.saveSnapshot(app.current);
  } else if (app.state === "paused") {
    transition(app.current?.record.tutorial ? "tutorial" : "active");
    setScreen("play");
  }
}
export function leaveRound(): void {
  Sess.saveSnapshot(app.current);
  app.current = null;
  app.selectedPeg = null;
  render.clearPreview();
  render.setSelection(null);
  leaveToTitle();
}
export function replayTutorial(): void { playLearn(0); }

// ------------------------------------------------------------------ the platform
export function copyInvite(): void {
  const link = platform.inviteLink();
  if (!link) return;
  let ok = false;
  try { clipboard.writeText(link); ok = true; } catch { ok = false; }
  toast(ok ? account().copied : account().copyFailed);
}
export function signIn(): void { void requestSignIn().catch(() => undefined); }

// ------------------------------------------------------------------ input
// Keys and pad buttons: the arrows / D-pad move the peg focus, Confirm (Enter, Space, South) lifts or drops on
// it, Cancel (Escape, East) lowers a lift or pauses, U / West undo, H / North hint, P / Start pause, R reset
// the camera. With a widget focused (Tab), the arrows and Enter are the UI's (engine.minor 20).
onAction((e) => {
  if (!e.pressed) return;
  const inGame = app.screen === "play" && (app.state === "active" || app.state === "tutorial");
  if (e.action === "pause") { if (inGame || app.state === "paused") { if (frame().frame !== app.openedFrame) togglePause(); } return; }
  if (!inGame) return;
  const n = app.current?.state.pegs.length ?? 0;
  const uiKeys = ui.focused() !== null && e.source !== "pointer";
  switch (e.action) {
    case "left": if (!uiKeys) app.kbFocusPeg = (app.kbFocusPeg - 1 + n) % n; break;
    case "right": if (!uiKeys) app.kbFocusPeg = (app.kbFocusPeg + 1) % n; break;
    case "up": if (!uiKeys) app.kbFocusPeg = Math.max(0, app.kbFocusPeg - 1); break;
    case "down": if (!uiKeys) app.kbFocusPeg = Math.min(n - 1, app.kbFocusPeg + 1); break;
    case "confirm": if (!uiKeys) onPegChosen(app.kbFocusPeg); break;
    case "cancel":
      if (app.selectedPeg !== null) lowerLift();
      else if (frame().frame !== app.openedFrame) togglePause();
      break;
    case "undo": doUndo(); break;
    case "hint": doHint(); break;
    case "camera": cameraReset(); break;
    default: break;
  }
});

// Pointer and touch on the 3D pegs (main.js bindPointer): a tap lifts or drops on the peg under it; a press that
// moves over 14 px is a drag, released over a target it lifts at the press's peg (if nothing was lifted) and drops
// there; a press held over 600 ms without moving does nothing. Presses are queued and decided once the frame's UI
// is built, so a press on a widget is the widget's. The pointer's position also drives the camera parallax.
interface Press { kind: "down" | "move" | "up" | "cancel"; x: number; y: number }
const queued: Press[] = [];
let down: null | { x: number; y: number; at: number; peg: number | null; dragging: boolean } = null;
let lastTouch = -10;
/** A pointer button or finger lifted this frame or the last (a click or tap activates on its release). */
let pointerUpFrame = -10;
export function pointerActivation(): boolean { return frame().frame - pointerUpFrame <= 1; }
onPointerButton((e) => {
  if (!e.pressed) pointerUpFrame = frame().frame;
  if (e.button !== 0 || now() - lastTouch < 0.6) return;
  queued.push({ kind: e.pressed ? "down" : "up", x: e.x, y: e.y });
});
onPointerMove((x, y) => { if (now() - lastTouch >= 0.6) queued.push({ kind: "move", x, y }); });
onTouch((e) => {
  if (!e.primary || e.control) return;
  lastTouch = now();
  if (e.phase === "end") pointerUpFrame = frame().frame;
  queued.push({ kind: e.phase === "start" ? "down" : e.phase === "move" ? "move" : e.phase === "end" ? "up" : "cancel", x: e.x, y: e.y });
});
/** The frame's queued presses, once its UI is built (from onRender). */
export function pegInput(): void {
  const inGame = app.screen === "play" && (app.state === "active" || app.state === "tutorial");
  for (const q of queued.splice(0)) {
    const f = frame();
    if (q.kind === "move") {
      if (f.width > 0) render.setPointerParallax(q.x / f.width - 0.5, -(q.y / f.height - 0.5));
      if (down && Math.hypot(q.x - down.x, q.y - down.y) > 14 * f.scale) down.dragging = true;
      continue;
    }
    if (q.kind === "cancel") { down = null; continue; }
    if (q.kind === "down") {
      down = null;
      if (!inGame || ui.pointerOver()) continue;
      down = { x: q.x, y: q.y, at: now(), peg: render.pegAt(q.x, q.y), dragging: false };
      continue;
    }
    const d = down;
    down = null;
    if (!d || !inGame) continue;
    const peg = render.pegAt(q.x, q.y);
    if (d.dragging) {
      if (d.peg != null && peg != null) {
        if (app.selectedPeg === null && d.peg !== peg) { onPegChosen(d.peg); onPegChosen(peg); }
        else onPegChosen(peg);
      }
    } else if (now() - d.at < 0.6 && peg != null) onPegChosen(peg);
    if (peg != null) { app.kbFocusPeg = peg; ui.setFocus(null); }
  }
}

// ------------------------------------------------------------------ lifecycle
let lookKey = "";
function applyLook(): void {
  const f = frame();
  const k = `${f.quality}:${f.levelIndex}`;
  if (k === lookKey) return;
  lookKey = k;
  render.applyLook(lookFor(f.quality, f.levelIndex));
}
let clockMs = 0;
let hidden = false;
render.onEvent((name) => audio.play(name));
audio.onCaption((text) => { app.caption = { text, until: now() + 2.2 }; });

onStart(() => {
  setFixedRate(60);
  clockMs = Date.now();
  Sess.setClock(() => clockMs);
  initStyles();
  platform.initPlatform();
  progress = Sess.loadProgress();
  audio.loadSfx();
  render.setReducedMotion(preferences().reducedMotion);
  render.setPalette(options.palette);
  applyLook();
  render.setTheme("atelier");
  render.resetBoard(emptyState(Content.getJourneyStage(0)));
  transition("title");
  setScreen("title", "btn-play");
});
/** The title's loom: Journey stage 1's board behind the backdrop. */
function emptyState(rec: RecordT): Session["state"] {
  return { pegs: rec.pegs.map((p) => p.slice()), cap: rec.cap, colors: rec.colors, seed: rec.seed, moves: 0, invalid: 0, undos: 0, tick: 0, status: "active", terminal: null, moveLimit: null };
}
platform.onOptionsChange(() => render.setPalette(options.palette));
platform.onProgressMerged(() => { progress = Sess.loadProgress(); });
onPreferencesChange((p) => render.setReducedMotion(p.reducedMotion));
onSessionEnded(() => toast(account().signedOut));
// A hidden window pauses an active round and saves it; coming back says so (main.js bindLifecycle).
onSuspend(() => {
  hidden = true;
  if (app.state === "active" || app.state === "tutorial") { transition("paused"); setScreen("pause", "btn-resume"); }
  Sess.saveSnapshot(app.current);
  audio.setSuspended(true);
  platform.flush();
});
onResume(() => {
  hidden = false;
  audio.setSuspended(false);
  if (app.current && app.state === "paused") { toast(T("Welcome back — the atelier kept your place.")); Sess.saveSnapshot(app.current); }
});
onQuit(() => {
  Sess.saveSnapshot(app.current);
  platform.flush();
});

onFixedUpdate(() => {
  if (hidden) return;
  clockMs += 1000 / 60;
  // Swift Shuttle: out of time ends the round; one warning cue at ten seconds left.
  const c = app.current;
  if (c && c.status === "active" && c.record.timeTargetMs && !options.timingAssist && app.state !== "results") {
    const left = c.record.timeTargetMs - c.elapsedMs();
    if (left <= 0) {
      c.state.status = "lost";
      c.state.terminal = "time-limit";
      if (app.state === "paused") setScreen("play");
      endRound("time-limit");
    } else if (!app.warnedLowTime && left <= 10000) {
      app.warnedLowTime = true;
      audio.play("time-warning");
      toast(T("Ten seconds left."));
    }
  }
});

let frameDt = 0;
onUpdate((dt) => {
  frameDt = dt;
  applyLook();
  applyPalette(ui.preferences().highContrast);
  audio.update();
  platform.flushWrites();
  if (achievementAt && now() >= achievementAt) { achievementAt = 0; audio.play("achievement"); }
  if (app.hintUntil && now() >= app.hintUntil) {
    app.hintUntil = 0;
    if (app.selectedPeg === null) { render.setSelection(null); render.clearPreview(); }
  }
  if (app.toast && app.toast.until < now()) app.toast = null;
  if (app.caption && app.caption.until < now()) app.caption = null;
});
onRender(() => {
  drawScreens();
  pegInput();
  render.update(frameDt);
});

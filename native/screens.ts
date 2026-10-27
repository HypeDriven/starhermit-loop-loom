// The browser build's DOM shell (index.html + main.js) as starhermit:ui,
// built every frame over the 3D atelier: the menu backdrop, the centred
// overlay panels (title, modes, setup with the Journey grid / Practice
// difficulty / Challenge list, pause, settings, results, help), the play
// screen (the HUD strip: objective card, moves and score card, the ☰ panel
// and pause buttons; the left rail: objective, par and seed, Undo, Hint,
// Restart, Skip anim, progression; the right rail: mode, connection, top
// scores, achievements; the accessible peg mirror; the thumb-zone tray:
// Undo, Hint, Help, Panel, View), the caption line and the toast. The
// browser's media queries are layouts picked by the window's logical size:
// desktop (≥ 1024 px: rails at the sides), tablet (rails as drawers), portrait
// phone (≤ 700 px wide: smaller HUD cards, one tray row, 44 × 52 px pegs) and
// landscape phone (≤ 500 px tall: the tray bottom-left, the mirror
// bottom-right, 200 px drawers).
import { frame, openMenu } from "starhermit:engine";
import { requestRebind } from "starhermit:input";
import * as draw from "starhermit:draw";
import * as ui from "starhermit:ui";
import { Content, Sess } from "./game.ts";
import { account, N, T } from "./i18n.ts";
import * as platform from "./platform.ts";
import * as render from "./render.ts";
import {
  app, back, boardDescription, cameraReset, canUndo, click, closeHelp, closeSettings, colorName, copyInvite, doHint, doUndo,
  focusPeg, hasSnapshot, keysFor, leaderboardLine, leaveRound, leaveToTitle, legalTargets, MODE_NAMES, next, nextLabel,
  objectiveText, onPegChosen, openHelp, openModes, openSettings, options, play, playChallenge, playChase, playDaily, playJourney,
  playLearn, playPractice, pointerActivation, progress, recordTitle, replayTutorial, restart, resumeSaved, retry, setDifficulty, settleAnim, signIn,
  startRound, statusText, togglePause, type Screen,
} from "./main.ts";

// ------------------------------------------------------------------ layout
interface Layout { lw: number; lh: number; sc: number; desktop: boolean; portrait: boolean; landscape: boolean }
function layoutNow(): Layout {
  const f = frame();
  const sc = ui.preferences().scale;
  const sa = f.safeArea;
  const lw = Math.max(1, (f.width - sa.left - sa.right) / sc), lh = Math.max(1, (f.height - sa.top - sa.bottom) / sc);
  const landscape = lh <= 500 && lw > lh;
  const portrait = !landscape && lw <= 700 && lh >= lw;
  return { lw, lh, sc, desktop: lw >= 1024 && !landscape, portrait, landscape };
}
const lastSize = new Map<string, number>();
const prefs = (): ui.UiPreferences => ui.preferences();
const hc = (): boolean => prefs().highContrast;
function textWidth(text: string, style: string | readonly (string | ui.Style)[], kind?: "button" | "heading"): number {
  return ui.measureText(text, { ...(kind ? { kind } : {}), style: typeof style === "string" ? style : [...style] }).width / prefs().scale;
}
interface Btn { id: string; text: string; style?: string; disabled?: boolean; act: () => void; sound?: "click" | "back" | null }
const buttonWidth = (text: string, style: string): number => textWidth(text, style, "button") + 4;
const fresh = (n = 5): boolean => frame().frame - app.openedFrame <= n;
/** A button `width` wide (null: its text's); a label too long for it wraps inside. Plays the click (or back) cue. */
function button(b: Btn, width: number | null = null): boolean {
  const style = b.style ?? "btn2";
  const opts: ui.ButtonOptions = {};
  if (b.disabled) opts.disabled = true;
  const s: ui.Style = width != null ? { width } : {};
  if (width != null && buttonWidth(b.text, style) > width) {
    const inner = Math.max(20, width - 40);
    opts.content = () => { ui.style({ text: { align: "center" } }).paragraph(b.text, inner); };
  }
  const hit = ui.style(style, s).id(b.id).button(b.text, opts);
  if (hit && frame().frame !== app.openedFrame) {
    if (b.sound !== null) (b.sound === "back" ? back : click)();
    b.act();
  }
  return hit;
}
/** Buttons at their own widths in rows that wrap at `width` (CSS flex-wrap). */
function flow(label: string, list: Btn[], width: number, gap = 8, align: "start" | "center" = "center"): void {
  const rows: Btn[][] = [[]];
  let used = 0;
  for (const b of list) {
    const bw = Math.min(width, buttonWidth(b.text, b.style ?? "btn2"));
    if (rows[rows.length - 1]!.length && used + gap + bw > width) { rows.push([]); used = 0; }
    used += (rows[rows.length - 1]!.length ? gap : 0) + bw;
    rows[rows.length - 1]!.push(b);
  }
  ui.column(label, () => {
    rows.forEach((row, ri) => ui.row(`${label}-r${ri}`, () => {
      for (const b of row) button(b, buttonWidth(b.text, b.style ?? "btn2") > width ? width : null);
    }, { spacing: gap, align: "center" }));
  }, { spacing: gap, align, width });
}
/** Text up to `width` wide: one label when it fits, else a paragraph. */
function para(text: string, width: number, cls = "p", id?: string, center = false): void {
  if (!text) return;
  const styles: (string | ui.Style)[] = [cls];
  if (center) styles.push({ text: { align: "center" } });
  let u = ui.style(...styles);
  if (id) u = u.id(id);
  if (textWidth(text, styles) <= width) u.label(text);
  else u.paragraph(text, width);
}
function heading(cls: string, text: string, width: number, id?: string, center = true): void {
  const styles: (string | ui.Style)[] = [cls];
  if (center) styles.push({ text: { align: "center" } });
  if (textWidth(text, styles, "heading") <= width) (id ? ui.id(id) : ui).style(...styles).heading(text);
  else ui.style(...styles).paragraph(text, width);
}

// ------------------------------------------------------------------ the frame
export function drawScreens(): void {
  const L = layoutNow();
  const f = frame();
  render.setBottomBand(app.screen === "play" ? bottomBand(L) / L.lh : 0);
  const menu = app.state === "boot" || app.state === "title" || app.state === "mode-select";
  // The menu backdrop (index.html #backdrop): the atelier key art behind the menus, never over a round.
  if (menu) draw.box(0, 0, f.width, f.height, hc() ? "backdrop-plain" : "backdrop");
  switch (app.screen) {
    case "title": page("title", L, titleScreen, 560); break;
    case "modes": page("modes", L, modesScreen, 560); break;
    case "setup": page("setup", L, setupScreen, 560); break;
    case "pause": page("pause", L, pauseScreen, 420); break;
    case "settings": page("settings", L, settingsScreen, 560); break;
    case "results": page("results", L, resultsScreen, 560); break;
    case "help": page("help", L, helpScreen, 560); break;
    case "play": playScreen(L); break;
  }
  caption(L);
  toast(L);
  if (app.focusNext) {
    const age = f.frame - app.openedFrame;
    if (age >= 1) ui.setFocus(app.focusNext);
    if (age >= 3) app.focusNext = null;
  }
  // Escape / Back backs out of the open overlay with the softer cue (main.js bindKeyboard).
  if (ui.back() && !fresh(1)) {
    const close: Partial<Record<Screen, () => void>> = {
      help: closeHelp, settings: closeSettings, modes: leaveToTitle, setup: leaveToTitle, pause: togglePause,
    };
    const fn = close[app.screen];
    if (fn) { back(); fn(); }
  }
}

/** An overlay panel (index.html .overlay): centred, at most `max` wide (92 % of the window), scrolling inside past 86 %. */
function page(key: string, L: Layout, build: (w: number, L: Layout) => void, max: number): void {
  const narrow = L.lw <= 420;
  const padX = narrow ? 14 : 26, padY = narrow ? 18 : 22;
  const outer = Math.min(max, narrow ? L.lw - 20 : L.lw * 0.92);
  const avail = Math.max(80, L.lh * 0.86);
  const h = lastSize.get(key) ?? 0;
  const scroll = h > avail;
  const inner = outer - 2 * padX - (scroll ? 14 : 0);
  ui.place(`page-${key}`, "center", () => {
    const body = (): void => {
      const r = ui.column(`${key}-col`, () => build(inner, L), {
        style: "overlay", width: outer - (scroll ? 14 : 0), spacing: 8, align: "center",
        padding: { top: padY, bottom: padY, start: padX, end: padX },
      });
      lastSize.set(key, r.height / L.sc);
    };
    if (scroll) ui.scrollArea(`${key}-scroll`, { width: outer, height: avail }, body, fresh() ? { scrollTo: { top: 0 } } : undefined);
    else body();
  });
}
function col(label: string, w: number, list: Btn[]): void {
  ui.column(label, () => { for (const b of list) button(b, w); }, { spacing: 8, width: w, align: "center" });
}

// ------------------------------------------------------------------ title, modes, setup
const SYNC: Record<string, string> = { syncing: N("saving…"), saving: N("saving…"), synced: N("synced"), offline: N("sync error") };
function syncLabel(): string { return T(SYNC[platform.syncState()] ?? N("offline")); }
function titleScreen(w: number): void {
  heading("h1", "Loop Loom", w, "title-h");
  para(T("A textile atelier of colored loops and brass pegs."), w, "p", "tagline-1", true);
  para(T("Move loops between pegs — keeping their stack order — until every peg is one color."), w, "p", "tagline-2", true);
  const a = account();
  const list: Btn[] = [{ id: "btn-play", text: T("Play"), style: "btn", act: play }];
  if (hasSnapshot()) list.push({ id: "btn-resume-saved", text: T("Resume saved round"), act: resumeSaved });
  list.push(
    { id: "btn-modes", text: T("Modes & progress"), act: openModes },
    { id: "btn-help-title", text: T("How to play"), act: () => openHelp("title") },
    { id: "btn-title-settings", text: T("Settings"), act: () => openSettings("title") },
  );
  if (!platform.signedIn()) list.push({ id: "btn-signin", text: a.signIn, act: signIn });
  if (platform.inviteLink()) list.push({ id: "btn-invite", text: a.invite, act: copyInvite });
  col("title-nav", w, list);
  const done = Object.keys(progress.journeyDone).length;
  const who = platform.signedIn() ? (platform.displayName() || "…") + " · " : "";
  para(who + T("Journey {done}/{total} · Daily day {day}", { done, total: Content.journeyCount, day: platform.utcDay() }) + " · "
    + (platform.signedIn() ? T("cloud save {status}", { status: syncLabel() }) : T("local play")), w, "meta", "title-status", true);
}
function modesScreen(w: number): void {
  heading("h1", T("Choose a mode"), w, "modes-h");
  col("mode-list", w, [
    { id: "mode-learn", text: T("Learn — interactive lessons"), act: () => playLearn(0) },
    { id: "mode-journey", text: T("Journey — 48 stages"), act: () => playJourney(progress.journeyUnlocked) },
    { id: "mode-daily", text: T("Daily — one shared loom per UTC day"), act: playDaily },
    { id: "mode-practice", text: T("Practice — unranked, undo allowed"), act: playPractice },
    { id: "mode-challenge", text: T("Challenge — constrained goals"), act: () => playChallenge(0) },
    { id: "mode-chase", text: T("Score chase — leaderboards"), act: playChase },
    { id: "mode-back", text: T("Back"), style: "ghost", sound: "back", act: leaveToTitle },
  ]);
  para(T("Journey: {done}/{total} stages · {ach}/{achTotal} achievements · {rounds} rounds completed", {
    done: Object.keys(progress.journeyDone).length, total: Content.journeyCount, ach: Object.keys(progress.achievements).length,
    achTotal: Sess.ACHIEVEMENTS.length, rounds: progress.roundsCompleted,
  }), w, "meta", "modes-progress", true);
}
function setupScreen(w: number, L: Layout): void {
  const rec = app.pendingRecord;
  if (!rec) return;
  const mode = app.pendingMode;
  heading("h1", recordTitle(rec) || T(MODE_NAMES[mode] ?? mode), w, "setup-title");
  para(rec.tutorial ? T(rec.tutorial.text) : rec.challenge ? T(rec.challenge.text) : T("Sort every loop so each peg holds one color."), w, "p", "setup-rules", true);
  const ranked = mode === "daily" || mode === "chase";
  para(T("Solo · ~{n} min · assists: hints/undo", { n: Math.max(1, Math.round(rec.par / 3)) }) + " " + (ranked ? T("(ranked — undo lowers mastery bonus)") : T("(unranked)")),
    w, "meta", "setup-meta", true);
  if (mode === "journey") journeyGrid(w, L);
  else if (mode === "practice") {
    ui.row("practice-row", () => {
      para(T("Difficulty"), w * 0.4, "set-label");
      ui.spacer();
      const levels = Array.from({ length: 10 }, (_, i) => T("Level {n}", { n: i + 1 }));
      const pick = ui.id("practice-diff").select(T("Difficulty"), options.difficulty - 1, levels, { width: Math.min(200, w * 0.55) } as ui.WidgetOptions);
      if (pick !== options.difficulty - 1) { click(); setDifficulty(pick + 1); }
    }, { width: w, align: "center", style: "set-row" });
  } else if (mode === "challenge") {
    col("challenge-list", w, Content.CHALLENGES.map((c, i) => ({ id: `challenge-${i + 1}`, text: T(c.title) + " — " + T(c.text), act: () => playChallenge(i) })));
  }
  col("setup-actions", w, [
    { id: "btn-start-round", text: T("Start round"), style: "btn", act: () => startRound(rec, mode) },
    { id: "btn-back-title", text: T("Back"), style: "ghost", sound: "back", act: leaveToTitle },
  ]);
}
function journeyGrid(w: number, L: Layout): void {
  const gap = 6;
  const maxH = Math.max(120, L.lh * 0.36);
  const tall = (lastSize.get("stage-grid") ?? 0) > maxH;
  const gw = w - (tall ? 14 : 0);
  const cols = Math.max(1, Math.floor((gw + gap) / (64 + gap)));
  const cw = (gw - gap * (cols - 1)) / cols;
  const grid = (): void => {
    const r = ui.grid("stage-grid", () => {
      for (let i = 0; i < Content.journeyCount; i++) {
        const done = !!progress.journeyDone[`journey-${i + 1}`];
        const locked = i > progress.journeyUnlocked;
        const aria = T(done ? "Stage {n} completed" : locked ? "Stage {n} locked" : "Stage {n}", { n: i + 1 });
        const opts: ui.ButtonOptions = { content: () => { ui.style({ text: { align: "center", color: "#ffffff" } }).label(String(i + 1)); } };
        if (locked) opts.disabled = true;
        if (ui.style(done ? "stage-done" : "stage", { width: cw }).id(`stage-${i + 1}`).button(aria, opts) && !locked && !fresh(0)) { click(); playJourney(i); }
      }
    }, { columns: cols, gap, width: gw });
    lastSize.set("stage-grid", r.height / L.sc);
  };
  if (tall) ui.scrollArea("stage-scroll", { width: w, height: maxH }, grid, fresh() ? { scrollTo: { top: Math.max(0, Math.floor(progress.journeyUnlocked / cols) - 1) * (44 + gap) } } : undefined);
  else grid();
}

// ------------------------------------------------------------------ pause, settings, help
function pauseScreen(w: number): void {
  heading("h1", T("Paused"), w, "pause-h");
  col("pause-nav", w, [
    { id: "btn-resume", text: T("Resume"), style: "btn", act: togglePause },
    { id: "btn-open-settings", text: T("Settings"), act: () => openSettings("pause") },
    { id: "btn-help-pause", text: T("Help"), act: () => openHelp("pause") },
    { id: "btn-leave", text: T("Leave to title"), style: "ghost", sound: "back", act: leaveRound },
  ]);
}
const PALETTES: [string, string][] = [
  ["default", N("Default")], ["deuteranopia", N("Deuteranopia-safe")], ["protanopia", N("Protanopia-safe")],
  ["tritanopia", N("Tritanopia-safe")], ["contrast", N("High contrast")],
];
const CHECKS: [keyof platform.Options, string][] = [
  ["leftHanded", N("Left-handed controls")], ["holdToLift", N("Hold to lift (vs tap)")],
  ["timingAssist", N("Timing assistance")], ["haptics", N("Haptics")],
];
function settingsScreen(w: number): void {
  heading("h1", T("Settings"), w, "settings-h");
  para(T("Sound, graphics, language, reduced motion, high contrast and larger text are in the StarHermit Options."), w, "meta", "options-note", true);
  flow("options-row", [
    { id: "btn-options", text: T("Audio & graphics"), act: () => openMenu() },
    { id: "btn-rebind", text: T("Keyboard bindings"), act: () => requestRebind() },
  ], w);
  heading("h2", T("Accessibility"), w, "access-h");
  ui.row("palette-row", () => {
    para(T("Color palette"), w * 0.42, "set-label");
    ui.spacer();
    const idx = Math.max(0, PALETTES.findIndex(([id]) => id === options.palette));
    const pick = ui.id("set-palette").select(T("Color palette"), idx, PALETTES.map(([, l]) => T(l)), { width: Math.min(220, w * 0.55) } as ui.WidgetOptions);
    if (pick !== idx) { click(); platform.setOption("palette", PALETTES[pick]![0]); }
  }, { width: w, align: "center", style: "set-row" });
  ui.column("set-checks", () => {
    for (const [key, label] of CHECKS) {
      const cur = !!options[key];
      const nextV = ui.id(`set-${key}`).checkbox(T(label), cur);
      if (nextV !== cur) { click(); platform.setOption(key, nextV as never); }
    }
  }, { spacing: 2, width: w });
  heading("h2", T("Privacy"), w, "privacy-h");
  ui.column("set-privacy", () => {
    const cur = options.telemetryConsent;
    const nextV = ui.id("set-telemetryConsent").checkbox(T("Share anonymous usage counters"), cur);
    if (nextV !== cur) { click(); platform.setOption("telemetryConsent", nextV); }
  }, { width: w });
  col("settings-actions", w, [
    { id: "btn-replay-tutorial", text: T("Replay tutorial"), act: replayTutorial },
    { id: "btn-settings-close", text: T("Done"), style: "btn", sound: "back", act: closeSettings },
  ]);
}
function helpScreen(w: number): void {
  heading("h1", T("How to play"), w, "help-h");
  const li = (text: string, id: string): void => para("• " + text, w, "help-li", id);
  para(T("Goal:") + " " + T("move loops between pegs — keeping their stack order — until every peg holds a single color."), w, "p", "help-goal");
  heading("h2", T("Rules"), w, "help-rules", false);
  li(T("Only the top loop group lifts. Same-colored loops touching at the top move together."), "help-r1");
  li(T("A group lands on a matching color or an empty peg, never past a peg's capacity."), "help-r2");
  li(T("Invalid drops are rejected with an explanation."), "help-r3");
  heading("h2", T("Controls"), w, "help-controls", false);
  li(T("Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works."), "help-c1");
  li(T("Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.", {
    move: `${keysFor("left")} ${keysFor("right")} ${keysFor("up")} ${keysFor("down")}`, confirm: keysFor("confirm"), cancel: keysFor("cancel"),
    undo: keysFor("undo"), hint: keysFor("hint"), pause: keysFor("pause"), camera: keysFor("camera"),
  }), "help-c2");
  li(T("Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses."), "help-c3");
  heading("h2", T("Scoring"), w, "help-scoring", false);
  li(T("Completion + efficiency vs par + no-undo mastery − invalid attempts."), "help-s1");
  li(T("Ties: completion, fewer invalid actions, faster time, then session id."), "help-s2");
  col("help-actions", w, [{ id: "btn-help-close", text: T("Close"), style: "btn", sound: "back", act: closeHelp }]);
}

// ------------------------------------------------------------------ results
function resultsScreen(w: number): void {
  const c = app.current;
  const res = app.results;
  if (!c || !c.result || !res) return;
  const r = c.result;
  heading("h1", r.solved ? T("Loom complete!") : res.reason === "time-limit" ? T("Out of time") : T("Out of moves"), w, "result-headline");
  const rows: [string, string][] = [
    [T("Completion"), String(r.completion)],
    [T("Efficiency (par {par}, {moves} moves)", { par: r.par, moves: r.moves }), String(r.efficiency)],
    [T("No-undo mastery"), String(r.mastery)],
    [T("Invalid attempts"), String(r.invalidPenalty)],
    [T("Total"), String(r.total)],
    [T("Time"), `${(r.elapsedMs / 1000).toFixed(1)}s`],
  ];
  ui.column("result-score", () => rows.forEach(([k, v], i) => ui.row(`score-${i}`, () => {
    para(k, w - 90, "score-k");
    ui.spacer();
    ui.style("score-v").id(`score-${i}-v`).label(v);
  }, { width: w, align: "center", style: "score-row" })), { spacing: 2, width: w });
  if (res.unlocked.length) {
    ui.column("result-achievements", () => {
      for (const id of res.unlocked) {
        const a = Sess.ACHIEVEMENTS.find((x) => x.id === id);
        ui.row(`badge-${id}`, () => para(`★ ${a ? T(a.name) : id}`, w - 30, "badge-text"), { style: "badge" });
      }
    }, { spacing: 4, align: "center", width: w });
  }
  const best = Sess.getScores("global")[0];
  para(best ? T("Your best local score: {score} ({moves} moves).", { score: best.score, moves: best.moves }) : T("This is your first recorded score."), w, "meta", "result-compare", true);
  const lb = leaderboardLine();
  if (lb) para(lb, w, "lb", "result-lb", true);
  col("result-actions", w, [
    { id: "btn-next", text: nextLabel(), style: "btn", act: next },
    { id: "btn-retry", text: T("Retry"), act: retry },
    { id: "btn-results-title", text: T("Title"), style: "ghost", sound: "back", act: leaveToTitle },
  ]);
}

// ------------------------------------------------------------------ play
const PAD = 10;
/** Peg button size (index.html .peg-btn): 52 × 56 at least, 44 × 52 on portrait phones; tall enough for the stack. */
function pegSize(L: Layout): { w: number; h: number } {
  const cap = app.current?.state.cap ?? 4;
  const w = L.portrait ? 44 : 52;
  return { w, h: Math.max(L.portrait ? 52 : 56, 12 + cap * 16 + (cap - 1) * 2) };
}
const mirrorH = (L: Layout): number => pegSize(L).h + 16;
const trayH = 44;
/** How far up from the bottom the tray and mirror reach (logical px; the camera fits the pegs above it). */
function bottomBand(L: Layout): number {
  if (L.landscape) return Math.max(trayH, mirrorH(L)) + 8;
  return trayRows(L) * (trayH + 8) + 2 + mirrorH(L) + 14;
}
function trayRows(L: Layout): number { return L.portrait ? 1 : (lastSize.get("tray-rows") ?? 1); }

function playScreen(L: Layout): void {
  const c = app.current;
  if (!c) return;
  hud(L);
  const railTop = L.landscape ? 52 : 64;
  if (L.desktop) {
    const railH = L.lh - railTop - 76;
    ui.place("rail-left", { anchor: "top-start", x: PAD, y: railTop }, () => rail("left", 240, railH, L));
    ui.place("rail-right", { anchor: "top-end", x: PAD, y: railTop }, () => rail("right", 240, railH, L));
  } else if (app.drawerLeft || app.drawerRight) {
    // Narrow screens: a rail opens as a bottom drawer above the mirror (index.html .rail.drawer-open).
    const bottom = L.landscape ? 140 : bottomBand(L) + 8;
    const maxH = Math.min(L.lh * 0.46, L.lh - bottom - railTop);
    const w = L.landscape ? Math.min(L.lw - 2 * PAD, 420) : L.lw - 2 * PAD;
    ui.place("drawer", { anchor: L.landscape ? "bottom-start" : "bottom", x: PAD, y: bottom }, () => rail(app.drawerLeft ? "left" : "right", w, maxH, L, true));
  }
  mirror(L);
  tray(L);
  ui.target(boardDescription(), { x: 0, y: 0, width: 1, height: 1 }, { role: "label" });
}

/** The HUD strip: objective card, moves/score card, the ☰ panel and ❚❚ pause buttons. */
function hud(L: Layout): void {
  const small = L.portrait;
  const btnW = 48, btnsW = 2 * btnW + 8;
  const cls = small ? "hud-small" : "hud-text";
  const pad = small ? 8 : 12;
  const cardMax = Math.min(560, (L.lw - 2 * PAD - btnsW - 20) / 2);
  const card = (key: string, text: string): void => {
    const tw = textWidth(text, cls);
    const inner = Math.min(tw + 2, cardMax - 2 * pad);
    ui.column(`${key}-card`, () => para(text, inner, cls, key), { style: "hud-card", padding: { top: small ? 5 : 7, bottom: small ? 5 : 7, start: pad, end: pad } });
  };
  ui.place("hud-objective", { anchor: "top-start", x: PAD, y: 6 }, () => card("hud-objective", objectiveText()));
  const statusX = L.desktop ? 0 : null;
  if (statusX === 0) ui.place("hud-status", { anchor: "top", y: 6 }, () => card("hud-status", statusText()));
  else ui.place("hud-status", { anchor: "top-start", x: PAD + cardMax + 10, y: 6 }, () => card("hud-status", statusText()));
  ui.place("hud-buttons", { anchor: "top-end", x: PAD, y: 6 }, () => ui.row("hud-btns", () => {
    iconButton("btn-drawer-left", T("Open objective panel"), "menu", btnW, () => { app.drawerLeft = !app.drawerLeft; app.drawerRight = false; });
    iconButton("btn-pause", T("Pause game"), "pause", btnW, togglePause);
  }, { spacing: 8 }));
}
/** ☰ and ❚❚ drawn as bars (the glyphs draw thin or tofu in some fonts). */
function iconButton(id: string, label: string, icon: "menu" | "pause", w: number, act: () => void): void {
  const r = ui.id(id).widget(label, {
    role: "button", size: { width: w, height: 44 }, style: "btn2",
    draw: (rect, st) => {
      const k = st.scale;
      const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
      const col = st.colors.text;
      if (icon === "menu") for (const dy of [-6, 0, 6]) draw.rect(cx - 9 * k, cy + (dy - 1) * k, 18 * k, 2 * k, col);
      else for (const dx of [-6, 3]) draw.rect(cx + dx * k, cy - 8 * k, 3 * k, 16 * k, col);
    },
  });
  if (r.activated && !fresh(0)) { click(); act(); }
}

/** A rail (index.html aside.rail): left — objective, par and seed, Undo/Hint, Restart/Skip anim, progression;
 * right — mode, connection, top scores, achievements. */
function rail(side: "left" | "right", w: number, maxH: number, L: Layout, drawer = false): void {
  const key = `rail-${side}${drawer ? "-d" : ""}`;
  const h = lastSize.get(key) ?? 0;
  const scroll = h > maxH;
  const inner = w - 28 - (scroll ? 14 : 0);
  const body = (): void => {
    const r = ui.column(`${key}-col`, () => (side === "left" ? leftRail(inner) : rightRail(inner)), {
      style: "rail", width: w - (scroll ? 14 : 0), spacing: 6, ...(scroll || drawer ? {} : { height: maxH }),
    });
    lastSize.set(key, r.height / L.sc);
  };
  if (scroll) ui.scrollArea(`${key}-scroll`, { width: w, height: maxH }, body);
  else body();
}
function leftRail(w: number): void {
  const c = app.current!;
  para(T("Objective"), w, "rail-h", "rail-objective-h");
  para(c.record.challenge ? T(c.record.challenge.text) : T("Move loops between pegs until every peg holds one color."), w, "rail-p", "rail-objective");
  para(T("Par {par} · seed {seed}", { par: c.record.par, seed: (c.record.seed >>> 0).toString(16) }), w, "rail-p", "rail-progress");
  const half = (w - 8) / 2;
  ui.row("rail-row1", () => {
    button({ id: "btn-undo", text: T("Undo"), disabled: !canUndo(), act: doUndo }, half);
    button({ id: "btn-hint", text: T("Hint"), act: doHint }, half);
  }, { spacing: 8 });
  ui.row("rail-row2", () => {
    button({ id: "btn-restart", text: T("Restart"), act: restart }, half);
    button({ id: "btn-settle", text: T("Skip anim"), act: settleAnim }, half);
  }, { spacing: 8 });
  para(T("Progression"), w, "rail-h", "rail-progression-h");
  para(T("Journey: {done}/{total} stages · {ach}/{achTotal} achievements · {rounds} rounds completed", {
    done: Object.keys(progress.journeyDone).length, total: Content.journeyCount, ach: Object.keys(progress.achievements).length,
    achTotal: Sess.ACHIEVEMENTS.length, rounds: progress.roundsCompleted,
  }), w, "rail-p", "rail-journey");
}
function rightRail(w: number): void {
  const c = app.current!;
  para(T("Status"), w, "rail-h", "rail-status-h");
  para(T("Mode: {mode} · {title}", { mode: T(MODE_NAMES[c.mode] ?? c.mode), title: recordTitle(c.record) }), w, "rail-p", "rail-mode");
  para(platform.signedIn() ? T("{name} · cloud save {status}", { name: platform.displayName(), status: syncLabel() }) : T("Playing locally — scores are stored on this device."), w, "rail-p", "rail-online");
  para(T("Top scores"), w, "rail-h", "rail-scores-h");
  const hosted = platform.topScores();
  if (hosted && hosted.length) hosted.forEach((e, i) => para(`• ${e.score} · ${e.name}`, w, "rail-li", `score-li-${i}`));
  else {
    const scores = Sess.getScores(c.mode === "daily" ? "daily" : "global", c.record.day ?? null).slice(0, 8);
    scores.forEach((s, i) => para(`• ${s.score} · ${T("{n} moves", { n: s.moves })} · ${(s.elapsedMs / 1000).toFixed(0)}s`, w, "rail-li", `score-li-${i}`));
    if (!scores.length) para("• " + T("No scores yet."), w, "rail-li", "score-none");
  }
  para(T("Achievements"), w, "rail-h", "rail-ach-h");
  for (const a of Sess.ACHIEVEMENTS) {
    const got = !!progress.achievements[a.id];
    para((got ? "★ " : "☆ ") + T(a.name), w, got ? "rail-on" : "rail-dim", `ach-${a.id}`);
  }
}

/** The accessible peg mirror: one button per peg, its stack as colour glyphs (top first), the lift and legal
 * targets marked, the keyboard focus ringed. */
function mirror(L: Layout): void {
  const c = app.current!;
  const pegs = c.state.pegs;
  const { w: pw, h: ph } = pegSize(L);
  const legal = legalTargets();
  const gap = 8;
  const natural = pegs.length * pw + (pegs.length - 1) * gap + 20;
  const maxW = L.landscape ? L.lw * 0.54 : L.lw - 20;
  const scroll = natural > maxW;
  const palette = Content.PALETTES[options.palette] ?? Content.PALETTES.default!;
  const build = (): void => { ui.row("mirror-row", () => {
    pegs.forEach((p, i) => {
      const sel = app.selectedPeg === i;
      const label = T("Peg {n}: {loops}", { n: i + 1, loops: p.length ? p.map(colorName).join(", ") : T("empty") });
      const r = ui.id(`peg-${i + 1}`).widget(sel ? T("{label} (lifted)", { label }) : label, {
        role: "button", size: { width: pw, height: ph }, style: sel ? "peg-sel" : legal.has(i) ? "peg-legal" : "peg",
        draw: (rect, st) => {
          const k = st.scale;
          const fs = 14 * k * prefs().textScale;
          const stack = p.slice().reverse();
          const lineH = 18 * k;
          const top = rect.y + 6 * k;
          if (!stack.length) draw.text("·", rect.x + rect.width / 2, top, { size: fs, align: "center", color: st.colors.text });
          stack.forEach((col, j) => draw.text(Content.COLOR_GLYPHS[col] ?? "?", rect.x + rect.width / 2, top + j * lineH, {
            size: fs, align: "center", color: st.highContrast ? st.colors.text : palette[col]!,
          }));
          if (app.kbFocusPeg === i && !st.focused) draw.strokeRoundRect(rect.x - 3 * k, rect.y - 3 * k, rect.width + 6 * k, rect.height + 6 * k, 10 * k, "#e8c07a", 3 * k);
        },
      });
      if (r.activated && !fresh(0)) {
        app.kbFocusPeg = i;
        onPegChosen(i);
        // A click or tap hands the arrows and Enter back to the board (keyboard activation keeps the focus).
        if (pointerActivation()) ui.setFocus(null);
      }
      if (r.focused) focusPeg(i);
    });
  }, { spacing: gap }); };
  const bottom = L.landscape ? 8 : trayRows(L) * (trayH + 8) + 2 + 8;
  const at = L.landscape ? { anchor: "bottom-end" as const, x: PAD, y: bottom } : { anchor: "bottom" as const, y: bottom };
  ui.place("a11y-board", at, () => ui.column("mirror", () => {
    if (scroll) ui.scrollArea("mirror-scroll", { width: maxW - 20, height: ph + 12 }, build);
    else build();
  }, { style: "mirror", padding: { top: 8, bottom: 8, start: 10, end: 10 } }));
}

/** The thumb-zone tray: Undo, Hint, Help, Panel, View (reversed for left-handed play). */
function tray(L: Layout): void {
  const list: Btn[] = [
    { id: "tray-undo", text: T("Undo"), disabled: !canUndo(), act: doUndo },
    { id: "tray-hint", text: T("Hint"), act: doHint },
    { id: "tray-help", text: T("Help"), act: () => openHelp("play") },
    { id: "tray-panel", text: T("Panel"), act: () => { app.drawerRight = !app.drawerRight; app.drawerLeft = false; } },
    { id: "tray-camera", text: T("View"), act: cameraReset },
  ];
  if (options.leftHanded) list.reverse();
  if (L.portrait) {
    const w = L.lw - 2 * PAD;
    const bw = (w - 6 * (list.length - 1)) / list.length;
    ui.place("action-tray", { anchor: "bottom", y: 8 }, () => ui.row("tray-row", () => list.forEach((b) => button({ ...b, style: "tray-btn" }, bw)), { spacing: 6 }));
    return;
  }
  const w = L.landscape ? L.lw * 0.42 : L.lw - 2 * PAD;
  const at = L.landscape ? { anchor: "bottom-start" as const, x: PAD, y: 8 } : { anchor: "bottom" as const, y: 8 };
  // Flex-wrap rows at their own widths.
  let rows = 1, used = 0;
  for (const b of list) { const bw = buttonWidth(b.text, "btn2"); if (used && used + 8 + bw > w) { rows++; used = 0; } used += (used ? 8 : 0) + bw; }
  lastSize.set("tray-rows", rows);
  ui.place("action-tray", at, () => flow("tray", list, w, 8, L.landscape ? "start" : "center"));
}

// ------------------------------------------------------------------ caption and toast
function caption(L: Layout): void {
  const cap = app.caption;
  if (!cap) return;
  const y = app.screen === "play" ? (L.landscape ? 108 : bottomBand(L) + 8) : 24;
  ui.place("caption-line", { anchor: "bottom", y }, () => ui.column("caption-col", () => para(T(cap.text), L.lw - 60, "caption-text", "caption-text", true), { style: "caption", align: "center" }));
}
function toast(L: Layout): void {
  const t = app.toast;
  if (!t) return;
  ui.place("toast", { anchor: "top", y: 70 }, () => ui.column("toast-col", () => para(t.text, Math.min(L.lw - 60, 480), "toast-text", "toast-text", true), { style: "toast", align: "center" }));
}

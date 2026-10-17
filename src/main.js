'use strict';

// Loop Loom — bootstrap + ui: host handshake, capability detection, lifecycle,
// responsive DOM shell, focus, settings, overlays, accessibility mirror,
// pointer/touch/keyboard/gamepad input.

import * as rules from './rules.js';
import * as content from './content.js';
import * as session from './session.js';
import * as render from './render.js';
import * as audio from './audio.js';
import * as platform from './platform.js';
import { shStrings } from './sh-strings.js';
import * as serverTime from './server-time.js';
import { CATEGORIES, PRESETS, presetTier, choosePreset } from './gfx.js';
import { gfxStrings } from './gfx-i18n.js';
import { T, N, initLanguage, onLanguage, getLang } from './i18n.js';

// The game language follows Settings › Language (sh-language.js).
initLanguage();

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------------------
// Game state machine: boot → title → profile-ready → mode-select → preparing
// → tutorial/countdown → active ↔ paused → resolving → results → progression
// Every transition has one owner (this module) and an explicit reason.
// ---------------------------------------------------------------------------

let appState = 'boot';
let settings = session.loadSettings();
let progress = session.loadProgress();
let current = null;          // active Session
let pendingRecord = null;    // record chosen in setup
let pendingMode = 'practice';
let selectedPeg = null;      // lifted group source
let kbFocusPeg = 0;          // keyboard navigation index
let render3d = true;
let speedTimer = null;
let journeyPick = 0;
let warnedLowTime = false;
let cmdCounter = 0;

const REASONS = {
  'same-peg': N('That is the same peg.'),
  'empty-source': N('That peg is empty.'),
  'no-space': N('That peg is full.'),
  'color-mismatch': N('Loops may only land on a matching color or an empty peg.'),
  'round-over': N('The round is over.'),
  'bad-peg': N('Unknown peg.'),
};
// Content display names (content.js keeps English data).
const colorName = (c) => T(content.COLOR_NAMES[c]);
function recordTitle(record) {
  if (!record) return '';
  const id = String(record.id || '');
  if (id.startsWith('journey-')) return T('Stage {n}', { n: id.slice(8) });
  if (record.tutorial) return T(record.tutorial.title);
  if (id.startsWith('practice')) return T('Practice · difficulty {n}', { n: record.difficulty != null ? record.difficulty : settings.difficulty });
  const ch = content.CHALLENGES.find((c) => c.title === record.title);
  if (ch) return T(ch.title);
  return T(record.title || record.id);
}
const MODE_NAMES = { learn: N('Learn'), journey: N('Journey'), daily: N('Daily'), practice: N('Practice'), challenge: N('Challenge'), chase: N('Score chase') };

function transition(next, reason) {
  appState = next;
  document.body.dataset.appstate = next;
  announce(T(stateLabel(next)));
}

function stateLabel(s) {
  return {
    boot: N('Loading'), title: N('Title screen'), 'profile-ready': N('Ready'),
    'mode-select': N('Mode selection'), preparing: N('Preparing round'),
    tutorial: N('Tutorial'), countdown: N('Get ready'), active: N('Round active'),
    paused: N('Paused'), reconnecting: N('Reconnecting'), resolving: N('Resolving'),
    results: N('Results'), progression: N('Progression'),
  }[s] || s;
}

// ---------------------------------------------------------------------------
// Announcements, captions, toast
// ---------------------------------------------------------------------------

let liveTimer = 0;
function announce(key, vars) {
  const text = T(key, vars);
  const el = $('live-region');
  el.textContent = '';
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => { el.textContent = text; }, 30);
}

let captionTimer = 0;
audio.onCaption((text) => {
  if (!text) return;
  const el = $('caption-line');
  el.textContent = T(text);
  el.classList.remove('hidden');
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => el.classList.add('hidden'), 2200);
});

let toastTimer = 0;
function toast(key, vars) {
  const el = $('toast');
  el.textContent = T(key, vars);
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

const SCREENS = ['loading', 'title', 'modes', 'setup', 'play', 'pause', 'settings', 'results', 'help', 'compat'];
let helpReturn = 'title';
let lastFocus = null;

function setScreen(name) {
  for (const s of SCREENS) {
    document.querySelectorAll(`[data-screen="${s}"]`).forEach((el) => {
      el.classList.toggle('hidden', s !== name);
    });
  }
  const inGame = name === 'play';
  $('hud').classList.toggle('hidden', !inGame);
  $('action-tray').classList.toggle('hidden', !inGame);
  // The rails only carry round context, so they stay out of the menu screens
  // instead of showing empty headings behind the title overlay.
  $('rail-left').classList.toggle('hidden', !inGame);
  $('rail-right').classList.toggle('hidden', !inGame);
  $('a11y-board').classList.toggle('hidden', !inGame && appState !== 'active');
  // Focus management: restore after modals, move into new overlay.
  const overlay = document.querySelector(`[data-screen="${name}"]`);
  if (overlay) {
    const btn = overlay.querySelector('button');
    // preventScroll + scrollTop reset: a focused button low in a tall panel
    // must not scroll the heading away; every overlay opens at its top.
    if (btn) { lastFocus = btn; btn.focus({ preventScroll: true }); }
    for (const n of [overlay, ...overlay.querySelectorAll('*')]) if (n.scrollTop) n.scrollTop = 0;
  } else if (lastFocus && name === 'play') {
    lastFocus = null;
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

// Graphics settings live in settings.graphics; the old single quality tier
// (auto/low/medium/high) migrates onto a preset once.
function migrateGraphics() {
  if (settings.graphics && typeof settings.graphics === 'object') return;
  const map = { low: 'low', medium: 'balanced', high: 'high' };
  settings.graphics = { preset: map[settings.quality] || 'auto' };
}

function applySettings() {
  migrateGraphics();
  audio.configure(settings);
  render.setReducedMotion(settings.reducedMotion);
  render.setGraphics(settings.graphics);
  render.setPalette(settings.palette);
  document.body.classList.toggle('reduced-motion', !!settings.reducedMotion);
  document.body.classList.toggle('larger-text', settings.largerText);
  document.body.classList.toggle('high-contrast', settings.highContrast);
  document.body.classList.toggle('left-handed', settings.leftHanded);
  document.body.classList.toggle('a11y-board-hidden', false);
}

// Account strings (sign-in, invite, toasts) in the player's locale.
const shT = () => shStrings([getLang()]);

// Preferences mirrored to the StarHermit settings KV (key bindings travel via
// the platform controls API instead).
function kvSettings() {
  const o = Object.assign({}, settings);
  delete o.bindings;
  return o;
}
function persistSettings() {
  session.saveSettings(settings);
  platform.pushSettings(kvSettings());
}

// Effective keyboard bindings {action: codes[]}: the local per-device codes,
// replaced by the player's StarHermit controls when signed in.
let keyBindings = null;
function defaultKeyBindings() {
  const out = {};
  for (const [k, v] of Object.entries(settings.bindings)) out[k] = [v];
  out.confirm = out.confirm.concat(out.confirm.includes('Space') ? [] : ['Space']);
  return out;
}
function keyLabel(code) {
  const named = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Escape: 'Esc' };
  if (named[code]) return named[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  return code || '—';
}
const keysFor = (action) => (keyBindings[action] || []).map(keyLabel).join('/');

const SETTING_FIELDS = [
  ['set-music', 'music', true], ['set-effects', 'effects', true], ['set-ambience', 'ambience', true],
  ['set-voice', 'voice', true], ['set-muted', 'muted'], ['set-motion', 'reducedMotion'],
  ['set-palette', 'palette'], ['set-contrast', 'highContrast'], ['set-text', 'largerText'],
  ['set-left', 'leftHanded'], ['set-hold', 'holdToLift'], ['set-timing', 'timingAssist'],
  ['set-haptics', 'haptics'], ['set-telemetry', 'telemetryConsent'],
];
// Re-read the form from `settings` (after a cloud / settings-KV load).
function syncSettingsForm() {
  for (const [id, key, isRange] of SETTING_FIELDS) {
    const el = $(id);
    if (isRange) el.value = settings[key];
    else if (el.type === 'checkbox') el.checked = !!settings[key];
    else el.value = settings[key];
  }
}

function bindSettings() {
  const bind = (id, key, isRange) => {
    const el = $(id);
    if (isRange || el.type === 'checkbox') {
      if (isRange) el.value = settings[key]; else el.checked = !!settings[key];
      el.addEventListener('change', () => {
        settings[key] = isRange ? parseFloat(el.value) : el.checked;
        persistSettings();
        platform.cloudSave(session.exportDoc());
        session.track('settings-change');
        applySettings();
      });
    } else {
      el.value = settings[key];
      el.addEventListener('change', () => {
        settings[key] = el.value;
        persistSettings();
        platform.cloudSave(session.exportDoc());
        session.track('settings-change');
        applySettings();
      });
    }
  };
  for (const [id, key, isRange] of SETTING_FIELDS) bind(id, key, isRange);
}

// ---------------------------------------------------------------------------
// Graphics panel: preset, render scale, per-category overrides, adaptive
// resolution, frame-rate readout, GPU/cost summary. Applies live, persists
// with the other settings.
// ---------------------------------------------------------------------------

let G = gfxStrings(getLang());
let gfxRefreshTimer = 0;

function saveGraphics(next) {
  settings.graphics = next;
  settings.quality = next.preset || 'auto'; // legacy mirror
  persistSettings();
  platform.cloudSave(session.exportDoc());
  session.track('settings-change');
  render.setGraphics(settings.graphics);
  refreshGraphicsUI();
  clearTimeout(gfxRefreshTimer);
  gfxRefreshTimer = setTimeout(refreshGraphicsUI, 150); // pixel size settles on the next frame
}

// Graphics labels come from gfx-i18n.js for the game language; relabelled in place.
function labelGraphics() {
  G = gfxStrings(getLang());
  $('gfx-heading').textContent = G.graphics;
  document.querySelectorAll('#gfx-section [data-gfx-i18n]').forEach((el) => { el.textContent = G[el.dataset.gfxI18n]; });
  for (const cat of Object.keys(CATEGORIES)) {
    const label = document.querySelector(`label[for="gfx-${cat}"]`);
    if (label) label.textContent = G.cat[cat];
    const sel = $('gfx-' + cat);
    if (sel) for (const o of sel.options) if (o.value !== 'preset') o.textContent = G.tier[o.value] || o.value;
  }
  for (const o of $('set-quality').options) if (o.value !== 'auto') o.textContent = G.preset[o.value];
}

function bindGraphics() {
  $('gfx-heading').textContent = G.graphics;
  document.querySelectorAll('#gfx-section [data-gfx-i18n]').forEach((el) => { el.textContent = G[el.dataset.gfxI18n]; });
  const cats = $('gfx-cats');
  cats.textContent = '';
  for (const [cat, tiers] of Object.entries(CATEGORIES)) {
    const row = document.createElement('div');
    row.className = 'settings-row';
    const label = document.createElement('label');
    label.htmlFor = 'gfx-' + cat;
    label.textContent = G.cat[cat];
    const sel = document.createElement('select');
    sel.id = 'gfx-' + cat;
    sel.dataset.gfxCat = cat;
    const def = document.createElement('option');
    def.value = 'preset';
    sel.append(def);
    for (const t of tiers) {
      const o = document.createElement('option');
      o.value = t;
      o.textContent = G.tier[t] || t;
      sel.append(o);
    }
    sel.addEventListener('change', () => {
      const next = Object.assign({}, settings.graphics);
      if (sel.value === 'preset') delete next[cat]; else next[cat] = sel.value;
      saveGraphics(next);
    });
    row.append(label, sel);
    cats.append(row);
  }
  const preset = $('set-quality');
  for (const o of preset.options) if (o.value !== 'auto') o.textContent = G.preset[o.value];
  preset.addEventListener('change', () => saveGraphics(choosePreset(settings.graphics, preset.value)));
  const scale = $('gfx-scale');
  scale.addEventListener('input', () => { $('gfx-scale-value').textContent = scale.value + '%'; });
  scale.addEventListener('change', () => saveGraphics(Object.assign({}, settings.graphics, { render_scale: parseInt(scale.value, 10) / 100 })));
  $('gfx-adaptive').addEventListener('change', (e) => saveGraphics(Object.assign({}, settings.graphics, { adaptive: e.target.checked })));
  $('gfx-fps').addEventListener('change', (e) => saveGraphics(Object.assign({}, settings.graphics, { show_fps: e.target.checked })));
  refreshGraphicsUI();
}

function refreshGraphicsUI() {
  migrateGraphics();
  const g = settings.graphics;
  const info = render.graphicsInfo(G.sum);
  const r = info.resolved;
  const preset = $('set-quality');
  preset.value = PRESETS.includes(g.preset) ? g.preset : 'auto';
  preset.options[0].textContent = G.auto.replace('{tier}', G.preset[info.detected] || info.detected);
  for (const cat of Object.keys(CATEGORIES)) {
    const sel = $('gfx-' + cat);
    if (!sel) continue;
    const t = presetTier(r.preset, cat);
    sel.options[0].textContent = G.fromPreset.replace('{tier}', G.tier[t] || t);
    sel.value = CATEGORIES[cat].includes(g[cat]) ? g[cat] : 'preset';
  }
  const pct = Math.round(r.renderScale * 100);
  $('gfx-scale').value = pct;
  $('gfx-scale-value').textContent = pct + '%';
  $('gfx-adaptive').checked = r.adaptive;
  $('gfx-fps').checked = r.showFps;
  $('gfx-summary').textContent = info.webgl ? `${info.gpu} · ${(G.level || 'Level {level}').replace('{level}', info.level ?? 0)} · ${info.summary}` : info.summary;
  const note = $('gfx-note');
  const msg = !info.webgl ? G.noWebgl : info.postFailed ? G.postFailed : '';
  note.textContent = msg;
  note.classList.toggle('hidden', !msg);
  const panel = $('gfx-section');
  panel.dataset.gfxPreset = r.preset;
  panel.dataset.gfxAuto = r.auto ? '1' : '0';
}

// ---------------------------------------------------------------------------
// Help — rule cards generated from current control mappings.
// ---------------------------------------------------------------------------

function showHelp(returnTo) {
  helpReturn = returnTo;
  renderHelp();
  setScreen('help');
}
function renderHelp() {
  const b = (action) => `<b>${keysFor(action)}</b>`;
  $('help-text').innerHTML = `
    <p><strong>${T('Goal:')}</strong> ${T('move loops between pegs — keeping their stack order — until every peg holds a single color.')}</p>
    <h2>${T('Rules')}</h2>
    <ul>
      <li>${T('Only the top loop group lifts. Same-colored loops touching at the top move together.')}</li>
      <li>${T("A group lands on a matching color or an empty peg, never past a peg's capacity.")}</li>
      <li>${T('Invalid drops are rejected with an explanation.')}</li>
    </ul>
    <h2>${T('Controls')}</h2>
    <ul>
      <li>${T('Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.')}</li>
      <li>${T('Keyboard: {move} choose peg, {confirm} lift/drop, {cancel} cancel, {undo} undo, {hint} hint, {pause} pause, {camera} reset camera.', {
        move: `<b>${keysFor('left')} ${keysFor('right')} ${keysFor('up')} ${keysFor('down')}</b>`, confirm: b('confirm'), cancel: b('cancel'),
        undo: b('undo'), hint: b('hint'), pause: b('pause'), camera: b('camera'),
      })}</li>
      <li>${T('Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.')}</li>
    </ul>
    <h2>${T('Scoring')}</h2>
    <ul>
      <li>${T('Completion + efficiency vs par + no-undo mastery − invalid attempts.')}</li>
      <li>${T('Ties: completion, fewer invalid actions, faster time, then session id.')}</li>
    </ul>`;
}

// ---------------------------------------------------------------------------
// Mode setup screens
// ---------------------------------------------------------------------------

function openSetup(mode, record) {
  pendingMode = mode;
  pendingRecord = record;
  renderSetup();
  transition('mode-select', 'setup opened');
  setScreen('setup');
}
function renderSetup() {
  const mode = pendingMode, record = pendingRecord;
  if (!record) return;
  $('setup-title').textContent = recordTitle(record) || T(MODE_NAMES[mode] || mode);
  $('setup-rules').textContent = (record.tutorial ? T(record.tutorial.text) :
    record.challenge ? T(record.challenge.text) :
    T('Sort every loop so each peg holds one color.'));
  const ranked = mode === 'daily' || mode === 'chase';
  $('setup-meta').textContent =
    T('Solo · ~{n} min · assists: hints/undo', { n: Math.max(1, Math.round(record.par / 3)) }) + ' ' +
    (ranked ? T('(ranked — undo lowers mastery bonus)') : T('(unranked)'));
  const extra = $('setup-extra');
  extra.innerHTML = '';
  if (mode === 'journey') {
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < content.journeyCount; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(i + 1);
      const done = !!progress.journeyDone['journey-' + (i + 1)];
      const locked = i > progress.journeyUnlocked;
      b.className = done ? 'done' : locked ? 'locked' : '';
      b.disabled = locked;
      b.setAttribute('aria-label', T(done ? 'Stage {n} completed' : locked ? 'Stage {n} locked' : 'Stage {n}', { n: i + 1 }));
      b.addEventListener('click', () => { journeyPick = i; openSetup('journey', content.getJourneyStage(i)); });
      grid.appendChild(b);
    }
    extra.appendChild(grid);
  } else if (mode === 'practice') {
    const row = document.createElement('div');
    row.className = 'settings-row';
    row.innerHTML = '<label for="practice-diff"></label>';
    row.firstChild.textContent = T('Difficulty');
    const sel = document.createElement('select');
    sel.id = 'practice-diff';
    for (let d = 1; d <= 10; d++) {
      const o = document.createElement('option');
      o.value = d; o.textContent = T('Level {n}', { n: d });
      sel.appendChild(o);
    }
    sel.value = settings.difficulty;
    sel.addEventListener('change', () => {
      settings.difficulty = parseInt(sel.value, 10);
      persistSettings();
      openSetup('practice', content.getPractice(settings.difficulty, Date.now() % 100000));
    });
    row.appendChild(sel);
    extra.appendChild(row);
  } else if (mode === 'challenge') {
    const col = document.createElement('div');
    col.className = 'col';
    content.CHALLENGES.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'secondary';
      b.textContent = T(c.title) + ' — ' + T(c.text);
      b.addEventListener('click', () => openSetup('challenge', content.getChallenge(i, Date.now() % 100000)));
      col.appendChild(b);
    });
    extra.appendChild(col);
  }
}

// ---------------------------------------------------------------------------
// Round lifecycle
// ---------------------------------------------------------------------------

function nextCmdId() { return 'c' + (++cmdCounter) + '-' + Date.now().toString(36); }

function startRound(record, mode) {
  current = new session.Session(record, { mode });
  pendingMode = mode;
  selectedPeg = null;
  cmdCounter = 0;
  audio.setSeed(record.seed);
  audio.unlock();
  audio.startAmbience();
  audio.startMusic(progressFraction);
  render.setTheme(record.theme);
  render.setBoard(current.state);
  render.setSelection(null);
  render.clearPreview();
  updateA11yBoard();
  updateHud();
  updateRails();
  session.track('start');
  session.saveSnapshot(current);
  if (record.timeTargetMs && !settings.timingAssist) {
    clearInterval(speedTimer);
    warnedLowTime = false;
    speedTimer = setInterval(() => {
      if (!current || current.status !== 'active') { clearInterval(speedTimer); return; }
      if (current.elapsedMs() > record.timeTargetMs) {
        clearInterval(speedTimer);
        current.state.status = 'lost';
        current.state.terminal = 'time-limit';
        endRound('time-limit');
      } else {
        // One warning cue as the shuttle timer enters its last ten seconds.
        const left = record.timeTargetMs - current.elapsedMs();
        if (!warnedLowTime && left <= 10000) {
          warnedLowTime = true;
          audio.playEvent('time-warning');
          toast(N('Ten seconds left.'));
        }
        updateHud();
      }
    }, 250);
  }
  audio.playEvent('round-start');
  transition(record.tutorial ? 'tutorial' : 'active', 'round started');
  setScreen('play');
  if (record.tutorial) showTutorialStep();
  announce(T('Round started. {title}.', { title: recordTitle(record) }) + ' ' + boardDescription());
}

function progressFraction() {
  if (!current) return 0;
  const total = current.state.pegs.reduce((n, p) => n + p.length, 0);
  let sorted = 0;
  for (const p of current.state.pegs) {
    for (let i = 1; i < p.length; i++) if (p[i] === p[0]) sorted++;
  }
  return total ? sorted / Math.max(1, total - current.state.pegs.filter((p) => p.length <= 1).length) : 0;
}

function endRound(reason) {
  if (!current) return;
  transition('resolving', reason);
  render.settle();
  current.finish();
  const r = current.result;
  if (r.solved) {
    audio.playEvent('win');
    render.winEffect();
  } else {
    audio.playEvent('lose');
  }
  session.track('round-end');
  session.clearSnapshot();
  // Achievements + progression (idempotent).
  const unlocked = session.checkAchievements(progress, current);
  session.saveProgress(progress);
  for (const id of unlocked) {
    audio.playEvent('achievement');
  }
  // Score boards: local records (signed in, showResults also posts to the platform board).
  const entry = Object.assign({}, r, {
    contentId: current.record.id, seed: current.record.seed,
    version: current.record.version, day: current.record.day,
  });
  if (r.solved) session.recordScore(entry);
  platform.cloudSave(session.exportDoc());
  showResults(unlocked, reason);
}

let resultsArgs = null;
function showResults(unlocked, reason) {
  const r = current.result;
  resultsArgs = { unlocked, reason };
  renderResults();
  const next = $('btn-next');
  if (current.mode === 'journey' && r.solved && journeyPick + 1 < content.journeyCount) {
    next.onclick = () => { journeyPick++; openSetup('journey', content.getJourneyStage(journeyPick)); };
  } else if (current.mode === 'learn' && r.solved) {
    const idx = content.LESSONS.findIndex((l) => l.id === current.record.id);
    if (idx + 1 < content.LESSONS.length) next.onclick = () => openSetup('learn', content.getLesson(idx + 1));
    else next.onclick = () => openSetup('journey', content.getJourneyStage(progress.journeyUnlocked));
  } else {
    next.onclick = () => startRound(current.record, current.mode);
  }
  postToLeaderboard(r.total);
  transition('results', 'round ended: ' + reason);
  setScreen('results');
  announce(T(r.solved ? 'Loom complete. Total score {score}.' : 'Round over. Total score {score}.', { score: r.total }));
  refreshProgressRail();
}
// Results text (re-rendered in place on a language change).
function renderResults() {
  if (!resultsArgs || !current || !current.result) return;
  const { unlocked, reason } = resultsArgs;
  const r = current.result;
  $('result-headline').textContent = r.solved ? T('Loom complete!') :
    (reason === 'time-limit' ? T('Out of time') : T('Out of moves'));
  const rows = [
    [T('Completion'), r.completion],
    [T('Efficiency (par {par}, {moves} moves)', { par: r.par, moves: r.moves }), r.efficiency],
    [T('No-undo mastery'), r.mastery],
    [T('Invalid attempts'), r.invalidPenalty],
    [T('Total'), r.total],
  ];
  $('result-score').innerHTML = rows.map(([k, v]) =>
    `<div class="score-line"><span>${k}</span><b>${v}</b></div>`).join('') +
    `<div class="score-line"><span>${T('Time')}</span><b>${(r.elapsedMs / 1000).toFixed(1)}s</b></div>`;
  $('result-achievements').innerHTML = unlocked.map((id) => {
    const a = session.ACHIEVEMENTS.find((x) => x.id === id);
    return `<span class="badge new">★ ${a ? T(a.name) : id}</span>`;
  }).join('');
  // Comparison + next recommended action.
  const best = session.getScores('global')[0];
  $('result-compare').textContent = best ?
    T('Your best local score: {score} ({moves} moves).', { score: best.score, moves: best.moves }) :
    T('This is your first recorded score.');
  const next = $('btn-next');
  if (current.mode === 'journey' && r.solved && journeyPick + 1 < content.journeyCount) next.textContent = T('Next stage');
  else if (current.mode === 'learn' && r.solved) {
    const idx = content.LESSONS.findIndex((l) => l.id === current.record.id);
    next.textContent = idx + 1 < content.LESSONS.length ? T('Next lesson') : T('Start the Journey');
  } else next.textContent = T('Play again');
}

// Signed in: Journey, Daily, Challenge and Score Chase rounds post their total
// to the platform high-score board and the results show the rank. Practice,
// lessons and standalone play post nothing.
function postToLeaderboard(total) {
  const line = $('result-lb');
  const ranked = ['journey', 'daily', 'challenge', 'chase'].includes(current.mode);
  if (!platform.isHosted() || !ranked) { line.hidden = true; return; }
  line.hidden = false;
  lbState = { pending: true };
  renderLbLine();
  platform.submitScore(total).then((res) => {
    lbState = res;
    renderLbLine();
    platform.refreshHostedBoard().then(() => refreshTitle()).catch(() => {});
  });
}

let lbState = null;
function renderLbLine() {
  const line = $('result-lb');
  const r = lbState;
  if (!r || line.hidden) return;
  line.textContent = r.pending ? shT().lbPosting : !r.posted ? shT().lbNotPosted
    : r.rank ? shT().lbRank.replace('{rank}', r.rank) : shT().lbPosted;
}

function showTutorialStep() {
  const t = current.tutorial;
  const steps = current.record.tutorial.steps;
  if (!t || t.step >= steps.length) return;
  const s = steps[t.step];
  $('hud-objective').textContent = T(current.record.tutorial.title) + ': ' + T(s.prompt);
  announce(s.prompt);
}

// ---------------------------------------------------------------------------
// HUD / rails / accessible board mirror
// ---------------------------------------------------------------------------

function updateHud() {
  if (!current) return;
  const st = current.state;
  const score = rules.scoreComponents(st, current.record.par, current.elapsedMs()).total;
  let txt = (st.moveLimit ? T('Moves {n}/{limit}', { n: st.moves, limit: st.moveLimit }) : T('Moves {n}', { n: st.moves })) + ' · ' + T('Score {n}', { n: score });
  if (current.record.timeTargetMs && !settings.timingAssist) {
    const left = Math.max(0, current.record.timeTargetMs - current.elapsedMs());
    txt += ` · ${(left / 1000).toFixed(0)}s`;
  }
  $('hud-status').textContent = txt;
  if (!current.record.tutorial) {
    const done = st.pegs.filter((p) => p.length > 1 && p.every((c) => c === p[0])).length;
    $('hud-objective').textContent = T('Uniform pegs: {done} / {total}', { done, total: st.colors });
  } else if (current.tutorial && current.tutorial.step >= current.record.tutorial.steps.length) {
    $('hud-objective').textContent = T('Good! Finish the loom.');
  } else if (current.tutorial) {
    const step = current.record.tutorial.steps[current.tutorial.step];
    if (step) $('hud-objective').textContent = T(current.record.tutorial.title) + ': ' + T(step.prompt);
  }
}

function syncLabel() {
  return T({ synced: N('synced'), saving: N('saving…'), error: N('sync error') }[platform.getSyncStatus()] || N('offline'));
}

function updateRails() {
  if (!current) return;
  $('rail-mode').textContent = T('Mode: {mode} · {title}', { mode: T(MODE_NAMES[pendingMode] || pendingMode), title: recordTitle(current.record) });
  $('rail-online').textContent = platform.isHosted() ?
    T('{name} · cloud save {status}', { name: platform.getNickname(), status: syncLabel() }) :
    T('Playing locally — scores are stored on this device.');
  $('rail-objective').textContent = current.record.challenge ? T(current.record.challenge.text) :
    T('Move loops between pegs until every peg holds one color.');
  $('rail-progress').textContent = T('Par {par} · seed {seed}', { par: current.record.par, seed: current.record.seed.toString(16) });
  $('btn-undo').disabled = current.snapshots.length === 0 || !!current.record.noUndo;
  $('tray-undo').disabled = $('btn-undo').disabled;
  // Scores: hosted read-only board when available, local records otherwise.
  const list = $('rail-scores');
  list.innerHTML = '';
  const hosted = platform.isHosted() ? platform.getHostedBoard() : null;
  if (hosted && hosted.length) {
    for (const e of hosted.slice(0, 8)) {
      const li = document.createElement('li');
      li.textContent = `${e.score} · ${e.name}`;
      list.appendChild(li);
    }
  } else {
    const scores = session.getScores(current.mode === 'daily' ? 'daily' : 'global', current.record.day);
    for (const s of scores.slice(0, 8)) {
      const li = document.createElement('li');
      li.textContent = `${s.score} · ${T('{n} moves', { n: s.moves })} · ${(s.elapsedMs / 1000).toFixed(0)}s`;
      list.appendChild(li);
    }
    if (!scores.length) { const li = document.createElement('li'); li.textContent = T('No scores yet.'); list.appendChild(li); }
  }
  // Achievements
  const al = $('rail-achievements');
  al.innerHTML = '';
  for (const a of session.ACHIEVEMENTS) {
    const li = document.createElement('li');
    li.textContent = (progress.achievements[a.id] ? '★ ' : '☆ ') + T(a.name);
    li.style.color = progress.achievements[a.id] ? 'var(--accent)' : 'var(--dim)';
    al.appendChild(li);
  }
}

function refreshProgressRail() {
  const done = Object.keys(progress.journeyDone).length;
  $('rail-journey').textContent = T('Journey: {done}/{total} stages · {ach}/{achTotal} achievements · {rounds} rounds completed', {
    done, total: content.journeyCount, ach: Object.keys(progress.achievements).length,
    achTotal: session.ACHIEVEMENTS.length, rounds: progress.roundsCompleted,
  });
}

function boardDescription() {
  if (!current) return '';
  return current.state.pegs.map((p, i) =>
    T('Peg {n}: {loops}', { n: i + 1, loops: p.length ? p.map(colorName).join(', ') : T('empty') })).join('. ');
}

// DOM mirror of the canvas: one real button per peg, glyph-coded stacks.
function updateA11yBoard() {
  const wrap = $('a11y-board');
  // Rebuilding the mirror drops DOM focus; remember where it was so keyboard
  // and screen-reader users stay on the peg they were operating.
  const active = document.activeElement;
  const focusedPeg = active && active.parentNode === wrap ?
    Array.prototype.indexOf.call(wrap.children, active) : -1;
  wrap.innerHTML = '';
  if (!current) return;
  const st = current.state;
  const legal = selectedPeg != null ?
    new Set(rules.legalActions(st).filter((a) => a.from === selectedPeg).map((a) => a.to)) : new Set();
  st.pegs.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'peg-btn' + (selectedPeg === i ? ' selected' : '') + (legal.has(i) ? ' legal' : '') +
      (kbFocusPeg === i ? ' kb-focus' : '');
    const label = T('Peg {n}: {loops}', { n: i + 1, loops: p.length ? p.map(colorName).join(', ') : T('empty') });
    b.setAttribute('aria-label', selectedPeg === i ? T('{label} (lifted)', { label }) : label);
    b.innerHTML = p.length ?
      p.slice().reverse().map((c) => `<span class="glyph" style="color:${content.PALETTES[settings.palette][c]}">${content.COLOR_GLYPHS[c]}</span>`).join('') :
      '<span class="glyph">·</span>';
    b.addEventListener('click', () => { kbFocusPeg = i; onPegChosen(i); });
    wrap.appendChild(b);
  });
  if (focusedPeg >= 0 && wrap.children[focusedPeg]) wrap.children[focusedPeg].focus();
}

// ---------------------------------------------------------------------------
// Core interaction
// ---------------------------------------------------------------------------

function onPegChosen(i) {
  if (!current || current.status !== 'active') return;
  audio.unlock();
  if (selectedPeg === null) {
    // Lift: only a non-empty peg.
    if (current.state.pegs[i].length === 0) {
      feedbackInvalid(i, 'empty-source');
      return;
    }
    selectedPeg = i;
    render.setSelection({ peg: i, size: rules.topGroup(current.state, i).size });
    render.previewTargets(current.state, i);
    updateA11yBoard();
    audio.playEvent('select');
    if (settings.haptics && navigator.vibrate) navigator.vibrate(8);
    const g = rules.topGroup(current.state, i);
    announce(g.size > 1 ? 'Lifted {n} {color} loops from peg {peg}. Choose a target peg.' : 'Lifted {n} {color} loop from peg {peg}. Choose a target peg.', { n: g.size, color: colorName(g.color), peg: i + 1 });
    return;
  }
  if (i === selectedPeg) { // cancel lift
    selectedPeg = null;
    render.setSelection(null);
    render.clearPreview();
    updateA11yBoard();
    audio.playEvent('deselect');
    return;
  }
  const r = current.applyCommand({ id: nextCmdId(), type: 'move', from: selectedPeg, to: i });
  if (!r.ok) {
    // applyCommand already tallied the rejected attempt; don't count it twice.
    feedbackInvalid(i, r.reason, true);
    return;
  }
  selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  render.setBoard(current.state);
  render.dropEffect(i);
  audio.playEvent('move');
  if (settings.haptics && navigator.vibrate) navigator.vibrate(14);
  session.saveSnapshot(current);
  updateHud();
  updateRails();
  updateA11yBoard();
  announce(T('Moved to peg {n}.', { n: i + 1 }) + ' ' + boardDescription());
  // Tutorial advancement.
  if (current.tutorial && current.record.tutorial) {
    const steps = current.record.tutorial.steps;
    const t = current.tutorial;
    if (t.step < steps.length) {
      const exp = steps[t.step].expect;
      const last = current.commands[current.commands.length - 1];
      if (last && exp && last.from === exp.from && last.to === exp.to) {
        t.step++;
        session.track('tutorial-step');
        if (t.step < steps.length) showTutorialStep();
        else {
          $('hud-objective').textContent = T('Good! Finish the loom.');
          announce(N('Lesson step complete. Now finish the loom on your own.'));
        }
      }
    }
  }
  if (current.status !== 'active') endRound(current.state.terminal || 'solved');
}

function feedbackInvalid(peg, reason, alreadyCounted) {
  if (!alreadyCounted) current.applyCommand({ id: nextCmdId(), type: 'invalid' });
  render.invalidFeedback(peg);
  audio.playEvent('invalid');
  if (settings.haptics && navigator.vibrate) navigator.vibrate([30, 40, 30]);
  const msg = REASONS[reason] || N('That move is not allowed.');
  toast(msg);
  announce(msg);
  updateHud();
}

function doUndo() {
  if (!current || current.status !== 'active') return;
  const r = current.applyCommand({ id: nextCmdId(), type: 'undo' });
  if (!r.ok) { toast(REASONS[r.reason] || N('Nothing to undo.')); return; }
  selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  render.setBoard(current.state);
  audio.playEvent('undo');
  session.saveSnapshot(current);
  updateHud(); updateRails(); updateA11yBoard();
  announce(N('Move undone.'));
}

function doHint() {
  if (!current || current.status !== 'active') return;
  const h = current.hint();
  audio.playEvent('hint');
  if (!h) { toast(N('No useful move found — try undo.')); return; }
  toast(N('Hint: try peg {from} → peg {to}.'), { from: h.from + 1, to: h.to + 1 });
  announce(N('Hint: move from peg {from} to peg {to}.'), { from: h.from + 1, to: h.to + 1 });
  render.setSelection({ peg: h.from, size: rules.topGroup(current.state, h.from).size });
  render.previewTargets(current.state, h.from);
  setTimeout(() => {
    if (selectedPeg === null) { render.setSelection(null); render.clearPreview(); }
  }, 1600);
}

// ---------------------------------------------------------------------------
// Input: pointer/touch (tap vs drag vs camera), keyboard, gamepad
// ---------------------------------------------------------------------------

function bindPointer(canvas) {
  let downAt = null, downPos = null, downPeg = null, dragging = false, pid = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (appState !== 'active' && appState !== 'tutorial') return;
    pid = e.pointerId;
    canvas.setPointerCapture(pid);
    downAt = performance.now();
    downPos = { x: e.clientX, y: e.clientY };
    downPeg = render.pointerToPeg(e.clientX, e.clientY);
    dragging = false;
  });
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    render.setPointerParallax(((e.clientX - rect.left) / rect.width - 0.5), -((e.clientY - rect.top) / rect.height - 0.5));
    if (downPos && pid === e.pointerId) {
      const dx = e.clientX - downPos.x, dy = e.clientY - downPos.y;
      if (Math.hypot(dx, dy) > 14) dragging = true; // distance threshold: tap vs drag
    }
  });
  const up = (e) => {
    if (pid !== e.pointerId) return;
    const dt = performance.now() - (downAt || 0);
    const peg = render.pointerToPeg(e.clientX, e.clientY);
    if (dragging) {
      // Drag commit: only when released over a peg, and quick drags still count.
      if (downPeg != null && peg != null) {
        if (selectedPeg === null && downPeg !== peg) { onPegChosen(downPeg); onPegChosen(peg); }
        else onPegChosen(peg);
      }
    } else if (dt < 600 && peg != null) {
      onPegChosen(peg);
    }
    downAt = null; downPos = null; downPeg = null; dragging = false; pid = null;
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', () => { // lost capture: cancel safely
    downAt = null; downPos = null; downPeg = null; dragging = false; pid = null;
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    const is = (action) => (keyBindings[action] || []).includes(e.code);
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
    const inGame = appState === 'active' || appState === 'tutorial';
    if (is('pause') || (is('cancel') && appState === 'active')) { e.preventDefault(); togglePause(); return; }
    // Cancel (Escape) backs out of the open overlay rather than doing nothing.
    if (is('cancel') && !inGame) {
      const open = SCREENS.find((s) => {
        const el = document.querySelector(`[data-screen="${s}"]`);
        return el && !el.classList.contains('hidden');
      });
      const close = { help: () => setScreen(helpReturn), settings: () => setScreen(appState === 'paused' ? 'pause' : 'title'), modes: () => leaveToTitle(), setup: () => leaveToTitle(), compat: () => setScreen(current ? 'play' : 'title') }[open];
      if (close) { e.preventDefault(); audio.playEvent('back'); close(); }
      return;
    }
    if (!inGame) return;
    const n = current ? current.state.pegs.length : 0;
    if (is('left')) { kbFocusPeg = (kbFocusPeg - 1 + n) % n; updateA11yBoard(); e.preventDefault(); }
    else if (is('right')) { kbFocusPeg = (kbFocusPeg + 1) % n; updateA11yBoard(); e.preventDefault(); }
    else if (is('up')) { kbFocusPeg = Math.max(0, kbFocusPeg - 1); updateA11yBoard(); e.preventDefault(); }
    else if (is('down')) { kbFocusPeg = Math.min(n - 1, kbFocusPeg + 1); updateA11yBoard(); e.preventDefault(); }
    else if (is('confirm')) { onPegChosen(kbFocusPeg); e.preventDefault(); }
    else if (is('cancel')) {
      if (selectedPeg !== null) { selectedPeg = null; render.setSelection(null); render.clearPreview(); updateA11yBoard(); audio.playEvent('deselect'); }
      e.preventDefault();
    }
    else if (is('undo')) { doUndo(); e.preventDefault(); }
    else if (is('hint')) { doHint(); e.preventDefault(); }
    else if (is('camera')) { render.resetCamera(); e.preventDefault(); }
  });
}

// Gamepad: focus navigation + primary/secondary/pause. Polling; mapping from settings.
let padPrev = {};
function pollGamepad() {
  const inGame = appState === 'active' || appState === 'tutorial';
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = pads && Array.from(pads).find((p) => p && p.connected);
  if (gp) {
    const map = settings.gamepad;
    const pressed = (i) => gp.buttons[i] && gp.buttons[i].pressed;
    const edge = (name, v) => { const was = padPrev[name]; padPrev[name] = v; return v && !was; };
    const n = current ? current.state.pegs.length : 0;
    const ax = gp.axes[0] || 0;
    if (edge('left', pressed(14) || ax < -0.6) && inGame) { kbFocusPeg = (kbFocusPeg - 1 + n) % n; updateA11yBoard(); }
    if (edge('right', pressed(15) || ax > 0.6) && inGame) { kbFocusPeg = (kbFocusPeg + 1) % n; updateA11yBoard(); }
    if (edge('confirm', pressed(map.confirm)) && inGame) onPegChosen(kbFocusPeg);
    if (edge('cancel', pressed(map.cancel)) && inGame && selectedPeg !== null) {
      selectedPeg = null; render.setSelection(null); render.clearPreview(); updateA11yBoard();
    }
    if (edge('undo', pressed(map.undo)) && inGame) doUndo();
    if (edge('hint', pressed(map.hint)) && inGame) doHint();
    if (edge('pause', pressed(map.pause))) togglePause();
  }
  requestAnimationFrame(pollGamepad);
}

// ---------------------------------------------------------------------------
// Pause / lifecycle / backgrounding
// ---------------------------------------------------------------------------

function togglePause() {
  if (appState === 'active' || appState === 'tutorial') {
    transition('paused', 'user paused');
    setScreen('pause');
    session.saveSnapshot(current);
  } else if (appState === 'paused') {
    transition(current && current.record.tutorial ? 'tutorial' : 'active', 'resumed');
    setScreen('play');
  }
}

function bindLifecycle() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      render.setHeartbeat(false);
      if (appState === 'active' || appState === 'tutorial') {
        transition('paused', 'backgrounded');
        setScreen('pause');
        session.saveSnapshot(current);
      }
    } else {
      restartRenderer();
      // "While you were away" summary.
      if (current && appState === 'paused') {
        toast(N('Welcome back — the atelier kept your place.'));
        session.saveSnapshot(current);
      }
    }
  });
  window.addEventListener('beforeunload', () => {
    session.saveSnapshot(current);
  });
  // WebGL context recovery: rebuild GPU resources from retained descriptors.
  const canvas = $('game-canvas');
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    render3d = false;
    rendererAlive = false;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    render3d = true;
    restartRenderer();
    if (current) render.setBoard(current.state);
  });
}

let rendererAlive = true;
function restartRenderer() {
  if (rendererAlive) { render.setHeartbeat(true); return; }
  rendererAlive = true;
  try { render.init($('game-canvas'), { reducedMotion: settings.reducedMotion }); applySettings(); } catch { /* keep 2D */ }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function wireButtons() {
  const click = (id, fn) => $(id).addEventListener('click', () => { audio.unlock(); audio.playEvent('click'); fn(); });
  $('btn-signin').textContent = shT().signIn;
  $('btn-invite').textContent = shT().invite;
  onLanguage(relocalize);
  click('btn-signin', () => platform.signIn());
  click('btn-invite', async () => {
    const link = platform.inviteLink();
    if (!link) return;
    try { await navigator.clipboard.writeText(link); toast(shT().copied); }
    catch { toast(shT().copyFailed); }
  });
  // Backing out of a screen gets its own lower, softer cue than a forward press.
  const clickBack = (id, fn) => $(id).addEventListener('click', () => { audio.unlock(); audio.playEvent('back'); fn(); });
  click('btn-play', () => {
    // Short path to play: resume or straight into practice/journey in ≤2 actions.
    const saved = session.loadSnapshot();
    if (saved) { current = saved; resumeRound(); return; }
    openSetup('journey', content.getJourneyStage(progress.journeyUnlocked));
  });
  click('btn-resume-saved', () => { const s = session.loadSnapshot(); if (s) { current = s; resumeRound(); } });
  click('btn-modes', () => { transition('mode-select', 'user opened modes'); setScreen('modes'); });
  click('btn-help-title', () => showHelp('title'));
  click('mode-learn', () => openSetup('learn', content.getLesson(0)));
  click('mode-journey', () => openSetup('journey', content.getJourneyStage(progress.journeyUnlocked)));
  click('mode-daily', () => openSetup('daily', content.getDaily(serverTime.utcDay())));
  click('mode-practice', () => openSetup('practice', content.getPractice(settings.difficulty, Date.now() % 100000)));
  click('mode-challenge', () => openSetup('challenge', content.getChallenge(0, Date.now() % 100000)));
  click('mode-chase', () => openSetup('chase', content.getScoreChase(Date.now() % 1000)));
  clickBack('mode-back', leaveToTitle);
  click('btn-start-round', () => startRound(pendingRecord, pendingMode));
  clickBack('btn-back-title', leaveToTitle);
  click('btn-pause', togglePause);
  click('btn-resume', togglePause);
  clickBack('btn-leave', () => { session.saveSnapshot(current); current = null; transition('title', 'user left'); setScreen('title'); refreshTitle(); });
  click('btn-open-settings', () => { refreshGraphicsUI(); setScreen('settings'); });
  click('btn-title-settings', () => { refreshGraphicsUI(); setScreen('settings'); });
  clickBack('btn-settings-close', () => setScreen(appState === 'paused' ? 'pause' : 'title'));
  click('btn-help-pause', () => showHelp('pause'));
  clickBack('btn-help-close', () => setScreen(helpReturn));
  click('btn-retry', () => { if (!current) return; session.track('retry'); startRound(current.record, current.mode); });
  clickBack('btn-results-title', leaveToTitle);
  click('btn-undo', doUndo);
  click('btn-hint', doHint);
  click('tray-undo', doUndo);
  click('tray-hint', doHint);
  click('tray-camera', () => render.resetCamera());
  click('tray-help', () => showHelp('play'));
  click('tray-panel', () => $('rail-right').classList.toggle('drawer-open'));
  click('btn-drawer-left', () => $('rail-left').classList.toggle('drawer-open'));
  click('btn-restart', () => { if (current) startRound(current.record, current.mode); });
  click('btn-settle', () => render.settle());
  click('btn-replay-tutorial', () => { setScreen('title'); openSetup('learn', content.getLesson(0)); });
  clickBack('btn-compat-close', () => { setScreen(current ? 'play' : 'title'); });
}

// Settings › Language changed: markup is re-applied by i18n.js; re-render what
// code built (graphics labels, title line, open setup/help/results, HUD,
// rails and the accessible board) in place. The round is untouched.
function relocalize() {
  $('btn-signin').textContent = shT().signIn;
  $('btn-invite').textContent = shT().invite;
  labelGraphics();
  refreshGraphicsUI();
  refreshTitle();
  refreshProgressRail();
  const open = (name) => { const el = document.querySelector(`[data-screen="${name}"]`); return el && !el.classList.contains('hidden'); };
  if (open('setup')) renderSetup();
  if (open('help')) renderHelp();
  if (open('results')) { renderResults(); renderLbLine(); }
  if (current) { updateHud(); updateRails(); updateA11yBoard(); }
}

// Leaving a setup/menu screen returns to a freshly refreshed title screen.
function leaveToTitle() {
  transition('title', 'returned to title');
  setScreen('title');
  refreshTitle();
}

function resumeRound() {
  audio.setSeed(current.record.seed);
  render.setTheme(current.record.theme);
  render.setBoard(current.state);
  updateA11yBoard(); updateHud(); updateRails();
  transition('active', 'session restored');
  setScreen('play');
  toast(N('Round restored from your last safe snapshot.'));
}

function refreshTitle() {
  const saved = session.loadSnapshot();
  $('btn-resume-saved').classList.toggle('hidden', !saved);
  const done = Object.keys(progress.journeyDone).length;
  const who = platform.isHosted() ? platform.getNickname() + ' · ' : '';
  $('title-status').textContent = who +
    T('Journey {done}/{total} · Daily day {day}', { done, total: content.journeyCount, day: serverTime.utcDay() }) + ' · ' +
    (platform.isHosted() ? T('cloud save {status}', { status: syncLabel() }) : T('local play'));
  // Sign-in (platform host, no token) and invite (signed in); hidden locally.
  $('btn-signin').classList.toggle('hidden', !platform.canSignIn());
  $('btn-invite').classList.toggle('hidden', !platform.isHosted());
}

async function boot() {
  transition('boot', 'initial load');
  setScreen('loading');
  platform.handshake();
  keyBindings = defaultKeyBindings();
  // Another device saved first: reload the slot, merge both sides, adopt, save back.
  platform.onConflict(async () => {
    const remote = await platform.cloudLoad();
    if (platform.cloudReadFailed()) return;
    session.importDoc(session.mergeDocs(remote, session.exportDoc()));
    settings = session.loadSettings();
    progress = session.loadProgress();
    applySettings(); syncSettingsForm();
    refreshTitle(); refreshProgressRail();
    if (current) updateRails();
    platform.cloudSave(session.exportDoc());
  });
  platform.onAuth((a) => {
    refreshTitle();
    if (current) updateRails();
    if (!a.signedIn) toast(shT().signedOut); // keep playing locally
  });
  // Capability detection: WebGL required for 3D; 2D accessible board is the fallback.
  const canvas = $('game-canvas');
  try {
    render.init(canvas, { reducedMotion: settings.reducedMotion });
    document.body.dataset.render3d = '1';
  } catch (err) {
    render3d = false;
  }
  render.onEvent((name) => audio.playEvent(name));
  audio.configure(settings);
  audio.bindVisibility();
  applySettings();
  bindSettings();
  bindGraphics();
  wireButtons();
  bindPointer(canvas);
  bindKeyboard();
  bindLifecycle();
  requestAnimationFrame(pollGamepad);
  // Core data first, scenic lazily; server time (signed in only) + content validation.
  await platform.syncTime();
  // Hosted: pull the account nickname and the remote save (remote wins on
  // conflict), then the read-only leaderboard; everything degrades silently.
  if (platform.isHosted()) {
    const [, remote, kv, binds] = await Promise.all([
      platform.fetchProfile(), platform.cloudLoad(), platform.loadSettings(), platform.loadBindings(keyBindings),
    ]);
    keyBindings = binds;
    if (remote && session.importDoc(remote)) {
      settings = session.loadSettings();
      progress = session.loadProgress();
    }
    // Settings KV wins over the local / cloud-save copy, key by key.
    let tuned = false;
    for (const k of Object.keys(kvSettings())) {
      if (kv[k] !== undefined && kv[k] !== null) { settings[k] = kv[k]; tuned = true; }
    }
    if (tuned) session.saveSettings(settings);
    platform.primeSettings(kvSettings());
    if (remote || tuned) { applySettings(); syncSettingsForm(); }
    platform.refreshHostedBoard().then(() => {
      if (current) updateRails();
      refreshTitle();
    });
  }
  const report = content.validateAll();
  const bad = report.filter((r) => !r.ok);
  if (bad.length) {
    session.track('error');
    console.warn('content validation issues', bad);
  }
  refreshProgressRail();
  refreshTitle();
  transition('title', 'boot complete');
  // A failed WebGL context is reported once boot has finished, otherwise the
  // title screen would immediately replace the notice.
  setScreen(render3d ? 'title' : 'compat');
  // Returning player: snapshot is offered one level below Play.
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}

export { boot };

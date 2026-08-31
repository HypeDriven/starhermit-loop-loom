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
import * as serverTime from './server-time.js';

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
let dailyExcluded = false;   // defective daily days are excluded from ranking
let render3d = true;
let speedTimer = null;
let journeyPick = 0;
let cmdCounter = 0;

const REASONS = {
  'same-peg': 'That is the same peg.',
  'empty-source': 'That peg is empty.',
  'no-space': 'That peg is full.',
  'color-mismatch': 'Loops may only land on a matching color or an empty peg.',
  'round-over': 'The round is over.',
  'bad-peg': 'Unknown peg.',
};

function transition(next, reason) {
  appState = next;
  document.body.dataset.appstate = next;
  announce(stateLabel(next) + (reason ? ' — ' + reason : ''));
}

function stateLabel(s) {
  return {
    boot: 'Loading', title: 'Title screen', 'profile-ready': 'Ready',
    'mode-select': 'Mode selection', preparing: 'Preparing round',
    tutorial: 'Tutorial', countdown: 'Get ready', active: 'Round active',
    paused: 'Paused', reconnecting: 'Reconnecting', resolving: 'Resolving',
    results: 'Results', progression: 'Progression',
  }[s] || s;
}

// ---------------------------------------------------------------------------
// Announcements, captions, toast
// ---------------------------------------------------------------------------

let liveTimer = 0;
function announce(text) {
  const el = $('live-region');
  el.textContent = '';
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => { el.textContent = text; }, 30);
}

let captionTimer = 0;
audio.onCaption((text) => {
  if (!text) return;
  const el = $('caption-line');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => el.classList.add('hidden'), 2200);
});

let toastTimer = 0;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
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
  $('a11y-board').classList.toggle('hidden', !inGame && appState !== 'active');
  // Focus management: restore after modals, move into new overlay.
  const overlay = document.querySelector(`[data-screen="${name}"]`);
  if (overlay) {
    const btn = overlay.querySelector('button');
    if (btn) { lastFocus = btn; btn.focus(); }
  } else if (lastFocus && name === 'play') {
    lastFocus = null;
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function applySettings() {
  audio.configure(settings);
  render.setReducedMotion(settings.reducedMotion);
  render.setQuality(settings.quality);
  render.setPalette(settings.palette);
  document.body.classList.toggle('larger-text', settings.largerText);
  document.body.classList.toggle('high-contrast', settings.highContrast);
  document.body.classList.toggle('left-handed', settings.leftHanded);
  document.body.classList.toggle('a11y-board-hidden', false);
}

function bindSettings() {
  const bind = (id, key, isRange) => {
    const el = $(id);
    if (isRange || el.type === 'checkbox') {
      if (isRange) el.value = settings[key]; else el.checked = !!settings[key];
      el.addEventListener('change', () => {
        settings[key] = isRange ? parseFloat(el.value) : el.checked;
        session.saveSettings(settings);
        session.track('settings-change');
        applySettings();
      });
    } else {
      el.value = settings[key];
      el.addEventListener('change', () => {
        settings[key] = el.value;
        session.saveSettings(settings);
        session.track('settings-change');
        applySettings();
      });
    }
  };
  bind('set-music', 'music', true);
  bind('set-effects', 'effects', true);
  bind('set-ambience', 'ambience', true);
  bind('set-voice', 'voice', true);
  bind('set-muted', 'muted');
  bind('set-quality', 'quality');
  bind('set-motion', 'reducedMotion');
  bind('set-palette', 'palette');
  bind('set-contrast', 'highContrast');
  bind('set-text', 'largerText');
  bind('set-left', 'leftHanded');
  bind('set-hold', 'holdToLift');
  bind('set-timing', 'timingAssist');
  bind('set-haptics', 'haptics');
  bind('set-telemetry', 'telemetryConsent');
}

// ---------------------------------------------------------------------------
// Help — rule cards generated from current control mappings.
// ---------------------------------------------------------------------------

function showHelp(returnTo) {
  helpReturn = returnTo;
  const b = settings.bindings;
  $('help-text').innerHTML = `
    <p><strong>Goal:</strong> move loops between pegs — keeping their stack order — until every peg holds a single color.</p>
    <h2>Rules</h2>
    <ul>
      <li>Only the <em>top</em> loop group lifts. Same-colored loops touching at the top move together.</li>
      <li>A group lands on a matching color or an empty peg, never past a peg's capacity.</li>
      <li>Invalid drops are rejected with an explanation.</li>
    </ul>
    <h2>Controls</h2>
    <ul>
      <li>Pointer/touch: tap a peg to lift, tap a target to drop. Drag also works.</li>
      <li>Keyboard: <b>${b.left}/${b.right}</b> choose peg, <b>${b.confirm}</b> lift/drop, <b>${b.cancel}</b> cancel, <b>${b.undo.replace('Key', '')}</b> undo, <b>${b.hint.replace('Key', '')}</b> hint, <b>${b.pause.replace('Key', '')}</b> pause, <b>${b.camera.replace('Key', '')}</b> reset camera.</li>
      <li>Gamepad: D-pad/left stick chooses a peg, south button lifts/drops, east cancels, start pauses.</li>
    </ul>
    <h2>Scoring</h2>
    <ul>
      <li>Completion + efficiency vs par + no-undo mastery − invalid attempts.</li>
      <li>Ties: completion, fewer invalid actions, faster time, then session id.</li>
    </ul>`;
  setScreen('help');
}

// ---------------------------------------------------------------------------
// Mode setup screens
// ---------------------------------------------------------------------------

function openSetup(mode, record) {
  pendingMode = mode;
  pendingRecord = record;
  $('setup-title').textContent = record.title || mode;
  const bits = [];
  bits.push(`${record.colors} colors · ${record.pegCount} pegs · capacity ${record.cap}`);
  bits.push(`par ${record.par} moves`);
  if (record.moveLimit) bits.push(`move limit ${record.moveLimit}`);
  if (record.timeTargetMs) bits.push(`time target ${Math.round(record.timeTargetMs / 1000)}s`);
  if (record.noUndo) bits.push('undo disabled');
  $('setup-rules').textContent = (record.tutorial ? record.tutorial.text :
    record.challenge ? record.challenge.text :
    'Sort every loop so each peg holds one color.') ;
  const ranked = mode === 'daily' || mode === 'chase';
  $('setup-meta').textContent =
    `Solo · ~${Math.max(1, Math.round(record.par / 3))} min · assists: hints/undo ` +
    (ranked ? '(ranked — undo lowers mastery bonus)' : '(unranked)');
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
      b.setAttribute('aria-label', `Stage ${i + 1}${done ? ' completed' : locked ? ' locked' : ''}`);
      b.addEventListener('click', () => { journeyPick = i; openSetup('journey', content.getJourneyStage(i)); });
      grid.appendChild(b);
    }
    extra.appendChild(grid);
  } else if (mode === 'practice') {
    const row = document.createElement('div');
    row.className = 'settings-row';
    row.innerHTML = '<label for="practice-diff">Difficulty</label>';
    const sel = document.createElement('select');
    sel.id = 'practice-diff';
    for (let d = 1; d <= 10; d++) {
      const o = document.createElement('option');
      o.value = d; o.textContent = 'Level ' + d;
      sel.appendChild(o);
    }
    sel.value = settings.difficulty;
    sel.addEventListener('change', () => {
      settings.difficulty = parseInt(sel.value, 10);
      session.saveSettings(settings);
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
      b.textContent = c.title + ' — ' + c.text;
      b.addEventListener('click', () => openSetup('challenge', content.getChallenge(i, Date.now() % 100000)));
      col.appendChild(b);
    });
    extra.appendChild(col);
  }
  transition('mode-select', 'setup opened');
  setScreen('setup');
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
    speedTimer = setInterval(() => {
      if (!current || current.status !== 'active') { clearInterval(speedTimer); return; }
      if (current.elapsedMs() > record.timeTargetMs) {
        clearInterval(speedTimer);
        current.state.status = 'lost';
        current.state.terminal = 'time-limit';
        endRound('time-limit');
      } else updateHud();
    }, 250);
  }
  transition(record.tutorial ? 'tutorial' : 'active', 'round started');
  setScreen('play');
  if (record.tutorial) showTutorialStep();
  announce('Round started. ' + (record.title || '') + '. ' + boardDescription());
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
    platform.unlockAchievement(id);
  }
  // Score boards: local always; authoritative submission for daily/chase.
  const entry = Object.assign({}, r, {
    contentId: current.record.id, seed: current.record.seed,
    version: current.record.version, day: current.record.day,
  });
  if (r.solved) session.recordScore(entry);
  if ((current.mode === 'daily' || current.mode === 'chase') && r.solved && !dailyExcluded) {
    platform.submitScore(current.replayEnvelope()).then((res) => {
      if (res.ok) toast('Score submitted to the global board.');
      else if (res.error !== 'offline') toast('Score rejected: ' + res.error);
    });
  }
  showResults(unlocked, reason);
}

function showResults(unlocked, reason) {
  const r = current.result;
  $('result-headline').textContent = r.solved ? 'Loom complete!' :
    (reason === 'time-limit' ? 'Out of time' : 'Out of moves');
  const rows = [
    ['Completion', r.completion],
    ['Efficiency (par ' + r.par + ', ' + r.moves + ' moves)', r.efficiency],
    ['No-undo mastery', r.mastery],
    ['Invalid attempts', r.invalidPenalty],
    ['Total', r.total],
  ];
  $('result-score').innerHTML = rows.map(([k, v]) =>
    `<div class="score-line"><span>${k}</span><b>${v}</b></div>`).join('') +
    `<div class="score-line"><span>Time</span><b>${(r.elapsedMs / 1000).toFixed(1)}s</b></div>`;
  $('result-achievements').innerHTML = unlocked.map((id) => {
    const a = session.ACHIEVEMENTS.find((x) => x.id === id);
    return `<span class="badge new">★ ${a ? a.name : id}</span>`;
  }).join('');
  // Comparison + next recommended action.
  const best = session.getScores('global')[0];
  $('result-compare').textContent = best ?
    `Your best local score: ${best.score} (${best.moves} moves).` :
    'This is your first recorded score.';
  const next = $('btn-next');
  if (current.mode === 'journey' && r.solved && journeyPick + 1 < content.journeyCount) {
    next.textContent = 'Next stage';
    next.onclick = () => { journeyPick++; openSetup('journey', content.getJourneyStage(journeyPick)); };
  } else if (current.mode === 'learn' && r.solved) {
    const idx = content.LESSONS.findIndex((l) => l.id === current.record.id);
    if (idx + 1 < content.LESSONS.length) {
      next.textContent = 'Next lesson';
      next.onclick = () => openSetup('learn', content.getLesson(idx + 1));
    } else { next.textContent = 'Start the Journey'; next.onclick = () => openSetup('journey', content.getJourneyStage(progress.journeyUnlocked)); }
  } else {
    next.textContent = 'Play again';
    next.onclick = () => startRound(current.record, current.mode);
  }
  transition('results', 'round ended: ' + reason);
  setScreen('results');
  announce((r.solved ? 'Loom complete. ' : 'Round over. ') + 'Total score ' + r.total + '.');
  refreshProgressRail();
}

function showTutorialStep() {
  const t = current.tutorial;
  const steps = current.record.tutorial.steps;
  if (!t || t.step >= steps.length) return;
  const s = steps[t.step];
  $('hud-objective').textContent = current.record.tutorial.title + ': ' + s.prompt;
  announce(s.prompt);
}

// ---------------------------------------------------------------------------
// HUD / rails / accessible board mirror
// ---------------------------------------------------------------------------

function updateHud() {
  if (!current) return;
  const st = current.state;
  const score = rules.scoreComponents(st, current.record.par, current.elapsedMs()).total;
  let txt = `Moves ${st.moves}` + (st.moveLimit ? `/${st.moveLimit}` : '') + ` · Score ${score}`;
  if (current.record.timeTargetMs && !settings.timingAssist) {
    const left = Math.max(0, current.record.timeTargetMs - current.elapsedMs());
    txt += ` · ${(left / 1000).toFixed(0)}s`;
  }
  $('hud-status').textContent = txt;
  if (!current.record.tutorial) {
    const done = st.pegs.filter((p) => p.length > 1 && p.every((c) => c === p[0])).length;
    $('hud-objective').textContent = `Uniform pegs: ${done} / ${st.colors}`;
  }
}

function updateRails() {
  if (!current) return;
  $('rail-mode').textContent = `Mode: ${pendingMode} · ${current.record.title || ''}`;
  $('rail-online').textContent = platform.isOnline() ?
    'Connected — scores submit to the global board.' :
    'Offline — playing locally; scores are stored on this device.';
  $('rail-objective').textContent = current.record.challenge ? current.record.challenge.text :
    'Move loops between pegs until every peg holds one color.';
  $('rail-progress').textContent = `Par ${current.record.par} · seed ${current.record.seed.toString(16)}`;
  $('btn-undo').disabled = current.snapshots.length === 0 || !!current.record.noUndo;
  $('tray-undo').disabled = $('btn-undo').disabled;
  // Scores
  const list = $('rail-scores');
  list.innerHTML = '';
  const scores = session.getScores(current.mode === 'daily' ? 'daily' : 'global', current.record.day);
  for (const s of scores.slice(0, 8)) {
    const li = document.createElement('li');
    li.textContent = `${s.score} · ${s.moves} moves · ${(s.elapsedMs / 1000).toFixed(0)}s`;
    list.appendChild(li);
  }
  if (!scores.length) list.innerHTML = '<li>No scores yet.</li>';
  // Achievements
  const al = $('rail-achievements');
  al.innerHTML = '';
  for (const a of session.ACHIEVEMENTS) {
    const li = document.createElement('li');
    li.textContent = (progress.achievements[a.id] ? '★ ' : '☆ ') + a.name;
    li.style.color = progress.achievements[a.id] ? 'var(--accent)' : 'var(--dim)';
    al.appendChild(li);
  }
}

function refreshProgressRail() {
  const done = Object.keys(progress.journeyDone).length;
  $('rail-journey').textContent = `Journey: ${done}/${content.journeyCount} stages · ` +
    `${Object.keys(progress.achievements).length}/${session.ACHIEVEMENTS.length} achievements · ` +
    `${progress.roundsCompleted} rounds completed`;
}

function boardDescription() {
  if (!current) return '';
  return current.state.pegs.map((p, i) =>
    `Peg ${i + 1}: ` + (p.length ? p.map((c) => content.COLOR_NAMES[c]).join(', ') : 'empty')).join('. ');
}

// DOM mirror of the canvas: one real button per peg, glyph-coded stacks.
function updateA11yBoard() {
  const wrap = $('a11y-board');
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
    const label = `Peg ${i + 1}: ` + (p.length ? p.map((c) => content.COLOR_NAMES[c]).join(', ') : 'empty');
    b.setAttribute('aria-label', label + (selectedPeg === i ? ' (lifted)' : ''));
    b.innerHTML = p.length ?
      p.slice().reverse().map((c) => `<span class="glyph" style="color:${content.PALETTES[settings.palette][c]}">${content.COLOR_GLYPHS[c]}</span>`).join('') :
      '<span class="glyph">·</span>';
    b.addEventListener('click', () => onPegChosen(i));
    wrap.appendChild(b);
  });
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
    announce(`Lifted ${g.size} ${content.COLOR_NAMES[g.color]} loop${g.size > 1 ? 's' : ''} from peg ${i + 1}. Choose a target peg.`);
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
    feedbackInvalid(i, r.reason);
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
  platform.presenceHeartbeat();
  updateHud();
  updateRails();
  updateA11yBoard();
  announce(`Moved to peg ${i + 1}. ${boardDescription()}`);
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
          $('hud-objective').textContent = 'Good! Finish the loom.';
          announce('Lesson step complete. Now finish the loom on your own.');
        }
      }
    }
  }
  if (current.status !== 'active') endRound(current.state.terminal || 'solved');
}

function feedbackInvalid(peg, reason) {
  current.applyCommand({ id: nextCmdId(), type: 'invalid' }); // no-op guard
  current.state = rules.applyInvalid(current.state);
  render.invalidFeedback(peg);
  audio.playEvent('invalid');
  if (settings.haptics && navigator.vibrate) navigator.vibrate([30, 40, 30]);
  const msg = REASONS[reason] || 'That move is not allowed.';
  toast(msg);
  announce(msg);
  updateHud();
}

function doUndo() {
  if (!current || current.status !== 'active') return;
  const r = current.applyCommand({ id: nextCmdId(), type: 'undo' });
  if (!r.ok) { toast(REASONS[r.reason] || 'Nothing to undo.'); return; }
  selectedPeg = null;
  render.setSelection(null);
  render.clearPreview();
  render.setBoard(current.state);
  audio.playEvent('undo');
  session.saveSnapshot(current);
  updateHud(); updateRails(); updateA11yBoard();
  announce('Move undone.');
}

function doHint() {
  if (!current || current.status !== 'active') return;
  const h = current.hint();
  audio.playEvent('hint');
  if (!h) { toast('No useful move found — try undo.'); return; }
  toast(`Hint: try peg ${h.from + 1} → peg ${h.to + 1}.`);
  announce(`Hint: move from peg ${h.from + 1} to peg ${h.to + 1}.`);
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
    const b = settings.bindings;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
    const inGame = appState === 'active' || appState === 'tutorial';
    if (e.code === b.pause || (e.code === 'Escape' && appState === 'active')) { e.preventDefault(); togglePause(); return; }
    if (!inGame) return;
    const n = current ? current.state.pegs.length : 0;
    if (e.code === b.left) { kbFocusPeg = (kbFocusPeg - 1 + n) % n; updateA11yBoard(); e.preventDefault(); }
    else if (e.code === b.right) { kbFocusPeg = (kbFocusPeg + 1) % n; updateA11yBoard(); e.preventDefault(); }
    else if (e.code === b.up) { kbFocusPeg = Math.max(0, kbFocusPeg - 1); updateA11yBoard(); e.preventDefault(); }
    else if (e.code === b.down) { kbFocusPeg = Math.min(n - 1, kbFocusPeg + 1); updateA11yBoard(); e.preventDefault(); }
    else if (e.code === b.confirm || e.code === 'Space') { onPegChosen(kbFocusPeg); e.preventDefault(); }
    else if (e.code === b.cancel) {
      if (selectedPeg !== null) { selectedPeg = null; render.setSelection(null); render.clearPreview(); updateA11yBoard(); audio.playEvent('deselect'); }
      e.preventDefault();
    }
    else if (e.code === b.undo) { doUndo(); e.preventDefault(); }
    else if (e.code === b.hint) { doHint(); e.preventDefault(); }
    else if (e.code === b.camera) { render.resetCamera(); e.preventDefault(); }
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
      platform.activityEnd();
    } else {
      platform.activityStart();
      restartRenderer();
      // "While you were away" summary.
      if (current && appState === 'paused') {
        const away = current.snapshot();
        toast('Welcome back — the atelier kept your place.');
        session.saveSnapshot(current);
      }
    }
  });
  window.addEventListener('beforeunload', () => {
    session.saveSnapshot(current);
    platform.activityEnd();
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
  if (rendererAlive) return;
  rendererAlive = true;
  try { render.init($('game-canvas'), { reducedMotion: settings.reducedMotion }); applySettings(); } catch { /* keep 2D */ }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function wireButtons() {
  const click = (id, fn) => $(id).addEventListener('click', () => { audio.unlock(); audio.playEvent('click'); fn(); });
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
  click('mode-back', () => setScreen('title'));
  click('btn-start-round', () => startRound(pendingRecord, pendingMode));
  click('btn-back-title', () => setScreen('title'));
  click('btn-pause', togglePause);
  click('btn-resume', togglePause);
  click('btn-leave', () => { session.saveSnapshot(current); current = null; transition('title', 'user left'); setScreen('title'); refreshTitle(); });
  click('btn-open-settings', () => setScreen('settings'));
  click('btn-settings-close', () => setScreen(appState === 'paused' ? 'pause' : 'title'));
  click('btn-help-pause', () => showHelp('pause'));
  click('btn-help-close', () => setScreen(helpReturn));
  click('btn-retry', () => { session.track('retry'); startRound(current.record, current.mode); });
  click('btn-results-title', () => { transition('title', 'results closed'); setScreen('title'); refreshTitle(); });
  click('btn-undo', doUndo);
  click('btn-hint', doHint);
  click('tray-undo', doUndo);
  click('tray-hint', doHint);
  click('tray-help', () => showHelp('play'));
  click('tray-panel', () => $('rail-right').classList.toggle('drawer-open'));
  click('btn-drawer-left', () => $('rail-left').classList.toggle('drawer-open'));
  click('btn-restart', () => startRound(current.record, current.mode));
  click('btn-settle', () => render.settle());
  click('btn-replay-tutorial', () => { setScreen('title'); openSetup('learn', content.getLesson(0)); });
  click('btn-compat-close', () => { setScreen(current ? 'play' : 'title'); });
}

function resumeRound() {
  audio.setSeed(current.record.seed);
  render.setTheme(current.record.theme);
  render.setBoard(current.state);
  updateA11yBoard(); updateHud(); updateRails();
  transition('active', 'session restored');
  setScreen('play');
  toast('Round restored from your last safe snapshot.');
}

function refreshTitle() {
  const saved = session.loadSnapshot();
  $('btn-resume-saved').classList.toggle('hidden', !saved);
  const done = Object.keys(progress.journeyDone).length;
  $('title-status').textContent =
    `Journey ${done}/${content.journeyCount} · Daily day ${serverTime.utcDay()} · ` +
    (platform.isOnline() ? 'online' : 'offline (local play)');
}

async function boot() {
  transition('boot', 'initial load');
  setScreen('loading');
  platform.handshake();
  // Capability detection: WebGL required for 3D; 2D accessible board is the fallback.
  const canvas = $('game-canvas');
  try {
    render.init(canvas, { reducedMotion: settings.reducedMotion });
    document.body.dataset.render3d = '1';
  } catch (err) {
    render3d = false;
    setScreen('compat');
  }
  render.onEvent((name) => audio.playEvent(name));
  audio.configure(settings);
  audio.bindVisibility();
  applySettings();
  bindSettings();
  wireButtons();
  bindPointer(canvas);
  bindKeyboard();
  bindLifecycle();
  requestAnimationFrame(pollGamepad);
  // Core data first, scenic lazily; server time + content validation.
  await platform.syncTime();
  const report = content.validateAll();
  const bad = report.filter((r) => !r.ok);
  if (bad.length) {
    session.track('error');
    // Defective content: mark excluded from ranking rather than replacing it.
    if (bad.some((r) => r.id.startsWith('daily-'))) dailyExcluded = true;
    console.warn('content validation issues', bad);
  }
  platform.activityStart();
  refreshProgressRail();
  refreshTitle();
  transition('title', 'boot complete');
  setScreen('title');
  // Returning player: snapshot is offered one level below Play.
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}

export { boot };

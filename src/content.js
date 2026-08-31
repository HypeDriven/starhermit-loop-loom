'use strict';

// Loop Loom — versioned content: themes, journey stages, lessons, daily, challenges.
// Every content record carries: identifier, seed, goals, allowed mechanics,
// par values, tutorial flags, and presentation theme.

import { fnv1a, generateBoard, CAP_DEFAULT, RULES_VERSION } from './rules.js';

export const CONTENT_VERSION = 1;

// ---------------------------------------------------------------------------
// Themes (5 visual themes)
// ---------------------------------------------------------------------------

export const THEMES = [
  { id: 'atelier', name: 'Atelier', bg: 0x241f1c, floor: 0x4a3c31, brass: 0xc9a227, ambient: 0xffe6c4, key: 0xfff1dd, accent: '#e8c07a' },
  { id: 'dawn', name: 'Dawn', bg: 0x2b2430, floor: 0x574a52, brass: 0xd4a94e, ambient: 0xffd9d0, key: 0xffe9e0, accent: '#f0a8b8' },
  { id: 'dusk', name: 'Dusk', bg: 0x1d2333, floor: 0x37405c, brass: 0xc9a227, ambient: 0xc4d4ff, key: 0xe8eeff, accent: '#8fa8e8' },
  { id: 'night', name: 'Night', bg: 0x14161d, floor: 0x272b36, brass: 0xb08d2e, ambient: 0x9fb4d8, key: 0xd8e4ff, accent: '#7a94c8' },
  { id: 'ember', name: 'Ember', bg: 0x261a14, floor: 0x4e3428, brass: 0xd9a13b, ambient: 0xffc9a0, key: 0xffdcc0, accent: '#e88a5a' },
];
export function getTheme(id) { return THEMES.find((t) => t.id === id) || THEMES[0]; }

// ---------------------------------------------------------------------------
// Loop palettes — color is always reinforced by a shape glyph and label.
// ---------------------------------------------------------------------------

export const PALETTES = {
  default: ['#d64541', '#3f7fd6', '#4caf6d', '#f2c94c', '#9b59b6', '#e67e22'],
  deuteranopia: ['#d64541', '#3f7fd6', '#f2c94c', '#8c8c8c', '#9b59b6', '#4dd0e1'],
  protanopia: ['#c8b62e', '#3f7fd6', '#4caf6d', '#f2e14c', '#7e57c2', '#e67e22'],
  tritanopia: ['#d64541', '#2ec4b6', '#e0719e', '#f2c94c', '#8d6e63', '#4dd0e1'],
  contrast: ['#ff4d4d', '#4da6ff', '#66ff66', '#ffe14d', '#ff66ff', '#ffa64d'],
};
export const COLOR_GLYPHS = ['●', '▲', '■', '◆', '★', '⬟'];
export const COLOR_NAMES = ['crimson', 'indigo', 'fern', 'marigold', 'violet', 'ember'];

// ---------------------------------------------------------------------------
// Difficulty curve — measured from solution depth, branching, constraints.
// ---------------------------------------------------------------------------

function stageConfig(index) {
  // index 0-based. Ramp: 3 colors/6 pegs -> 6 colors/8 pegs, occasional
  // mastery stages with a move limit (test before adding a new concept).
  const t = index / 47;
  const colors = Math.min(6, 3 + Math.floor(index / 10));
  const emptyPegs = index >= 30 ? 2 : 2;
  const cap = CAP_DEFAULT;
  const mastery = (index + 1) % 8 === 0; // periodic mastery stage
  return { colors, cap, emptyPegs, mastery, t };
}

function buildRecord(id, seed, cfg, extra) {
  const board = generateBoard(seed, cfg.colors, cfg.cap, cfg.emptyPegs);
  const rec = {
    id,
    version: CONTENT_VERSION,
    rulesVersion: RULES_VERSION,
    seed,
    colors: cfg.colors,
    cap: cfg.cap,
    pegCount: cfg.colors + cfg.emptyPegs,
    pegs: board.pegs,
    par: board.par,
    moveLimit: null,
    timeTargetMs: null,
    tutorial: null,
    theme: THEMES[Math.floor(fnv1a(id) / 7) % THEMES.length].id,
    goals: { solve: true },
  };
  return Object.assign(rec, extra || {});
}

// ---------------------------------------------------------------------------
// Journey — 48 authored (deterministically generated + validated) stages.
// ---------------------------------------------------------------------------

const JOURNEY = [];
for (let i = 0; i < 48; i++) {
  const cfg = stageConfig(i);
  const seed = fnv1a('journey:' + i + ':v' + CONTENT_VERSION);
  const rec = buildRecord('journey-' + (i + 1), seed, cfg, {
    title: 'Stage ' + (i + 1),
    theme: THEMES[i % THEMES.length].id,
  });
  if (cfg.mastery) rec.moveLimit = rec.par + 2 + Math.floor(rec.par / 4);
  rec.difficulty = 1 + Math.round(cfg.t * 9);
  JOURNEY.push(rec);
}
export const journeyCount = JOURNEY.length;
export function getJourneyStage(i) { return JOURNEY[Math.max(0, Math.min(JOURNEY.length - 1, i))]; }

// ---------------------------------------------------------------------------
// Learn — interactive lessons, one rule at a time; player must perform it.
// ---------------------------------------------------------------------------

export const LESSONS = [
  {
    id: 'learn-1', title: 'Lift & drop',
    text: 'Loops lift from the TOP of a peg. Select the highlighted peg, then drop the loop onto the empty peg.',
    pegs: [[0, 1], [0], [1], []], cap: 4, colors: 2, seed: 101,
    steps: [
      { expect: { from: 0, to: 3 }, prompt: 'Lift the indigo loop off peg one onto the empty peg.' },
      { expect: { from: 1, to: 0 }, prompt: 'Now stack crimson onto crimson to finish.' },
    ],
    theme: 'atelier',
  },
  {
    id: 'learn-2', title: 'Match colors',
    text: 'A loop may only land on a matching color or an empty peg. Mismatched pegs reject the drop.',
    pegs: [[0, 1], [1, 0], [], []], cap: 4, colors: 2, seed: 102,
    steps: [
      { expect: { from: 0, to: 2 }, prompt: 'Lift the indigo loop off peg one onto an empty peg.' },
      { expect: { from: 0, to: 1 }, prompt: 'Now stack crimson onto the crimson-topped peg.' },
    ],
    theme: 'dawn',
  },
  {
    id: 'learn-3', title: 'Group lift',
    text: 'Same-colored loops touching at the top lift together as one group, keeping their order.',
    pegs: [[0, 1, 1], [0], [1], []], cap: 4, colors: 2, seed: 103,
    steps: [
      { expect: { from: 0, to: 3 }, prompt: 'Lift BOTH indigo loops at once onto the empty peg.' },
    ],
    theme: 'dusk',
  },
  {
    id: 'learn-4', title: 'Uniform pegs',
    text: 'You win when every peg is uniform. Solve this small loom on your own.',
    pegs: [[0, 1], [1, 0], [], []], cap: 4, colors: 2, seed: 104,
    steps: [],
    theme: 'night',
  },
];
export function getLesson(i) {
  const l = LESSONS[Math.max(0, Math.min(LESSONS.length - 1, i))];
  const pegs = l.pegs.map((p) => p.slice());
  return {
    id: l.id, version: CONTENT_VERSION, rulesVersion: RULES_VERSION,
    seed: l.seed, colors: l.colors, cap: l.cap, pegCount: l.pegs.length,
    pegs, par: solve(pegs, l.cap) || 2, moveLimit: null,
    tutorial: { title: l.title, text: l.text, steps: l.steps.map((s) => ({ ...s })) },
    theme: l.theme, goals: { solve: true },
  };
}

// ---------------------------------------------------------------------------
// Daily — one shared seed and ruleset per UTC day (immutable after publication).
// ---------------------------------------------------------------------------

export function dailySeed(dayNumber) {
  return fnv1a('daily:' + (dayNumber | 0) + ':v' + CONTENT_VERSION);
}

export function getDaily(dayNumber) {
  const seed = dailySeed(dayNumber);
  // Fixed mid-difficulty ruleset so the board is comparable worldwide.
  const rec = buildRecord('daily-' + (dayNumber | 0), seed, { colors: 4, cap: CAP_DEFAULT, emptyPegs: 2 }, {
    title: 'Daily Loom', theme: THEMES[(dayNumber | 0) % THEMES.length].id,
  });
  rec.day = dayNumber | 0;
  return rec;
}

// ---------------------------------------------------------------------------
// Practice — selectable difficulty, restart, undo allowed, unranked.
// ---------------------------------------------------------------------------

export function getPractice(difficulty, salt) {
  const d = Math.max(1, Math.min(10, difficulty | 0));
  const colors = d <= 2 ? 3 : d <= 5 ? 4 : d <= 8 ? 5 : 6;
  const seed = fnv1a('practice:' + d + ':' + (salt | 0));
  const rec = buildRecord('practice-' + d + '-' + (salt | 0), seed, { colors, cap: CAP_DEFAULT, emptyPegs: 2 }, {
    title: 'Practice · difficulty ' + d,
  });
  rec.difficulty = d;
  return rec;
}

// ---------------------------------------------------------------------------
// Challenge — constrained goals: move limit, speed target, restricted tools.
// ---------------------------------------------------------------------------

export const CHALLENGES = [
  { id: 'challenge-taut', kind: 'move-limit', title: 'Taut Thread', text: 'Solve within a tight move limit.', difficulty: 5 },
  { id: 'challenge-swapmeet', kind: 'move-limit', title: 'Swap Meet', text: 'A harder loom with barely any slack.', difficulty: 8 },
  { id: 'challenge-swift', kind: 'speed', title: 'Swift Shuttle', text: 'Solve before the timer runs out.', difficulty: 4, timeMs: 90000 },
  { id: 'challenge-noundo', kind: 'no-undo', title: 'No Takebacks', text: 'Undo is disabled. Every drop is final.', difficulty: 5 },
];

export function getChallenge(i, salt) {
  const c = CHALLENGES[Math.max(0, Math.min(CHALLENGES.length - 1, i))];
  const d = c.difficulty;
  const colors = d <= 5 ? 4 : 5;
  const seed = fnv1a(c.id + ':' + (salt | 0));
  const rec = buildRecord(c.id + '-' + (salt | 0), seed, { colors, cap: CAP_DEFAULT, emptyPegs: 2 }, {
    title: c.title, theme: 'ember',
  });
  rec.challenge = { kind: c.kind, text: c.text };
  if (c.kind === 'move-limit') rec.moveLimit = rec.par + 2;
  if (c.kind === 'speed') rec.timeTargetMs = c.timeMs;
  if (c.kind === 'no-undo') rec.noUndo = true;
  return rec;
}

// ---------------------------------------------------------------------------
// Score chase — validated seed + ruleset, asynchronous comparison.
// ---------------------------------------------------------------------------

export function getScoreChase(salt) {
  const seed = fnv1a('chase:' + (salt | 0) + ':v' + CONTENT_VERSION);
  return buildRecord('chase-' + (salt | 0), seed, { colors: 5, cap: CAP_DEFAULT, emptyPegs: 2 }, {
    title: 'Score Chase', theme: 'dusk',
  });
}

// ---------------------------------------------------------------------------
// Offline validation — prove legality, reachable goals, bounded par, no soft lock.
// ---------------------------------------------------------------------------

import { solve, createState, legalActions } from './rules.js';

export function validateContent(rec) {
  const errors = [];
  if (!rec || typeof rec.id !== 'string') errors.push('missing id');
  if (!Number.isInteger(rec.seed)) errors.push('missing seed');
  if (!Array.isArray(rec.pegs) || rec.pegs.length < 3) errors.push('bad pegs');
  if (errors.length) return { ok: false, errors };
  const counts = new Map();
  let loops = 0;
  for (const p of rec.pegs) {
    if (p.length > rec.cap) errors.push('peg over capacity');
    for (const c of p) { counts.set(c, (counts.get(c) || 0) + 1); loops++; }
  }
  for (const [c] of counts) {
    if (c < 0 || c >= rec.colors) errors.push('color out of range');
  }
  // Full boards must balance every color; partial tutorial boards are exempt.
  if (loops === rec.colors * rec.cap) {
    for (const [, n] of counts) if (n !== rec.cap) errors.push('unbalanced color count');
  }
  const par = solve(rec.pegs, rec.cap);
  if (par == null) errors.push('no reachable goal (unsolvable or unbounded)');
  else if (rec.par !== par) errors.push('par mismatch');
  const st = createState({ pegs: rec.pegs, cap: rec.cap, colors: rec.colors, seed: rec.seed });
  if (legalActions(st).length === 0 && par !== 0) errors.push('soft lock: no legal actions');
  if (rec.moveLimit != null && par != null && rec.moveLimit < par) errors.push('move limit below par');
  return { ok: errors.length === 0, errors, par };
}

export function validateAll() {
  const report = [];
  const check = (rec) => { const r = validateContent(rec); report.push({ id: rec.id, ok: r.ok, errors: r.errors }); };
  JOURNEY.forEach(check);
  for (let i = 0; i < LESSONS.length; i++) check(getLesson(i));
  for (let i = 0; i < CHALLENGES.length; i++) check(getChallenge(i, 0));
  check(getDaily(Math.floor(Date.UTC(2026, 0, 1) / 86400000)));
  check(getScoreChase(0));
  return report;
}

export default {
  CONTENT_VERSION, THEMES, getTheme, PALETTES, COLOR_GLYPHS, COLOR_NAMES,
  journeyCount, getJourneyStage, LESSONS, getLesson, dailySeed, getDaily,
  getPractice, CHALLENGES, getChallenge, getScoreChase, validateContent, validateAll,
};

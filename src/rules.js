'use strict';

// Loop Loom — pure deterministic rules engine.
// No DOM, no three, no side effects. Single source of truth for legality and scoring.
// Tutorials, hints, the client session and the authoritative server all call this API.

export const RULES_VERSION = 1;
export const CAP_DEFAULT = 4;

// ---------------------------------------------------------------------------
// Seeded random streams (rules stream is separate from decoration/AV streams)
// ---------------------------------------------------------------------------

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fnv1a(str) {
  let h = 2166136261 >>> 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// State model
// ---------------------------------------------------------------------------
// state = {
//   pegs: number[][],   // bottom -> top color indices
//   cap: number,        // max loops per peg
//   colors: number,
//   seed: number,
//   moves: number,      // committed moves
//   invalid: number,    // rejected action attempts (fairness tiebreak)
//   undos: number,
//   tick: number,       // monotonically increasing turn/tick number
//   status: 'active' | 'won' | 'lost',
//   terminal: null | string, // terminal-state reason
//   moveLimit: number | null,
// }

export function createState(cfg) {
  return {
    pegs: cfg.pegs.map((p) => p.slice()),
    cap: cfg.cap | 0,
    colors: cfg.colors | 0,
    seed: cfg.seed >>> 0,
    moves: 0,
    invalid: 0,
    undos: 0,
    tick: 0,
    status: 'active',
    terminal: null,
    moveLimit: cfg.moveLimit == null ? null : cfg.moveLimit | 0,
  };
}

export function cloneState(s) {
  return {
    pegs: s.pegs.map((p) => p.slice()),
    cap: s.cap, colors: s.colors, seed: s.seed,
    moves: s.moves, invalid: s.invalid, undos: s.undos,
    tick: s.tick, status: s.status, terminal: s.terminal,
    moveLimit: s.moveLimit,
  };
}

// ---------------------------------------------------------------------------
// Legality
// ---------------------------------------------------------------------------

// Top same-color group of a peg: { color, size } or null.
export function topGroup(state, peg) {
  const p = state.pegs[peg];
  if (!p || p.length === 0) return null;
  const color = p[p.length - 1];
  let size = 1;
  for (let i = p.length - 2; i >= 0 && p[i] === color; i--) size++;
  return { color, size };
}

// Why a move is illegal, or null when it is legal.
export function moveReason(state, from, to) {
  if (state.status !== 'active') return 'round-over';
  if (!Number.isInteger(from) || !Number.isInteger(to)) return 'bad-peg';
  if (from < 0 || to < 0 || from >= state.pegs.length || to >= state.pegs.length) return 'bad-peg';
  if (from === to) return 'same-peg';
  const src = state.pegs[from];
  if (src.length === 0) return 'empty-source';
  const dst = state.pegs[to];
  if (dst.length >= state.cap) return 'no-space';
  const g = topGroup(state, from);
  if (dst.length > 0 && dst[dst.length - 1] !== g.color) return 'color-mismatch';
  return null;
}

export function canMove(state, from, to) { return moveReason(state, from, to) === null; }

// How many loops a move would transfer (whole fitting group, order preserved).
export function moveCount(state, from, to) {
  const g = topGroup(state, from);
  if (!g) return 0;
  const free = state.cap - state.pegs[to].length;
  return Math.min(g.size, Math.max(0, free));
}

export function legalActions(state) {
  const acts = [];
  if (state.status !== 'active') return acts;
  for (let i = 0; i < state.pegs.length; i++) {
    if (state.pegs[i].length === 0) continue;
    for (let j = 0; j < state.pegs.length; j++) {
      if (canMove(state, i, j)) acts.push({ from: i, to: j });
    }
  }
  return acts;
}

// Pointless-move filter used by hints: moving a whole uniform peg onto an
// empty peg changes nothing strategic.
function isPointless(state, from, to) {
  const src = state.pegs[from];
  if (state.pegs[to].length !== 0) return false;
  if (src.length !== moveCount(state, from, to)) return false;
  for (let i = 1; i < src.length; i++) if (src[i] !== src[0]) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Transitions (immutable)
// ---------------------------------------------------------------------------

export function applyMove(state, from, to) {
  const reason = moveReason(state, from, to);
  if (reason) {
    const rejected = cloneState(state);
    rejected.invalid++;
    rejected.tick++;
    return { state: rejected, ok: false, reason };
  }
  const s = cloneState(state);
  const n = moveCount(state, from, to);
  const group = s.pegs[from].splice(s.pegs[from].length - n, n);
  for (const c of group) s.pegs[to].push(c);
  s.moves++;
  s.tick++;
  const t = terminalReason(s);
  if (t) { s.status = t === 'solved' ? 'won' : 'lost'; s.terminal = t; }
  return { state: s, ok: true, moved: n };
}

export function applyInvalid(state) {
  const s = cloneState(state);
  s.invalid++;
  s.tick++;
  return s;
}

// Terminal-state reason: 'solved' | 'move-limit' | null.
export function terminalReason(state) {
  for (const p of state.pegs) {
    if (p.length === 0) continue;
    for (let i = 1; i < p.length; i++) if (p[i] !== p[0]) return checkLimit(state);
  }
  return 'solved';
}
function checkLimit(state) {
  if (state.moveLimit != null && state.moves >= state.moveLimit) return 'move-limit';
  return null;
}

export function isTerminal(state) { return state.status !== 'active'; }

// ---------------------------------------------------------------------------
// Scoring — integer components; formatting is presentation-only.
// Tie order (handled by leaderboard compare): completion, fewer invalid,
// lower elapsed time, stable session id.
// ---------------------------------------------------------------------------

export function scoreComponents(state, par, elapsedMs) {
  const solved = state.status === 'won';
  const uniform = state.pegs.filter((p) => p.length > 1 && p.every((c) => c === p[0])).length;
  const completion = solved ? 1000 : uniform * 100;
  const p = par > 0 ? par : 1;
  const efficiency = solved ? Math.max(0, (Math.ceil(p * 1.5) - state.moves)) * 25 : 0;
  const mastery = solved && state.undos === 0 ? 250 : 0;
  const invalidPenalty = -15 * state.invalid;
  const total = Math.max(0, completion + efficiency + mastery + invalidPenalty);
  return { completion, efficiency, mastery, invalidPenalty, total, solved, moves: state.moves, par, elapsedMs: elapsedMs | 0 };
}

export function compareResults(a, b) {
  // Returns negative when a ranks above b.
  if (b.total !== a.total) return b.total - a.total;
  if (!!b.solved !== !!a.solved) return (b.solved ? 1 : 0) - (a.solved ? 1 : 0);
  if (a.invalid !== b.invalid) return a.invalid - b.invalid;
  if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs;
  return String(a.sessionId || '').localeCompare(String(b.sessionId || ''));
}

// ---------------------------------------------------------------------------
// Hashing / serialization (replay envelope support)
// ---------------------------------------------------------------------------

export function hashState(state) {
  let h = 2166136261 >>> 0;
  const mix = (v) => { h ^= v & 0xff; h = Math.imul(h, 16777619); };
  mix(state.cap); mix(state.colors); mix(state.moves); mix(state.invalid);
  for (const p of state.pegs) { mix(59); for (const c of p) mix(c + 1); }
  return h >>> 0;
}

export function serialize(state) {
  return JSON.parse(JSON.stringify(state));
}

export function deserialize(obj) {
  if (!obj || !Array.isArray(obj.pegs)) throw new Error('bad snapshot');
  return cloneState(obj);
}

// ---------------------------------------------------------------------------
// Board generation + offline validation (solvability, par, no soft lock)
// ---------------------------------------------------------------------------

function encodePeg(p) { return p.join(','); }

function canonicalKey(pegs) {
  return pegs.map(encodePeg).sort().join('|');
}

function isUniformSet(pegs) {
  for (const p of pegs) {
    for (let i = 1; i < p.length; i++) if (p[i] !== p[0]) return false;
  }
  return true;
}

// Breadth-first solver over canonicalized boards. Returns the shortest move
// count to a solved board, or null when unsolvable within the budget.
export function solve(startPegs, cap, budget) {
  const maxStates = budget || 300000;
  const start = startPegs.map((p) => p.slice());
  if (isUniformSet(start)) return 0;
  const seen = new Set([canonicalKey(start)]);
  let frontier = [start];
  let depth = 0;
  let explored = 1;
  while (frontier.length > 0) {
    depth++;
    const next = [];
    for (const pegs of frontier) {
      for (let i = 0; i < pegs.length; i++) {
        if (pegs[i].length === 0) continue;
        const st = { pegs, cap, status: 'active' };
        for (let j = 0; j < pegs.length; j++) {
          if (i === j || pegs[j].length >= cap) continue;
          const g = topGroup(st, i);
          if (pegs[j].length > 0 && pegs[j][pegs[j].length - 1] !== g.color) continue;
          if (isPointless(st, i, j)) continue;
          const n = Math.min(g.size, cap - pegs[j].length);
          const np = pegs.map((p) => p.slice());
          const grp = np[i].splice(np[i].length - n, n);
          for (const c of grp) np[j].push(c);
          const key = canonicalKey(np);
          if (seen.has(key)) continue;
          if (isUniformSet(np)) return depth;
          seen.add(key);
          next.push(np);
          if (++explored > maxStates) return null;
        }
      }
    }
    frontier = next;
  }
  return null;
}

// Deterministically generate a solvable, not-already-solved board.
// Tries candidate scramble streams derived from the seed until validation passes.
export function generateBoard(seed, colors, cap, emptyPegs) {
  const pegCount = colors + emptyPegs;
  for (let attempt = 0; attempt < 64; attempt++) {
    const rng = mulberry32((seed ^ Math.imul(attempt + 1, 0x9e3779b9)) >>> 0);
    const loops = [];
    for (let c = 0; c < colors; c++) for (let k = 0; k < cap; k++) loops.push(c);
    for (let i = loops.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = loops[i]; loops[i] = loops[j]; loops[j] = t;
    }
    const pegs = Array.from({ length: pegCount }, () => []);
    // Deal loops across the non-empty pegs, respecting capacity.
    const fillable = pegCount - emptyPegs;
    let idx = 0;
    for (let p = 0; p < fillable; p++) {
      while (pegs[p].length < cap && idx < loops.length) pegs[p].push(loops[idx++]);
    }
    if (isUniformSet(pegs)) continue; // already solved — not a puzzle
    const par = solve(pegs, cap);
    if (par == null) continue; // failed validation: unsolvable or unbounded
    if (par < Math.max(2, colors)) continue; // too trivial
    return { pegs, par };
  }
  // Defensive fallback: near-solved board is always valid.
  const pegs = Array.from({ length: pegCount }, () => []);
  for (let c = 0; c < colors; c++) for (let k = 0; k < cap; k++) pegs[c % (pegCount - emptyPegs)].push(c);
  const t = pegs[0].pop(); pegs[1].push(t);
  return { pegs, par: solve(pegs, cap) || 4 };
}

// ---------------------------------------------------------------------------
// Hint — uses the same legal-action API as play.
// ---------------------------------------------------------------------------

export function hint(state) {
  const acts = legalActions(state).filter((a) => !isPointless(state, a.from, a.to));
  if (acts.length === 0) return null;
  let best = null;
  let bestScore = -Infinity;
  for (const a of acts) {
    const { state: s } = applyMove(state, a.from, a.to);
    let sc = 0;
    for (const p of s.pegs) {
      if (p.length > 1 && p.every((c) => c === p[0])) sc += 10; // completed/uniform peg
      if (p.length === 0) sc += 2; // freed peg
    }
    const dst = state.pegs[a.to];
    if (dst.length > 0) sc += 4; // stacking onto a match
    if (dst.length > 0 && dst.every((c) => c === dst[0]) && dst.length + moveCount(state, a.from, a.to) === state.cap) sc += 12;
    if (sc > bestScore) { bestScore = sc; best = a; }
  }
  return best;
}

export default {
  RULES_VERSION, CAP_DEFAULT, mulberry32, fnv1a, createState, cloneState,
  topGroup, moveReason, canMove, moveCount, legalActions, applyMove, applyInvalid,
  terminalReason, isTerminal, scoreComponents, compareResults,
  hashState, serialize, deserialize, solve, generateBoard, hint,
};

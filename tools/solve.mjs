// The shortest solution of a content record's board by breadth-first search over
// src/rules.js moves (tools/gen-plays.mjs and tools/browser-play.mjs play it).
import { applyMove, createState, legalActions } from '../src/rules.js';

/** Shortest move list for a record's board. */
export function solution(rec) {
  const start = createState({ pegs: rec.pegs, cap: rec.cap, colors: rec.colors, seed: rec.seed, moveLimit: rec.moveLimit });
  const key = (s) => s.pegs.map((p) => p.join(',')).join('|');
  const seen = new Map([[key(start), null]]);
  let frontier = [start];
  while (frontier.length) {
    const next = [];
    for (const s of frontier) {
      for (const a of legalActions(s)) {
        const r = applyMove(s, a.from, a.to);
        const k = key(r.state);
        if (seen.has(k)) continue;
        seen.set(k, { prev: key(s), move: a });
        if (r.state.status === 'won') {
          const moves = [];
          for (let at = k; seen.get(at); at = seen.get(at).prev) moves.unshift(seen.get(at).move);
          return moves;
        }
        next.push(r.state);
      }
    }
    frontier = next;
  }
  throw new Error(`no solution for ${rec.id}`);
}


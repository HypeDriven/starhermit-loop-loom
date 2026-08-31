'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import * as rules from '../src/rules.js';

const mk = (pegs, extra) => rules.createState(Object.assign({ pegs, cap: 4, colors: 2, seed: 1 }, extra || {}));

test('legal actions: empty pegs are skipped, self-moves excluded', () => {
  const st = mk([[0], [1], []]);
  const acts = rules.legalActions(st);
  assert.equal(acts.filter((a) => a.from === 2).length, 0);
  assert.equal(acts.filter((a) => a.from === a.to).length, 0);
  assert.ok(acts.length > 0);
});

test('move legality reasons', () => {
  const st = mk([[0, 1], [0], []]);
  assert.equal(rules.moveReason(st, 0, 0), 'same-peg');
  assert.equal(rules.moveReason(st, 2, 0), 'empty-source');
  assert.equal(rules.moveReason(st, 1, 0), 'color-mismatch'); // crimson onto indigo top
  assert.equal(rules.moveReason(st, 0, 2), null);
  assert.equal(rules.moveReason(st, 0, 9), 'bad-peg');
  const full = mk([[0, 0, 0, 0], [1], []]);
  assert.equal(rules.moveReason(full, 1, 0), 'no-space');
});

test('group move preserves order and respects capacity', () => {
  const st = mk([[0, 1, 1], [], [2]]);
  const r = rules.applyMove(st, 0, 1);
  assert.ok(r.ok);
  assert.equal(r.moved, 2);
  assert.deepEqual(r.state.pegs[1], [1, 1]);
  assert.deepEqual(r.state.pegs[0], [0]);
});

test('group move truncated by free space', () => {
  const st = mk([[0, 1, 1, 1], [1, 1, 1], []]);
  // target peg 1 has top 1, free 1 → move only 1 loop
  const r = rules.applyMove(st, 0, 1);
  assert.ok(r.ok);
  assert.equal(r.moved, 1);
  assert.deepEqual(r.state.pegs[1], [1, 1, 1, 1]);
});

test('invalid apply rejects and counts invalid', () => {
  const st = mk([[0], [1], []]);
  const r = rules.applyMove(st, 0, 1);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'color-mismatch');
  assert.equal(r.state.invalid, 1);
  assert.equal(r.state.tick, st.tick + 1);
});

test('terminal: solved when every peg uniform', () => {
  const solved = mk([[0, 0], [1, 1], []]);
  assert.equal(rules.terminalReason(solved), 'solved');
  const notSolved = mk([[0, 1], [1], [0]]);
  assert.equal(rules.terminalReason(notSolved), null);
});

test('terminal: move limit', () => {
  const st = mk([[0, 1], [1, 0], [], []], { moveLimit: 1 });
  const r = rules.applyMove(st, 0, 2);
  assert.equal(r.state.status, 'lost');
  assert.equal(r.state.terminal, 'move-limit');
  // round-over after terminal
  const r2 = rules.applyMove(r.state, 1, 3);
  assert.equal(r2.reason, 'round-over');
});

test('tick is monotonically increasing', () => {
  let st = mk([[0, 1], [1, 0], [], []]);
  let last = -1;
  for (const [f, t] of [[0, 2], [0, 3], [1, 0]]) {
    const r = rules.applyMove(st, f, t);
    st = r.state;
    assert.ok(st.tick > last);
    last = st.tick;
  }
});

test('scoring components are integers and explained', () => {
  const st = mk([[0, 0], [1, 1], []]);
  st.status = 'won';
  st.moves = 2;
  const c = rules.scoreComponents(st, 2, 5000);
  assert.equal(c.completion, 1000);
  assert.ok(c.mastery > 0);
  assert.ok(Number.isInteger(c.total));
  assert.equal(c.total, c.completion + c.efficiency + c.mastery + c.invalidPenalty);
});

test('serialization round-trips', () => {
  const st = mk([[0, 1], [1], [0], []]);
  st.moves = 3;
  const s2 = rules.deserialize(rules.serialize(st));
  assert.equal(rules.hashState(st), rules.hashState(s2));
  assert.equal(s2.moves, 3);
});

test('generated boards validate: solvable, balanced, par bounded', () => {
  for (const [colors, empty] of [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2]]) {
    const b = rules.generateBoard(rules.fnv1a('t' + colors), colors, 4, empty);
    assert.equal(b.pegs.length, colors + empty);
    const counts = {};
    for (const p of b.pegs) for (const c of p) counts[c] = (counts[c] || 0) + 1;
    for (let c = 0; c < colors; c++) assert.equal(counts[c], 4);
    assert.ok(b.par > 0 && b.par < 200);
    assert.equal(rules.solve(b.pegs, 4), b.par);
  }
});

test('deterministic generation: same seed, same board', () => {
  const a = rules.generateBoard(42, 4, 4, 2);
  const b = rules.generateBoard(42, 4, 4, 2);
  assert.deepEqual(a, b);
});

test('hint returns a legal action', () => {
  const st = mk([[0, 1], [1, 0], [], []]);
  const h = rules.hint(st);
  assert.ok(h);
  assert.ok(rules.canMove(st, h.from, h.to));
});

test('fuzz: malformed commands never hang or corrupt', () => {
  const st = mk([[0, 1], [1, 0], [], []]);
  const cases = [
    [-1, 0], [0, -1], [NaN, 1], [0.5, 1], [99, 99], [undefined, 0],
  ];
  for (const [f, t] of cases) {
    const r = rules.applyMove(st, f, t);
    assert.equal(r.ok, false);
  }
  // random walk terminates
  const b = rules.generateBoard(7, 3, 4, 2);
  let cur = rules.createState({ pegs: b.pegs, cap: 4, colors: 3, seed: 7 });
  const rng = rules.mulberry32(99);
  for (let i = 0; i < 500; i++) {
    const acts = rules.legalActions(cur);
    if (!acts.length || cur.status !== 'active') break;
    const a = acts[Math.floor(rng() * acts.length)];
    cur = rules.applyMove(cur, a.from, a.to).state;
    assert.ok(Number.isInteger(rules.hashState(cur)));
  }
});

test('property: replay determinism — same seed and commands, same hashes', () => {
  const b = rules.generateBoard(123, 4, 4, 2);
  const run = () => {
    let st = rules.createState({ pegs: b.pegs, cap: 4, colors: 4, seed: 123 });
    const rng = rules.mulberry32(5);
    const hashes = [rules.hashState(st)];
    for (let i = 0; i < 40; i++) {
      const acts = rules.legalActions(st);
      if (!acts.length) break;
      const a = acts[Math.floor(rng() * acts.length)];
      st = rules.applyMove(st, a.from, a.to).state;
      hashes.push(rules.hashState(st));
      if (st.status !== 'active') break;
    }
    return hashes;
  };
  assert.deepEqual(run(), run());
});

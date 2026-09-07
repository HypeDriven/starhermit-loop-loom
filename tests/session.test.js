'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import { Session, validateReplay, ACHIEVEMENTS, checkAchievements } from '../src/session.js';
import * as content from '../src/content.js';
import * as rules from '../src/rules.js';

const rec = content.getJourneyStage(0);

test('session applies validated commands and ends with a result', () => {
  const s = new Session(rec, { mode: 'journey' });
  let n = 0;
  while (s.status === 'active' && n < 500) {
    const h = s.hint();
    assert.ok(h, 'expected a hint on a live board');
    const r = s.applyCommand({ id: 'cmd-' + n, type: 'move', from: h.from, to: h.to });
    assert.ok(r.ok);
    n++;
  }
  assert.equal(s.status, 'won');
  s.finish();
  assert.ok(s.result.solved);
  assert.ok(Number.isInteger(s.result.total));
});

test('duplicate command ids are rejected idempotently', () => {
  const s = new Session(rec, { mode: 'practice' });
  const a = s.legalActions()[0];
  const r1 = s.applyCommand({ id: 'x1', type: 'move', from: a.from, to: a.to });
  assert.ok(r1.ok && !r1.duplicate);
  const moves = s.state.moves;
  const r2 = s.applyCommand({ id: 'x1', type: 'move', from: a.from, to: a.to });
  assert.ok(r2.ok && r2.duplicate);
  assert.equal(s.state.moves, moves);
});

test('undo restores the previous state and is tracked', () => {
  const s = new Session(rec, { mode: 'practice' });
  const a = s.legalActions()[0];
  const before = rules.hashState(s.state);
  s.applyCommand({ id: 'm1', type: 'move', from: a.from, to: a.to });
  const r = s.applyCommand({ id: 'u1', type: 'undo' });
  assert.ok(r.ok);
  assert.equal(rules.hashState(s.state), before);
  assert.equal(s.state.undos, 1);
});

test('replay envelope validates deterministically', () => {
  const s = new Session(rec, { mode: 'journey' });
  let n = 0;
  while (s.status === 'active' && n < 500) {
    const h = s.hint();
    s.applyCommand({ id: 'c' + n, type: 'move', from: h.from, to: h.to });
    n++;
  }
  const env = s.replayEnvelope();
  const v = validateReplay(env, rec);
  assert.equal(v.ok, true, JSON.stringify(v));
  // Tampered score is rejected.
  const bad = JSON.parse(JSON.stringify(env));
  bad.result.total += 1;
  assert.equal(validateReplay(bad, rec).ok, false);
  // Wrong seed rejected.
  assert.equal(validateReplay(env, content.getJourneyStage(1)).ok, false);
});

test('invalid attempts are counted once and survive score replay', () => {
  const s = new Session(rec, { mode: 'journey' });
  const bad = { id: 'bad-drop', type: 'move', from: 0, to: 0 };
  assert.equal(s.applyCommand(bad).ok, false);
  assert.equal(s.state.invalid, 1);
  assert.equal(s.applyCommand(bad).duplicate, true);
  assert.equal(s.state.invalid, 1);
  s.applyCommand({ id: 'empty-lift', type: 'invalid' });
  let n = 0;
  while (s.status === 'active' && n < 500) {
    const h = s.hint();
    s.applyCommand({ id: 'solve-' + n++, type: 'move', from: h.from, to: h.to });
  }
  assert.equal(s.status, 'won');
  const result = validateReplay(s.replayEnvelope(), rec);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.invalid, 2);
});

test('snapshot round-trips an active session', () => {
  const s = new Session(rec, { mode: 'journey' });
  const a = s.legalActions()[0];
  s.applyCommand({ id: 'm1', type: 'move', from: a.from, to: a.to });
  const snap = JSON.parse(JSON.stringify(s.snapshot()));
  const s2 = Session.restore(snap);
  assert.ok(s2);
  assert.equal(rules.hashState(s2.state), rules.hashState(s.state));
  // restored session continues accepting commands, ids not replayable
  const b = s2.legalActions()[0];
  assert.ok(s2.applyCommand({ id: 'm2', type: 'move', from: b.from, to: b.to }).ok);
  const dup = s2.applyCommand({ id: 'm1', type: 'move', from: a.from, to: a.to });
  assert.ok(dup.duplicate);
});

test('malformed replay envelopes are rejected, never thrown on', () => {
  const s = new Session(rec, { mode: 'journey' });
  const a = s.legalActions()[0];
  s.applyCommand({ id: 'm1', type: 'move', from: a.from, to: a.to });
  const env = s.replayEnvelope();
  for (const mutate of [
    (e) => { delete e.hashes; },
    (e) => { e.hashes = []; },
    (e) => { e.commands = 'not-an-array'; },
  ]) {
    const bad = JSON.parse(JSON.stringify(env));
    mutate(bad);
    const v = validateReplay(bad, rec);
    assert.equal(v.ok, false);
  }
});

test('clearing a journey stage unlocks exactly the next one', () => {
  const progress = { journeyUnlocked: 0, journeyDone: {}, lessonsDone: {}, dailyDays: [], achievements: {}, roundsCompleted: 0 };
  const s = new Session(rec, { mode: 'journey' });
  let n = 0;
  while (s.status === 'active' && n < 500) {
    const h = s.hint();
    s.applyCommand({ id: 'c' + n, type: 'move', from: h.from, to: h.to });
    n++;
  }
  assert.equal(s.status, 'won');
  checkAchievements(progress, s);
  assert.equal(progress.journeyUnlocked, 1, 'stage 1 cleared must unlock stage 2, not skip it');
  assert.equal(progress.journeyDone['journey-1'], true);
});

test('achievement set is declared with stable lowercase ids', () => {
  assert.equal(ACHIEVEMENTS.length, 5);
  for (const a of ACHIEVEMENTS) assert.match(a.id, /^[a-z0-9_]+$/);
});

test('golden: representative sessions produce stable results', () => {
  for (const idx of [0, 12, 30, 47]) {
    const r = content.getJourneyStage(idx);
    const s = new Session(r, { mode: 'journey' });
    let n = 0;
    while (s.status === 'active' && n < 600) {
      const h = s.hint();
      s.applyCommand({ id: 'c' + n, type: 'move', from: h.from, to: h.to });
      n++;
    }
    assert.equal(s.status, 'won', 'stage ' + (idx + 1) + ' must be solvable by hints');
    assert.ok(s.result.total > 0);
  }
});

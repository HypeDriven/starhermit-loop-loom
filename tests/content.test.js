'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import * as content from '../src/content.js';
import * as rules from '../src/rules.js';

test('content validation passes for every shipped record', { timeout: 120000 }, () => {
  const report = content.validateAll();
  const bad = report.filter((r) => !r.ok);
  assert.deepEqual(bad, [], JSON.stringify(bad, null, 2));
});

test('journey has at least 40 authored stages with ramping difficulty', () => {
  assert.ok(content.journeyCount >= 40);
  const first = content.getJourneyStage(0);
  const last = content.getJourneyStage(content.journeyCount - 1);
  assert.ok(last.colors >= first.colors);
  assert.ok(last.par >= first.par);
  // mastery stages exist and have move limits at or above par
  let mastery = 0;
  for (let i = 0; i < content.journeyCount; i++) {
    const s = content.getJourneyStage(i);
    if (s.moveLimit != null) { mastery++; assert.ok(s.moveLimit >= s.par); }
  }
  assert.ok(mastery >= 4);
});

test('five themes and five palettes', () => {
  assert.equal(content.THEMES.length, 5);
  assert.ok(Object.keys(content.PALETTES).length >= 5);
  for (const p of Object.values(content.PALETTES)) assert.ok(p.length >= 6);
});

test('daily is deterministic per UTC day and immutable', () => {
  const a = content.getDaily(20000);
  const b = content.getDaily(20000);
  assert.deepEqual(a.pegs, b.pegs);
  assert.equal(a.seed, content.dailySeed(20000));
  assert.notEqual(a.seed, content.dailySeed(20001));
});

test('lessons carry tutorial steps with legal expected moves', () => {
  for (let i = 0; i < content.LESSONS.length; i++) {
    const l = content.getLesson(i);
    const st = rules.createState({ pegs: l.pegs, cap: l.cap, colors: l.colors, seed: l.seed });
    for (const step of l.tutorial.steps) {
      assert.ok(rules.canMove(st, step.expect.from, step.expect.to),
        l.id + ' step not legal: ' + JSON.stringify(step.expect));
      const r = rules.applyMove(st, step.expect.from, step.expect.to);
      st.pegs = r.state.pegs;
    }
  }
});

test('challenges define constrained goals', () => {
  const kinds = new Set();
  for (let i = 0; i < content.CHALLENGES.length; i++) {
    const c = content.getChallenge(i, 0);
    kinds.add(c.challenge.kind);
    if (c.challenge.kind === 'move-limit') assert.ok(c.moveLimit >= c.par);
    if (c.challenge.kind === 'speed') assert.ok(c.timeTargetMs > 0);
    if (c.challenge.kind === 'no-undo') assert.ok(c.noUndo);
  }
  assert.ok(kinds.has('move-limit') && kinds.has('speed') && kinds.has('no-undo'));
});

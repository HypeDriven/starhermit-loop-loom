// The engine client's save: the old cloud document (session.js exportDoc, as the
// JS SDK's saveJSON stored it) read as a foreign save, merged with this device's
// progress and scores, and the game options carried over (node --test).
import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
const save = await import('../src/save.js');
const session = await import('../src/session.js');

function oldDoc({ unlocked, done, rounds, settings, scores }) {
  store.clear();
  const p = session.loadProgress();
  p.journeyUnlocked = unlocked;
  for (const id of done) p.journeyDone[id] = true;
  p.roundsCompleted = rounds;
  session.saveProgress(p);
  for (const s of scores) session.recordScore(s);
  if (settings) localStorage.setItem('looploom.settings.v1', JSON.stringify(settings));
  return session.exportDoc();
}

test('pickOptions keeps only valid game options', () => {
  assert.deepEqual(save.pickOptions({ palette: 'tritanopia', leftHanded: true, haptics: 'yes', difficulty: 7, music: 0.2 }),
    { palette: 'tritanopia', leftHanded: true, difficulty: 7 });
  assert.deepEqual(save.pickOptions({ palette: 'neon', difficulty: 11 }), {});
  assert.deepEqual(save.pickOptions(null), {});
});

test('readForeign reads the browser build\'s cloud document and rejects other text', () => {
  const doc = oldDoc({ unlocked: 5, done: ['journey-1'], rounds: 3, settings: { palette: 'protanopia', haptics: false, music: 0.1 }, scores: [] });
  const f = save.readForeign(JSON.stringify(doc));
  assert.equal(f.doc.v, 1);
  assert.deepEqual(f.options, { palette: 'protanopia', haptics: false });
  assert.equal(save.readForeign('not json'), null);
  assert.equal(save.readForeign(JSON.stringify({ v: 2, progress: {} })), null);
  assert.equal(save.readForeign(JSON.stringify([1, 2])), null);
});

test('saveData keeps progress and scores, never the settings', () => {
  const doc = oldDoc({ unlocked: 2, done: [], rounds: 1, settings: { palette: 'contrast' }, scores: [] });
  const d = save.saveData(doc);
  assert.deepEqual(Object.keys(d).sort(), ['progress', 'savedAt', 'scores', 'v']);
  assert.ok(save.sameData(d, doc));
});

test('a foreign save merges with this device\'s progress and scores', () => {
  const entry = (score, sessionId, at) => ({ total: score, moves: 5, invalid: 0, elapsedMs: 1000, mode: 'journey', contentId: 'journey-1', seed: 1, version: 1, sessionId, day: null });
  const remote = oldDoc({ unlocked: 9, done: ['journey-1', 'journey-2'], rounds: 12, settings: null, scores: [entry(1200, 'a')] });
  const mine = oldDoc({ unlocked: 3, done: ['journey-3'], rounds: 2, settings: null, scores: [entry(1300, 'b')] });
  const merged = session.mergeDocs(remote, mine);
  assert.ok(!save.sameData(merged, mine));
  store.clear();
  assert.ok(session.importDoc({ ...save.saveData(merged), settings: null }));
  const p = session.loadProgress();
  assert.equal(p.journeyUnlocked, 9);
  assert.deepEqual(Object.keys(p.journeyDone).sort(), ['journey-1', 'journey-2', 'journey-3']);
  assert.equal(p.roundsCompleted, 12);
  assert.deepEqual(session.getScores('global').map((s) => s.score), [1300, 1200]);
  assert.equal(localStorage.getItem('looploom.settings.v1'), null);
  // Merging again changes nothing (no save loop).
  assert.ok(save.sameData(session.mergeDocs(merged, session.exportDoc()), session.exportDoc()));
});

test('the round clock is injectable', () => {
  let t = 1000;
  session.setClock(() => t);
  const rec = { id: 'x', pegs: [[0, 1], [1, 0], [], []], cap: 4, colors: 2, seed: 1, par: 3 };
  const s = new session.Session(rec, { mode: 'practice' });
  t += 2500;
  assert.equal(s.elapsedMs(), 2500);
  session.setClock(null);
});

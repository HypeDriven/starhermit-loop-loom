// Every player-facing string exists in all nine locales (node --test).
// Keys are the US-English source strings (see tests/i18n-keys.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import { DICTS, LOCALES, T, setLocale, pickLocale } from '../src/i18n.js';
import { shStrings } from '../src/sh-strings.js';
import { ALL } from './i18n-keys.mjs';

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

test('the key set is non-trivial', () => {
  assert.ok(ALL.size > 150, `only ${ALL.size} keys found`);
});

for (const locale of LOCALES.filter((l) => l !== 'en-US' && l !== 'en-GB')) {
  test(`${locale}: every key is translated with the same placeholders`, () => {
    const dict = DICTS[locale];
    const missing = [...ALL].filter((k) => !Object.prototype.hasOwnProperty.call(dict, k));
    assert.deepEqual(missing, [], `${missing.length} missing in ${locale}`);
    const bad = [...ALL].filter((k) => placeholders(dict[k]) !== placeholders(k));
    assert.deepEqual(bad, [], `placeholder mismatch in ${locale}`);
  });
}

test('no locale carries keys that no longer exist', () => {
  for (const locale of LOCALES) {
    const stray = Object.keys(DICTS[locale]).filter((k) => !ALL.has(k));
    assert.deepEqual(stray, [], locale);
  }
});

test('StarHermit account strings exist in all nine locales', () => {
  for (const locale of LOCALES) assert.ok(shStrings([locale]).signIn && shStrings([locale]).lbRank.includes('{rank}'), locale);
});

test('the engine client\'s new strings are found and runtime language tags map to a locale', () => {
  for (const k of ['Audio & graphics', 'Keyboard bindings', 'Peg {n}: {loops}', 'Loop lifted', 'Open objective panel']) assert.ok(ALL.has(k), k);
  assert.equal(pickLocale('es-MX'), 'es-419');
  assert.equal(pickLocale('fr-ca'), 'fr-CA');
  assert.equal(pickLocale('de'), 'de-DE');
  assert.equal(pickLocale('ja-JP'), 'en-US');
});

test('rich-text keys keep their inline markup in every locale', () => {
  const tags = (s) => (String(s).match(/<[^>]+>/g) || []).join('');
  for (const locale of LOCALES.filter((l) => l !== 'en-US')) {
    for (const k of [...ALL].filter((x) => x.includes('<'))) assert.equal(tags(DICTS[locale][k] ?? k), tags(k), locale + ': ' + k.slice(0, 40));
  }
});

test('T falls back to the key and fills placeholders; regional variants inherit', () => {
  setLocale('de-DE');
  assert.equal(T('Not a real key {x}', { x: 1 }), 'Not a real key 1');
  assert.equal(T('Moves {n}', { n: 3 }), 'Züge 3');
  setLocale('fr-CA');
  assert.equal(T('Score {n}', { n: 5 }), 'Pointage 5');
  assert.equal(T('Hint'), 'Indice');
  setLocale('es-ES');
  assert.equal(T('Settings'), 'Ajustes');
  assert.equal(T('Hint'), 'Pista');
  setLocale('en-GB');
  assert.equal(T('Color palette'), 'Colour palette');
  setLocale('en-US');
  assert.equal(T('Hint'), 'Hint');
});

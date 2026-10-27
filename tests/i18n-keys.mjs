// Key extraction for the i18n coverage test (run directly to list the keys).
// Keys are the US-English source strings: literal T("…") / N("…") calls in the
// engine client (native/*.ts), the content tables' display fields and the
// audio captions (native/audio.ts CAPTIONS).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { COLOR_NAMES, LESSONS, CHALLENGES } from '../src/content.js';
import { ACHIEVEMENTS } from '../src/session.js';

const ROOT = new URL('..', import.meta.url).pathname;
const unescape = (s) => s.replace(/\\(['"\\])/g, '$1');

export function sourceKeys() {
  const keys = new Set();
  const lit = String.raw`"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'`;
  const call = new RegExp(String.raw`(?<![\w.$])(?:T|N)\(\s*(?:${lit})`, 'g');
  const ternary = /(?<![\w.$])T\([^'"\n)]*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/g;
  for (const f of readdirSync(join(ROOT, 'native'))) {
    if (!f.endsWith('.ts')) continue;
    const src = readFileSync(join(ROOT, 'native', f), 'utf8');
    for (const m of src.matchAll(call)) keys.add(unescape(m[1] ?? m[2]));
    for (const m of src.matchAll(ternary)) { keys.add(m[1]); keys.add(m[2]); }
  }
  return keys;
}

export function contentKeys() {
  const keys = new Set();
  const add = (...v) => v.forEach((s) => { if (typeof s === 'string' && s) keys.add(s); });
  add(...COLOR_NAMES, 'Daily Loom', 'Score Chase');
  for (const l of LESSONS) { add(l.title, l.text); for (const st of l.steps || []) add(st.prompt); }
  for (const c of CHALLENGES) add(c.title, c.text);
  for (const a of ACHIEVEMENTS) add(a.name);
  const audio = readFileSync(join(ROOT, 'native/audio.ts'), 'utf8');
  const caps = audio.slice(audio.indexOf('const CAPTIONS'), audio.indexOf('};', audio.indexOf('const CAPTIONS')));
  for (const m of caps.matchAll(/: "([^"]+)"/g)) add(m[1]);
  return keys;
}

export const ALL = new Set([...sourceKeys(), ...contentKeys()]);

if (process.argv[1] && process.argv[1].endsWith('i18n-keys.mjs')) console.log(JSON.stringify([...ALL], null, 1));

// Key extraction for the i18n coverage test (run directly to list the keys).
// Keys are the US-English source strings: literal T('…') / N('…') calls (and
// announce/toast literals) in src/, data-i18n* markup in index.html, the
// content tables' display fields and the audio captions.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { COLOR_NAMES, LESSONS, CHALLENGES } from '../src/content.js';
import { ACHIEVEMENTS } from '../src/session.js';

const ROOT = new URL('..', import.meta.url).pathname;
const unescape = (s) => s.replace(/\\(['"\\])/g, '$1');
const SKIP = new Set(['i18n.js', 'gfx-i18n.js', 'sh-strings.js']);

export function sourceKeys() {
  const keys = new Set();
  const call = /(?<![\w.$])(?:T|N|announce|toast)\(\s*(?:'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)")/g;
  const ternary = /(?<![\w.$])(?:T|announce)\([^'"\n]*\?\s*'([^']+)'\s*:\s*'([^']+)'/g;
  const ternary3 = /(?<![\w.$])T\([^'"\n]*\?\s*'([^']+)'\s*:\s*[^?\n]*\?\s*'([^']+)'\s*:\s*'([^']+)'/g;
  for (const f of readdirSync(join(ROOT, 'src'))) {
    if (!f.endsWith('.js') || SKIP.has(f)) continue;
    const src = readFileSync(join(ROOT, 'src', f), 'utf8');
    for (const m of src.matchAll(call)) keys.add(unescape(m[1] ?? m[2]));
    for (const m of src.matchAll(ternary)) { keys.add(m[1]); keys.add(m[2]); }
    for (const m of src.matchAll(ternary3)) { keys.add(m[1]); keys.add(m[2]); keys.add(m[3]); }
  }
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/data-i18n(?:-aria|-title)?="([^"]+)"/g)) keys.add(m[1].replace(/&amp;/g, '&'));
  return keys;
}

export function contentKeys() {
  const keys = new Set();
  const add = (...v) => v.forEach((s) => { if (typeof s === 'string' && s) keys.add(s); });
  add(...COLOR_NAMES, 'Daily Loom', 'Score Chase');
  for (const l of LESSONS) { add(l.title, l.text); for (const st of l.steps || []) add(st.prompt); }
  for (const c of CHALLENGES) add(c.title, c.text);
  for (const a of ACHIEVEMENTS) add(a.name);
  const audio = readFileSync(join(ROOT, 'src/audio.js'), 'utf8');
  const caps = audio.slice(audio.indexOf('function captionFor'), audio.indexOf('}[name]', audio.indexOf('function captionFor')));
  for (const m of caps.matchAll(/: '([^']+)'/g)) add(m[1]);
  return keys;
}

export const ALL = new Set([...sourceKeys(), ...contentKeys()]);

if (process.argv[1] && process.argv[1].endsWith('i18n-keys.mjs')) console.log(JSON.stringify([...ALL], null, 1));

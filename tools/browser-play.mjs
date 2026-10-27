// Plays the web package in Chrome on the machine's GPU (~/games/tools/
// gpu-chrome.mjs; GPU_ADAPTER=software for headless SwiftShader), the loader
// index.html that `npm run package` writes, at a desktop viewport, a phone
// (DPR 3) and a phone held sideways (DPR 3): Enter on the focused Play and
// Start round begins Journey stage 1, solved by the peg keys on the desktop
// and by tapping the peg mirror's buttons on the phones, to the results; on
// the desktop then Learn lesson 1 by a mouse drag across the 3D pegs, and the
// pause menu. Screenshots of each step go to --shots. Fails on console errors
// or warnings, the runtime's error screen, or a round that does not finish.
//   node tools/browser-play.mjs [GAME_DIR] [--shots OUT_DIR]
// Serves GAME_DIR on loopback (never tests/, tools/ or dot-names), the engine
// itself from wiki.starhermit.com as the loader pins it. playwright-core is
// resolved from GAME_DIR's node_modules or any sibling game's.
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { getJourneyStage } from '../src/content.js';
import { solution } from './solve.mjs';

const args = process.argv.slice(2);
const dir = resolve(args[0] && !args[0].startsWith('--') ? args[0] : '.');
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const shots = opt('--shots', null);

function findPlaywright() {
  const roots = [dir, resolve(dir, '..'), ...readdirSync(resolve(dir, '..')).map((d) => resolve(dir, '..', d))];
  for (const r of roots) {
    const p = join(r, 'node_modules', 'playwright-core');
    if (existsSync(p)) return createRequire(join(r, 'package.json'))('playwright-core');
  }
  throw new Error('playwright-core not found');
}
const { chromium } = findPlaywright();

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.ts': 'text/plain',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ogg': 'audio/ogg', '.opus': 'audio/ogg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg' };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^\/+/, '') || 'index.html';
  // The platform's clock (platform.serverTime / serverNow), as the game host answers it.
  if (path === 'api/v1/time') { res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ serverTime: Date.now(), serverTimeIso: new Date().toISOString() })); return; }
  const parts = path.split('/');
  if (parts.some((p) => p.startsWith('.') || p === '..') || ['tests', 'tools', 'node_modules'].includes(parts[0])) { res.writeHead(404).end(); return; }
  const file = join(dir, path);
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const { launchChrome } = await import('/home/albert/games/tools/gpu-chrome.mjs');
const { browser, gpu, close } = await launchChrome(chromium);
console.log(`# chrome on ${gpu}`);
let failed = false;

const moves = solution(getJourneyStage(0));
const n = getJourneyStage(0).pegs.length;
/** Stage 1 by the peg keys (←/→ wrap from the focused peg, Enter lifts and drops). */
function keySteps() {
  const out = [];
  let focus = 0;
  const go = (to) => {
    const r = (to - focus + n) % n, l = (focus - to + n) % n;
    for (let i = 0; i < Math.min(r, l); i++) out.push(['key', r <= l ? 'ArrowRight' : 'ArrowLeft']);
    out.push(['key', 'Enter'], ['wait', 400]);
    focus = to;
  };
  for (const m of moves) { go(m.from); go(m.to); }
  return out;
}
/** Stage 1 by tapping the peg mirror's buttons (found by their accessible names). */
const tapSteps = () => moves.flatMap((m) => [['peg', m.from], ['wait', 400], ['peg', m.to], ['wait', 600]]);
const round = (play) => [
  ['shot', 'title'], ['key', 'Enter'], ['wait', 1500], ['shot', 'setup'], ['key', 'Enter'], ['wait', 2500], ['shot', 'play'],
  ...play, ['wait', 2500], ['shot', 'results'], ['expect', 'Loom complete!'],
];
const desktopExtra = [
  ['role', 'Title'], ['wait', 1200], ['role', 'Modes & progress'], ['wait', 1000], ['role', 'Learn — interactive lessons'], ['wait', 1000],
  ['role', 'Start round'], ['wait', 2500], ['shot', 'lesson'],
  // Lesson 1's four pegs sit at about 32.6 %, 44 %, 56 % and 67 % of the width: drag the top loop from peg 1 to peg 4.
  ['drag', { x: 0.326, y: 0.42 }, { x: 0.67, y: 0.42 }], ['wait', 2500], ['shot', 'dragged'], ['expect', 'Loom complete!'],
  ['role', 'Retry'], ['wait', 2500], ['key', 'KeyP'], ['wait', 800], ['shot', 'paused'],
];
const views = [
  { name: 'desktop', viewport: { width: 1366, height: 768 }, steps: [...round(keySteps()), ...desktopExtra] },
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, steps: round(tapSteps()) },
  { name: 'landscape', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, steps: round(tapSteps()) },
];
for (const v of views) {
  const ctx = await browser.newContext({ viewport: v.viewport, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: v.deviceScaleFactor });
  const page = await ctx.newPage();
  const problems = [];
  const environment = /^No available adapters\.$|GL Driver Message/;
  page.on('console', (m) => {
    const platformRoute = /\/api\//.test(m.location()?.url ?? '');
    if ((m.type() === 'error' || m.type() === 'warning') && !environment.test(m.text()) && !platformRoute) problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => { if (r.status() >= 400 && !/\/api\//.test(r.url())) problems.push(`http ${r.status()}: ${r.url()}`); });
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  const started = await page.waitForFunction(() => ['running', 'error'].includes(document.documentElement.dataset.starhermit), null, { timeout: 90000 }).then(() => true, () => false);
  // The first key press can be lost while the runtime starts up.
  await page.waitForTimeout(4000);
  const W = v.viewport.width, H = v.viewport.height;
  for (const [op, a, b] of v.steps) {
    try {
      if (op === 'key') { await page.keyboard.down(a); await page.waitForTimeout(100); await page.keyboard.up(a); await page.waitForTimeout(100); }
      if (op === 'wait') await page.waitForTimeout(a);
      if (op === 'role') await page.getByRole('button', { name: a, exact: true }).click({ timeout: 10000 });
      if (op === 'peg') {
        const btn = page.getByRole('button', { name: new RegExp(`^Peg ${a + 1}:`) }).first();
        if (v.hasTouch) await btn.tap({ timeout: 10000 }); else await btn.click({ timeout: 10000 });
      }
      if (op === 'drag') {
        await page.mouse.move(W * a.x, H * a.y); await page.mouse.down(); await page.waitForTimeout(100);
        for (let i = 1; i <= 10; i++) { await page.mouse.move(W * (a.x + (b.x - a.x) * i / 10), H * (a.y + (b.y - a.y) * i / 10)); await page.waitForTimeout(30); }
        await page.mouse.up();
      }
      if (op === 'expect' && !(await page.getByText(a).count().catch(() => 0)) && !(await page.getByRole('heading', { name: a }).count().catch(() => 0))) problems.push(`expected "${a}" on screen`);
      if (op === 'shot' && shots) { mkdirSync(shots, { recursive: true }); await page.screenshot({ path: join(shots, `${v.name}-${a}.png`) }); }
    } catch (e) { problems.push(`${op} ${typeof a === 'string' ? a : JSON.stringify(a)}: ${e.message.split('\n')[0]}`); }
  }
  const state = await page.evaluate(() => document.documentElement.dataset.starhermit ?? '');
  const ok = started && state === 'running' && problems.length === 0;
  failed ||= !ok;
  console.log(`${ok ? 'ok' : 'not ok'} - ${v.name} played: started=${started} state=${state || '-'}`);
  for (const p of problems) console.log(`  ${p}`);
  await ctx.close();
}
await close();
server.close();
process.exit(failed ? 1 : 0);

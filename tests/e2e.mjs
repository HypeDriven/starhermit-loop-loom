/**
 * Loop Loom — verified end-to-end QA playthrough (dev only, not shipped).
 *
 * Drives the real visible UI in headless Chrome (playwright-core + system
 * Chrome): title → modes → journey stage 1 setup → play. The puzzle is
 * solved by clicking the on-screen peg buttons of the accessible board
 * mirror (#a11y-board .peg-btn — real visible buttons); the board state is
 * read back from their aria-labels and a small BFS solver (mirroring
 * src/rules.js legality) picks each move. Also exercises pause/resume and
 * settings open/close, then verifies the results screen ("Loom complete!")
 * and the return to title. Three passes: desktop 1280x800, mobile 390x844
 * (touch), and a no-WebGL pass that asserts the compatibility notice and the
 * 2D accessible fallback. Any non-benign console error or pageerror fails.
 *
 * The repo's server.js is the StarHermit authoritative game script, so this
 * test embeds its own minimal static server on an ephemeral port. The game
 * is fully playable offline; its platform calls to /api/* are expected to
 * 404 against the static server and those resource errors are ignored.
 *
 * Run: npm run test:e2e
 */
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAP = 4; // journey stages always use CAP_DEFAULT (src/content.js stageConfig)

const browserNoise = /GL Driver Message|GPU stall due to ReadPixels|Automatic fallback to software WebGL|EnableWebGLDeveloperExtensions/i;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2',
  '.ts': 'video/mp2t',
  '.txt': 'text/plain; charset=utf-8',
};

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) { // offline: platform degrades gracefully
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'offline' }));
      return;
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    if (rel.includes('..')) { res.writeHead(403); res.end(); return; }
    const file = path.join(ROOT, rel);
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------------------------------------------------------------------------
// Solver: BFS over peg boards, mirroring src/rules.js move legality.
// ---------------------------------------------------------------------------
function topGroup(peg) {
  const color = peg[peg.length - 1];
  let size = 1;
  for (let i = peg.length - 2; i >= 0 && peg[i] === color; i--) size++;
  return { color, size };
}
function isSolved(pegs) { return pegs.every((p) => p.every((c) => c === p[0])); }
function boardKey(pegs) { return pegs.map((p) => p.join(',')).join('|'); }
function applyMove(pegs, from, to) {
  const g = topGroup(pegs[from]);
  const n = Math.min(g.size, CAP - pegs[to].length);
  const np = pegs.map((p) => p.slice());
  const grp = np[from].splice(np[from].length - n, n);
  np[to].push(...grp);
  return np;
}
function solveBfs(pegs) {
  const start = pegs.map((p) => p.slice());
  if (isSolved(start)) return [];
  const seen = new Set([boardKey(start)]);
  let frontier = [{ pegs: start, path: [] }];
  while (frontier.length) {
    const next = [];
    for (const { pegs: cur, path: pth } of frontier) {
      for (let i = 0; i < cur.length; i++) {
        if (!cur[i].length) continue;
        const g = topGroup(cur[i]);
        for (let j = 0; j < cur.length; j++) {
          if (i === j || cur[j].length >= CAP) continue;
          if (cur[j].length && cur[j][cur[j].length - 1] !== g.color) continue;
          const np = applyMove(cur, i, j);
          const k = boardKey(np);
          if (seen.has(k)) continue;
          const npath = [...pth, { from: i, to: j }];
          if (isSolved(np)) return npath;
          seen.add(k);
          next.push({ pegs: np, path: npath });
        }
      }
    }
    if (seen.size > 300000) throw new Error('solver budget exceeded');
    frontier = next;
  }
  throw new Error('no solution found for board');
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
async function readBoard(page) {
  const labels = await page.locator('#a11y-board .peg-btn').evaluateAll(
    (els) => els.map((el) => el.getAttribute('aria-label')));
  return labels.map((l) => {
    const m = l.match(/^Peg \d+: (.*?)( \(lifted\))?$/);
    if (!m) throw new Error('unparseable peg label: ' + l);
    return m[1] === 'empty' ? [] : m[1].split(', ');
  });
}

const SHOT = (stage, tag) => `/tmp/loop-loom-e2e-${stage}-${tag}.png`;

async function runPass(tag, contextOpts) {
  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (browserNoise.test(m.text())) return;
    // Expected offline behavior: platform calls to /api/* 404 against the
    // embedded static server; Chrome logs these as resource errors.
    if (m.text().includes('Failed to load resource') && (m.location()?.url || '').includes('/api/')) return;
    errors.push(`console: ${m.text()} @ ${m.location()?.url || ''}`);
  });

  const step = async (name, fn) => {
    await fn();
    if (errors.length) throw new Error(`[${tag}] errors during "${name}":\n` + errors.join('\n'));
    console.log(`ok - [${tag}] ${name}`);
  };
  const overlay = (name) => page.locator(`[data-screen="${name}"]:not(.hidden)`);
  // 'play' is not an overlay element; it is HUD + tray + accessible board.
  const playVisible = () => page.locator('#hud:not(.hidden)').waitFor();

  try {
    await step('load + title visible', async () => {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
      await overlay('title').waitFor({ timeout: 15000 });
      await page.locator('#btn-play').waitFor({ state: 'visible' });
      await page.screenshot({ path: SHOT('title', tag) });
    });

    await step('modes screen opens and closes', async () => {
      await page.click('#btn-modes');
      await overlay('modes').waitFor();
      await page.screenshot({ path: SHOT('modes', tag) });
      await page.click('#mode-back');
      await overlay('title').waitFor();
      // Escape backs out of the same overlay.
      await page.click('#btn-modes');
      await overlay('modes').waitFor();
      await page.keyboard.press('Escape');
      await overlay('title').waitFor();
    });

    await step('play → journey stage 1 setup', async () => {
      await page.click('#btn-play');
      await overlay('setup').waitFor();
      const rules = await page.locator('#setup-rules').innerText();
      if (!rules.trim()) throw new Error('setup screen has no rules text');
      await page.screenshot({ path: SHOT('setup', tag) });
    });

    let moves;
    let board;
    await step('start round, board appears', async () => {
      await page.click('#btn-start-round');
      await playVisible();
      await page.locator('#a11y-board .peg-btn').first().waitFor({ state: 'visible' });
      board = await readBoard(page);
      if (board.length < 4) throw new Error('expected at least 4 pegs, got ' + board.length);
      if (isSolved(board)) throw new Error('board dealt already solved');
      moves = solveBfs(board);
      console.log(`  [${tag}] stage board: ${JSON.stringify(board)} — ${moves.length} moves to solve`);
      await page.screenshot({ path: SHOT('play', tag) });
    });

    // One deliberate illegal drop; the results screen must charge it exactly
    // once (-15), not twice. Board state is unchanged by a rejected move.
    let invalidAttempts = 0;
    await step('an illegal drop is rejected with an explanation', async () => {
      // Find a mismatched pair: both pegs non-empty with different top colors.
      let from = -1, to = -1;
      for (let i = 0; i < board.length && to < 0; i++) {
        if (!board[i].length) continue;
        for (let j = 0; j < board.length; j++) {
          if (i === j || !board[j].length) continue;
          if (board[j][board[j].length - 1] !== topGroup(board[i]).color) { from = i; to = j; break; }
        }
      }
      if (to < 0) { console.log(`  [${tag}] no mismatched pair on this board — skipped`); return; }
      const pegs = page.locator('#a11y-board .peg-btn');
      await pegs.nth(from).click();
      await pegs.nth(to).click();
      await page.locator('#toast:not(.hidden)').waitFor({ timeout: 3000 });
      invalidAttempts++;
      const after = await readBoard(page);
      if (JSON.stringify(after) !== JSON.stringify(board)) throw new Error('rejected move changed the board');
      await pegs.nth(from).click(); // cancel the still-lifted group
      await page.waitForFunction(
        () => ![...document.querySelectorAll('#a11y-board .peg-btn')].some((el) => el.classList.contains('selected')),
        undefined, { timeout: 3000 });
    });

    await step('pause → settings → resume', async () => {
      await page.click('#btn-pause');
      await overlay('pause').waitFor();
      await page.screenshot({ path: SHOT('pause', tag) });
      await page.click('#btn-open-settings');
      await overlay('settings').waitFor();
      await page.screenshot({ path: SHOT('settings', tag) });
      await page.click('#btn-settings-close');
      await overlay('pause').waitFor();
      await page.click('#btn-resume');
      await playVisible();
    });

    await step('solve the loom via peg buttons', async () => {
      let predicted = board;
      for (let k = 0; k < moves.length; k++) {
        const { from, to } = moves[k];
        const pegs = page.locator('#a11y-board .peg-btn');
        await pegs.nth(from).click();
        // the lifted peg shows as selected in the visible mirror
        await page.waitForFunction(
          (i) => document.querySelectorAll('#a11y-board .peg-btn')[i]?.classList.contains('selected'),
          from, { timeout: 3000 });
        await pegs.nth(to).click();
        predicted = applyMove(predicted, from, to);
        const expected = JSON.stringify(predicted);
        await page.waitForFunction((exp) => {
          const els = document.querySelectorAll('#a11y-board .peg-btn');
          const cur = [...els].map((el) => {
            const m = el.getAttribute('aria-label').match(/^Peg \d+: (.*?)( \(lifted\))?$/);
            return m[1] === 'empty' ? [] : m[1].split(', ');
          });
          return JSON.stringify(cur) === exp;
        }, expected, { timeout: 3000 });
        if (k === Math.floor(moves.length / 2)) await page.screenshot({ path: SHOT('midgame', tag) });
      }
    });

    await step('results screen: loom complete', async () => {
      await overlay('results').waitFor({ timeout: 10000 });
      const headline = await page.locator('#result-headline').innerText();
      if (!/loom complete/i.test(headline)) throw new Error('unexpected headline: ' + headline);
      const score = await page.locator('#result-score').innerText();
      if (!/Total/.test(score)) throw new Error('results missing score breakdown');
      const penalty = score.match(/Invalid attempts\s*(-?\d+)/);
      if (!penalty) throw new Error('results missing invalid-attempt line: ' + score);
      const expected = -15 * invalidAttempts;
      if (parseInt(penalty[1], 10) !== expected) {
        throw new Error(`${invalidAttempts} rejected move(s) should cost ${expected}, got ${penalty[1]}`);
      }
      await page.screenshot({ path: SHOT('results', tag) });
    });

    await step('back to title', async () => {
      await page.click('#btn-results-title');
      await overlay('title').waitFor();
      await page.screenshot({ path: SHOT('title-after', tag) });
    });
  } finally {
    if (errors.length) {
      await context.close();
      throw new Error(`[${tag}] non-benign page errors:\n` + errors.join('\n'));
    }
    await context.close();
  }
}

// No-WebGL fallback: the compat notice must survive boot and the accessible
// board must stay playable without a 3D context.
async function runCompatPass() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.addInitScript(() => {
    const real = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (String(type).startsWith('webgl') || type === 'experimental-webgl') return null;
      return real.call(this, type, ...rest);
    };
  });
  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.locator('[data-screen="compat"]:not(.hidden)').waitFor({ timeout: 15000 });
    await page.screenshot({ path: SHOT('compat', 'nowebgl') });
    await page.click('#btn-compat-close');
    await page.locator('[data-screen="title"]:not(.hidden)').waitFor();
    await page.click('#btn-play');
    await page.locator('[data-screen="setup"]:not(.hidden)').waitFor();
    await page.click('#btn-start-round');
    await page.locator('#hud:not(.hidden)').waitFor();
    const board = await readBoard(page);
    const moves = solveBfs(board);
    const pegs = page.locator('#a11y-board .peg-btn');
    let predicted = board;
    for (const { from, to } of moves) {
      await pegs.nth(from).click();
      await pegs.nth(to).click();
      predicted = applyMove(predicted, from, to);
      const expected = JSON.stringify(predicted);
      await page.waitForFunction((exp) => {
        const cur = [...document.querySelectorAll('#a11y-board .peg-btn')].map((el) => {
          const m = el.getAttribute('aria-label').match(/^Peg \d+: (.*?)( \(lifted\))?$/);
          return m[1] === 'empty' ? [] : m[1].split(', ');
        });
        return JSON.stringify(cur) === exp;
      }, expected, { timeout: 3000 });
    }
    await page.locator('[data-screen="results"]:not(.hidden)').waitFor({ timeout: 10000 });
    if (errors.length) throw new Error('[nowebgl] page errors:\n' + errors.join('\n'));
    console.log('ok - [nowebgl] compat notice shown and the loom is solvable without WebGL');
  } finally {
    await context.close();
  }
}

// ---------------------------------------------------------------------------
const server = await startServer();
const port = server.address().port;
let browser;
try {
  browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
  });
  await runPass('desktop', { viewport: { width: 1280, height: 800 } });
  await runPass('mobile', { viewport: { width: 390, height: 844 }, hasTouch: true });
  await runCompatPass();
  console.log('\nE2E PASS — loop-loom playable end-to-end on desktop, mobile and the no-WebGL fallback, no page errors');
} finally {
  if (browser) await browser.close();
  server.close();
}

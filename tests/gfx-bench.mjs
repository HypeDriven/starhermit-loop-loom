// Graphics benchmark hook for tools/gfx-bench.mjs (dev-only): picks a preset in Settings → Graphics,
// starts Journey stage 1 and keeps moving loop groups through the visible peg buttons (lift, drop on
// an empty or matching peg, or cancel), so loops tween, drop sparks fly and the atelier animates.
// A finished loom goes back to the title and a new round starts.
export const presets = ['low', 'balanced', 'high', 'ultra'];
export const levels = { low: 0, balanced: 4, high: 10, ultra: 17 };

const overlay = (page, name) => page.locator(`[data-screen="${name}"]:not(.hidden)`);

export async function setPreset(page, preset) {
  await overlay(page, 'title').waitFor({ timeout: 20000 });
  await page.click('#btn-title-settings');
  await overlay(page, 'settings').waitFor();
  await page.locator('#gfx-section').scrollIntoViewIfNeeded();
  await page.selectOption('#set-quality', preset);
  await page.waitForFunction((p) => document.body.dataset.gfxPreset === p, preset);
  await page.click('#btn-settings-close');
  await overlay(page, 'title').waitFor();
}

async function launch(page) {
  await page.click('#btn-play');
  await overlay(page, 'setup').waitFor();
  await page.click('#btn-start-round');
  await page.locator('#a11y-board .peg-btn').first().waitFor({ state: 'visible' });
}

async function board(page) {
  const labels = await page.locator('#a11y-board .peg-btn').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));
  return labels.map((l) => { const m = /^Peg \d+: (.*?)( \(lifted\))?$/.exec(l) || []; return !m[1] || m[1] === 'empty' ? [] : m[1].split(', '); });
}

export async function start(page) {
  await launch(page);
  let stopped = false, n = 0;
  page.once('close', () => { stopped = true; });
  (async () => {
    while (!stopped) {
      try {
        if (await overlay(page, 'results').count()) {
          await page.click('#btn-results-title', { timeout: 5000 });
          await overlay(page, 'title').waitFor({ timeout: 5000 });
          await launch(page);
        } else {
          const b = await board(page);
          const pegs = page.locator('#a11y-board .peg-btn');
          const from = b.findIndex((p, i) => p.length && i >= n % b.length) >= 0 ? b.findIndex((p, i) => p.length && i >= n % b.length) : b.findIndex((p) => p.length);
          const to = b.findIndex((p, j) => j !== from && (!p.length || p[p.length - 1] === b[from][b[from].length - 1]));
          await pegs.nth(from).click({ timeout: 5000 });
          await page.waitForTimeout(350);
          await pegs.nth(to >= 0 ? to : from).click({ timeout: 5000 });
          if (to >= 0 && await pegs.nth(from).evaluate((el) => el.classList.contains('selected'))) await pegs.nth(from).click({ timeout: 5000 });
        }
      } catch (e) { if (process.env.BENCH_DEBUG) console.log('hook:', e.message.split('\n')[0]); }
      n++;
      await new Promise((r) => setTimeout(r, 450));
    }
  })();
  await page.waitForTimeout(1000);
}

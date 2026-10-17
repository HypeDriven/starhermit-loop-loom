import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectPreset, detectLevel, presetForLevel, LEVELS, BUDGETS, budget, resolve, presetTier, choosePreset, describe, CATEGORIES, PRESETS } from '../src/gfx.js';

// gpu-level.js is a classic script in the page; imported here it sets globalThis.StarHermitGpu.
await import('../gpu-level.js');
import { GFX_STRINGS, pickLocale } from '../src/gfx-i18n.js';

test('hardware level picks the Auto preset (StarHermit gpu-level.js)', () => {
  assert.equal(detectPreset('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)'), 'low');
  assert.equal(detectPreset('llvmpipe (LLVM 15.0.7, 256 bits)'), 'low');
  assert.equal(detectPreset('ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)'), 'low');
  assert.equal(detectPreset('ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)'), 'low');
  assert.equal(detectPreset('ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11)'), 'balanced');
  assert.equal(detectPreset('ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)'), 'high');
  assert.equal(detectPreset('ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0)'), 'ultra');
  assert.equal(detectPreset('ANGLE (NVIDIA, NVIDIA GeForce RTX 5090 Direct3D11 vs_5_0 ps_5_0)'), 'ultra');
  assert.equal(detectLevel('NVIDIA GeForce RTX 5090'), 20);
  assert.equal(detectLevel('SwiftShader'), 0);
  for (const [p, lv] of Object.entries(LEVELS)) assert.equal(presetForLevel(lv), p);
  assert.equal(presetForLevel(9), 'balanced');
  assert.equal(presetForLevel(16), 'high');
  // Phones and tablets cap Auto at Balanced.
  assert.ok(['low', 'balanced'].includes(detectPreset('Adreno (TM) 740', { mobile: true })), 'mobile Adreno 740 is Balanced at most');
  assert.equal(detectPreset('NVIDIA GeForce RTX 5090', { mobile: true }), 'balanced');
  assert.equal(detectPreset('SwiftShader', { mobile: true }), 'low');
});

test('per-preset budgets are explicit, grow from Low to Ultra and scale with the level', () => {
  const keys = ['material', 'merge', 'yarn', 'segments', 'dust', 'sparks', 'bloomRes', 'aoRes'];
  for (const p of PRESETS) for (const k of keys) assert.ok(k in BUDGETS[p], `${p}.${k}`);
  for (let i = 1; i < PRESETS.length; i++) {
    const a = BUDGETS[PRESETS[i - 1]], b = BUDGETS[PRESETS[i]];
    for (const k of keys.slice(2)) assert.ok(b[k] >= a[k], `${PRESETS[i]}.${k}`);
  }
  assert.deepEqual(PRESETS.map((p) => BUDGETS[p].material), ['lambert', 'standard', 'physical', 'physical']);
  assert.deepEqual(PRESETS.map((p) => BUDGETS[p].merge), [true, false, false, false]);
  assert.deepEqual(budget('high', 10), BUDGETS.high, 'floor level = table');
  assert.ok(budget('high', 14).sparks > BUDGETS.high.sparks, 'sparks grow above the floor');
  assert.ok(budget('ultra', 20).sparks <= BUDGETS.ultra.sparks * 2, 'at most 2x');
  assert.ok(budget('ultra', 2).sparks < BUDGETS.ultra.sparks, 'fewer below the floor');
  assert.deepEqual(resolve({ preset: 'low' }, 'low', 0).budget, BUDGETS.low);
  assert.equal(resolve({}, 'ultra', 20).level, 20);
});

test('resolve: auto follows detection, explicit preset wins, overrides apply', () => {
  const a = resolve({}, 'high');
  assert.equal(a.preset, 'high');
  assert.equal(a.auto, true);
  assert.equal(a.shadows, presetTier('high', 'shadows'));
  const b = resolve({ preset: 'low' }, 'high');
  assert.equal(b.preset, 'low');
  assert.equal(b.auto, false);
  assert.equal(b.shadows, 'off');
  assert.equal(b.post, false, 'Low renders without a post chain');
  const c = resolve({ preset: 'low', bloom: 'on', detail: 'bogus' }, 'high');
  assert.equal(c.bloom, 'on');
  assert.equal(c.detail, presetTier('low', 'detail'), 'unknown tiers fall back to the preset');
  assert.equal(c.post, true);
  for (const p of PRESETS) {
    const r = resolve({ preset: p });
    for (const [cat, tiers] of Object.entries(CATEGORIES)) assert.ok(tiers.includes(r[cat]), `${p}.${cat}`);
  }
});

test('resolve: render scale clamps to 50–200% and multiplies the preset scale', () => {
  assert.equal(resolve({ preset: 'high', render_scale: 5 }).renderScale, 2);
  assert.equal(resolve({ preset: 'high', render_scale: 0.1 }).renderScale, 0.5);
  assert.equal(resolve({ preset: 'ultra', render_scale: 1 }).scale, 1.25);
  assert.equal(resolve({ preset: 'high' }).adaptive, true);
  assert.equal(resolve({ preset: 'high', adaptive: false }).adaptive, false);
  assert.equal(resolve({ preset: 'high' }).showFps, false);
});

test('choosing a preset clears category overrides but keeps scale/adaptive/fps', () => {
  const saved = { preset: 'low', bloom: 'on', shadows: 'high', render_scale: 1.5, adaptive: false, show_fps: true };
  const next = choosePreset(saved, 'high');
  assert.deepEqual(next, { preset: 'high', render_scale: 1.5, adaptive: false, show_fps: true });
  assert.equal(choosePreset(saved, 'auto').preset, 'auto');
});

test('describe summarises cost and pixels', () => {
  const s = describe(resolve({ preset: 'ultra' }), [2560, 1600]);
  assert.match(s, /4096² shadows/);
  assert.match(s, /2560×1600 px/);
  assert.match(describe(resolve({ preset: 'low' })), /no shadows/);
});

test('graphics strings exist in every required locale', () => {
  const locales = ['en-US', 'en-GB', 'es-419', 'es-ES', 'de-DE', 'fr-FR', 'fr-CA', 'pt-BR', 'it-IT'];
  const ref = GFX_STRINGS['en-US'];
  for (const l of locales) {
    const t = GFX_STRINGS[l];
    assert.ok(t, l);
    for (const k of Object.keys(ref)) {
      assert.ok(t[k], `${l}.${k}`);
      if (typeof ref[k] === 'object') for (const kk of Object.keys(ref[k])) assert.ok(t[k][kk], `${l}.${k}.${kk}`);
    }
    for (const cat of Object.keys(CATEGORIES)) assert.ok(t.cat[cat], `${l} cat ${cat}`);
  }
  assert.equal(pickLocale('es-MX'), 'es-419');
  assert.equal(pickLocale('fr-CA'), 'fr-CA');
  assert.equal(pickLocale('en-AU'), 'en-GB');
  assert.equal(pickLocale('ja-JP'), 'en-US');
});

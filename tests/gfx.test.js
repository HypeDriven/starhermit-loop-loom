import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectPreset, resolve, presetTier, choosePreset, describe, CATEGORIES, PRESETS } from '../src/gfx.js';
import { GFX_STRINGS, pickLocale } from '../src/gfx-i18n.js';

test('detectPreset: software → low, discrete/Apple M → high, integrated → balanced', () => {
  assert.equal(detectPreset('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)'), 'low');
  assert.equal(detectPreset('llvmpipe (LLVM 15.0.7, 256 bits)'), 'low');
  assert.equal(detectPreset('ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0)'), 'high');
  assert.equal(detectPreset('Apple M2 Pro'), 'high');
  assert.equal(detectPreset('ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)'), 'balanced');
  assert.equal(detectPreset('Mali-G78'), 'balanced');
  assert.equal(detectPreset(''), 'balanced');
  // Touch devices cap Auto at balanced.
  assert.equal(detectPreset('Apple M1', { mobile: true }), 'balanced');
  assert.equal(detectPreset('SwiftShader', { mobile: true }), 'low');
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

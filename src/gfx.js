'use strict';

// Loop Loom — graphics quality model: presets, per-category overrides,
// hardware-level detection, per-preset budgets and a cost summary. Pure (no three.js), so the settings panel,
// the renderer and the unit tests agree on what a setting means.

export const PRESETS = ['low', 'balanced', 'high', 'ultra'];

// Category → allowed tiers, cheapest first.
export const CATEGORIES = {
  shadows: ['off', 'low', 'medium', 'high'],
  ao: ['off', 'on', 'high'],
  bloom: ['off', 'on'],
  grade: ['off', 'on'],
  antialias: ['off', 'fxaa', 'smaa', 'msaa'],
  reflections: ['off', 'on'],
  particles: ['low', 'high'],
  background: ['static', 'animated'],
  detail: ['plain', 'detailed'],
};

// Each preset: a tier per category, a render scale (multiplies the capped
// device pixel ratio) and the pixel-ratio cap itself.
const TABLE = {
  low: { scale: 1, cap: 1, shadows: 'off', ao: 'off', bloom: 'off', grade: 'off', antialias: 'msaa', reflections: 'off', particles: 'low', background: 'static', detail: 'plain' },
  balanced: { scale: 1, cap: 1.5, shadows: 'low', ao: 'off', bloom: 'on', grade: 'on', antialias: 'fxaa', reflections: 'on', particles: 'high', background: 'animated', detail: 'detailed' },
  high: { scale: 1, cap: 2, shadows: 'medium', ao: 'on', bloom: 'on', grade: 'on', antialias: 'smaa', reflections: 'on', particles: 'high', background: 'animated', detail: 'detailed' },
  ultra: { scale: 1.25, cap: 2, shadows: 'high', ao: 'high', bloom: 'on', grade: 'on', antialias: 'msaa', reflections: 'on', particles: 'high', background: 'animated', detail: 'detailed' },
};

export const SHADOW_MAP = { off: 0, low: 1024, medium: 2048, high: 4096 };
export const PARTICLE_BUDGET = { low: 150, high: 900 };

// StarHermit hardware level (0–20, gpu-level.js → window.StarHermitGpu) at which Auto starts choosing
// each preset. 0 = Galaxy S20 / Intel UHD or weaker, 20 = RTX 5090; phones, tablets and ≤ 4 GB machines
// are capped at level 9 (Balanced); software renderers are level 0 (Low).
export const LEVELS = { low: 0, balanced: 4, high: 10, ultra: 17 };

/*
 * Per-preset asset and effect budgets, each tuned to hold 60 FPS on the weakest GPU Auto gives the preset
 * (Low: level 0 phones / Intel UHD; Balanced: level 4 Iris Xe; High: level 10 GTX 1070; Ultra: level 17
 * RTX 4080; measured with tests/gfx-bench.mjs). Gameplay is identical on every preset.
 *   material  loops, pegs, spools and table: 'lambert' (Low) | 'standard' (Balanced) | 'physical'
 *             (sheen yarn and clearcoated brass with Scene detail on; High/Ultra)
 *   merge     each loop and its shape-coded stitch drawn as one vertex-coloured mesh (one draw call)
 *   yarn      spun-yarn twist texture width in px (height ¼; Scene detail on)
 *   segments  geometry LOD: multiplies loop torus, peg, knob, base, collar, spool and strand segments
 *   dust      ambient dust motes (Ambient motion on)
 *   sparks    multiplies drop / completion / win spark counts and the particle cap, then scaled by
 *             the hardware level within the preset (≤ 2×)
 *   bloomRes / aoRes  bloom and GTAO resolution as a fraction of the frame
 */
export const BUDGETS = {
  low: { material: 'lambert', merge: true, yarn: 64, segments: 0.5, dust: 35, sparks: 0.5, bloomRes: 0.5, aoRes: 0.5 },
  balanced: { material: 'standard', merge: false, yarn: 128, segments: 0.75, dust: 50, sparks: 0.75, bloomRes: 0.5, aoRes: 0.5 },
  high: { material: 'physical', merge: false, yarn: 128, segments: 1, dust: 70, sparks: 1, bloomRes: 0.5, aoRes: 0.5 },
  ultra: { material: 'physical', merge: false, yarn: 256, segments: 1.5, dust: 120, sparks: 1.5, bloomRes: 1, aoRes: 1 },
};

const gpuApi = () => globalThis.StarHermitGpu;

/** Hardware level 0–20 for an unmasked renderer string plus StarHermitGpu.detectSystem() facts. */
export function detectLevel(gpu, system = {}) {
  const G = gpuApi();
  if (!G) return LEVELS.balanced;
  return G.detectLevel({ webgl: true, webgl2: true, ...system, gpu: String(gpu || '') });
}

/** Auto preset for a hardware level: Low 0, Balanced 4, High 10, Ultra 17. */
export function presetForLevel(level) {
  const G = gpuApi();
  if (G) return G.presetForLevel(level, LEVELS);
  return PRESETS.filter((p) => LEVELS[p] <= level).pop() || 'low';
}

/** Best preset for this GPU; phones and tablets are capped at Balanced by the hardware level. */
export function detectPreset(gpu, system = {}) {
  return presetForLevel(detectLevel(gpu, system || {}));
}

/** A preset's concrete budget for a hardware level (sparks scale within the preset, ≤ 2×). */
export function budget(preset, level) {
  const b = { ...(BUDGETS[preset] || BUDGETS.balanced) };
  const G = gpuApi(), floor = LEVELS[preset] ?? 0;
  const k = G ? Math.min(2, G.scaleBudget(1, Number.isFinite(level) ? level : floor, floor)) : 1;
  b.sparks = Math.round(b.sparks * k * 100) / 100;
  return b;
}

/**
 * Resolve saved settings into concrete tiers.
 * `saved`: { preset: 'auto'|preset, render_scale, adaptive, show_fps, <category>: 'preset'|tier }.
 */
export function resolve(saved, detected, level) {
  const s = saved || {};
  const auto = !PRESETS.includes(s.preset);
  const preset = auto ? (PRESETS.includes(detected) ? detected : 'balanced') : s.preset;
  const row = TABLE[preset];
  const out = {
    preset, auto,
    renderScale: clamp(Number(s.render_scale) || 1, 0.5, 2),
    cap: row.cap,
  };
  out.scale = row.scale * out.renderScale;
  for (const [cat, tiers] of Object.entries(CATEGORIES)) {
    out[cat] = tiers.includes(s[cat]) ? s[cat] : row[cat];
  }
  out.level = Number.isFinite(level) ? level : LEVELS[preset];
  out.budget = budget(preset, out.level);
  out.adaptive = s.adaptive !== false;
  out.showFps = !!s.show_fps;
  // Post-processing runs only when something needs it; otherwise the canvas MSAA is used.
  out.post = out.ao !== 'off' || out.bloom === 'on' || out.grade === 'on' || out.antialias === 'fxaa' || out.antialias === 'smaa';
  return out;
}

/** Choosing a preset clears every override (scale, adaptive and fps readout are kept). */
export function choosePreset(saved, preset) {
  const s = saved || {};
  const out = { preset: PRESETS.includes(preset) ? preset : 'auto' };
  if (s.render_scale != null) out.render_scale = s.render_scale;
  if (s.adaptive != null) out.adaptive = s.adaptive;
  if (s.show_fps != null) out.show_fps = s.show_fps;
  return out;
}

/** The preset's own tier for a category (for "From preset (…)" labels). */
export function presetTier(preset, cat) {
  return TABLE[preset]?.[cat];
}

const EN = {
  noShadows: 'no shadows', shadows: '{n}² shadows', ao: 'ambient occlusion', aoHigh: 'full ambient occlusion',
  bloom: 'bloom', reflections: 'reflections', noAa: 'no anti-aliasing', px: '{w}×{h} px',
};

/** Cost summary; `t` optionally supplies localized fragments (same keys as EN). */
export function describe(r, pixels, t) {
  const L = Object.assign({}, EN, t || {});
  const parts = [
    r.shadows === 'off' ? L.noShadows : L.shadows.replace('{n}', SHADOW_MAP[r.shadows]),
    r.ao === 'off' ? null : r.ao === 'high' ? L.aoHigh : L.ao,
    r.bloom === 'on' ? L.bloom : null,
    r.reflections === 'on' ? L.reflections : null,
    r.antialias === 'off' ? L.noAa : r.antialias.toUpperCase(),
    pixels ? L.px.replace('{w}', pixels[0]).replace('{h}', pixels[1]) : null,
  ];
  return parts.filter(Boolean).join(' · ');
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

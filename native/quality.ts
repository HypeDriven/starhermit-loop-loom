// The look per graphics level: the browser build's four presets and budgets
// (gfx.js TABLE / BUDGETS, each tuned to hold 60 FPS on the weakest GPU its
// Auto gave it) keyed by the runtime's quality tier (frame().quality), with
// the sparks scaled within the tier by the level (frame().levelIndex), as the
// browser build scaled them by its hardware level (at most 2×). The runtime
// owns the rest of what the old Graphics section did: Auto and the level
// choice, render scale and the pixel-ratio cap, adaptive resolution, the
// frame-rate limit and readout, the GPU summary. The old section's
// per-category overrides are not offered (the runtime's Options choose a
// level).
import type { QualityTier } from "starhermit:engine";
import type { AntialiasMode } from "starhermit:scene";

export interface Budget {
  /** Loops, pegs, spools and table: Lambert (Low), standard, or physical (clear-coated brass; High/Ultra). */
  material: "lambert" | "standard" | "physical";
  /** Loop and stitch merged into one vertex-coloured mesh per loop (one draw call). */
  merge: boolean;
  /** Spun-yarn twist texture width in px (height ¼). */
  yarn: number;
  /** Geometry LOD multiplier. */
  segments: number;
  /** Ambient dust motes. */
  dust: number;
  /** Spark count and cap multiplier (scaled by the level within the tier, ≤ 2×). */
  sparks: number;
  bloomRes: number; aoRes: number;
}
export interface Look {
  preset: QualityTier;
  shadows: 0 | 1024 | 2048 | 4096;
  ao: "off" | "on" | "high";
  bloom: boolean;
  grade: boolean;
  antialias: AntialiasMode;
  reflections: boolean;
  /** Particles tier: cap 150 (small flat flecks) or 900 (soft additive sparks in the yarn colour). */
  particles: "low" | "high";
  /** Ambient motion: dust drift and the key light's lamp shimmer. */
  animated: boolean;
  /** Scene detail: yarn-twist loops, clear-coated brass with a turned collar, flanged spools. */
  detailed: boolean;
  budget: Budget;
}

const TABLE: Record<QualityTier, Omit<Look, "preset" | "budget">> = {
  low: { shadows: 0, ao: "off", bloom: false, grade: false, antialias: "msaa", reflections: false, particles: "low", animated: false, detailed: false },
  balanced: { shadows: 1024, ao: "off", bloom: true, grade: true, antialias: "fxaa", reflections: true, particles: "high", animated: true, detailed: true },
  high: { shadows: 2048, ao: "on", bloom: true, grade: true, antialias: "smaa", reflections: true, particles: "high", animated: true, detailed: true },
  ultra: { shadows: 4096, ao: "high", bloom: true, grade: true, antialias: "msaa", reflections: true, particles: "high", animated: true, detailed: true },
};
const BUDGETS: Record<QualityTier, Budget> = {
  low: { material: "lambert", merge: true, yarn: 64, segments: 0.5, dust: 35, sparks: 0.5, bloomRes: 0.5, aoRes: 0.5 },
  balanced: { material: "standard", merge: false, yarn: 128, segments: 0.75, dust: 50, sparks: 0.75, bloomRes: 0.5, aoRes: 0.5 },
  high: { material: "physical", merge: false, yarn: 128, segments: 1, dust: 70, sparks: 1, bloomRes: 0.5, aoRes: 0.5 },
  ultra: { material: "physical", merge: false, yarn: 256, segments: 1.5, dust: 120, sparks: 1.5, bloomRes: 1, aoRes: 1 },
};
/** The first level index of each tier. */
const TIER_FLOOR: Record<QualityTier, number> = { low: 0, balanced: 2, high: 4, ultra: 7 };

/** The look for a quality tier at a level index (0 … 9). */
export function lookFor(preset: QualityTier, levelIndex: number): Look {
  const b = { ...BUDGETS[preset] };
  // Levels are about 1.64× apart in GPU throughput: sparks grow with the level above the tier's first, at most
  // 2× the tier's budget (gfx.js budget()).
  const k = Math.min(2, Math.pow(1.64, Math.max(0, levelIndex - TIER_FLOOR[preset])));
  b.sparks = Math.round(b.sparks * k * 100) / 100;
  return { preset, ...TABLE[preset], budget: b };
}

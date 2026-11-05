// The look per graphics level. The engine-owned effects (shadows and their
// map size, ambient occlusion, bloom, the grade, anti-aliasing) are the
// level's own (levelSettings(): the same table every StarHermit game reads).
// The game's art (materials, merged loops, the yarn texture, geometry LOD,
// dust, sparks, reflections, ambient motion, detail) is the browser build's
// four presets and budgets (gfx.js TABLE / BUDGETS) keyed by the level's
// quality tier, with the sparks scaled within the tier by the level's
// particle budget against the tier's anchor level (quantum, molecular,
// terrestrial, galactic), at most 2×. The runtime owns the rest of what the
// old Graphics section did: Auto and the level choice, render scale and the
// pixel-ratio cap, adaptive resolution, the frame-rate limit and readout, the
// GPU summary. The old section's per-category overrides are not offered (the
// runtime's Options choose a level).
import { levelSettings, type GraphicsLevel, type LevelSettings, type QualityTier } from "starhermit:engine";
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
}
export interface Look {
  preset: QualityTier;
  /** The level's key-light shadow map size, 0 when the level draws no shadows. */
  shadows: number;
  /** The level's ambient occlusion (null: off). */
  ao: { resolution: number; samples: number; denoiseSamples: number } | null;
  /** The level's bloom resolution (null: off). */
  bloom: number | null;
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

const ART: Record<QualityTier, Pick<Look, "reflections" | "particles" | "animated" | "detailed">> = {
  low: { reflections: false, particles: "low", animated: false, detailed: false },
  balanced: { reflections: true, particles: "high", animated: true, detailed: true },
  high: { reflections: true, particles: "high", animated: true, detailed: true },
  ultra: { reflections: true, particles: "high", animated: true, detailed: true },
};
const BUDGETS: Record<QualityTier, Budget> = {
  low: { material: "lambert", merge: true, yarn: 64, segments: 0.5, dust: 35, sparks: 0.5 },
  balanced: { material: "standard", merge: false, yarn: 128, segments: 0.75, dust: 50, sparks: 0.75 },
  high: { material: "physical", merge: false, yarn: 128, segments: 1, dust: 70, sparks: 1 },
  ultra: { material: "physical", merge: false, yarn: 256, segments: 1.5, dust: 120, sparks: 1.5 },
};
/** The level whose settings are each tier's preset. */
const ANCHOR: Record<QualityTier, GraphicsLevel> = { low: "quantum", balanced: "molecular", high: "terrestrial", ultra: "galactic" };

/** The look for a graphics level (the frame's by default). */
export function lookFor(s: LevelSettings = levelSettings()): Look {
  const preset = s.quality;
  const b = { ...BUDGETS[preset] };
  // The sparks grow with the level's particle budget above the tier's anchor, at most 2× the tier's
  // budget (gfx.js budget()).
  const k = Math.min(2, s.particles / levelSettings(ANCHOR[preset]).particles);
  b.sparks = Math.round(b.sparks * k * 100) / 100;
  b.yarn = Math.min(b.yarn, s.maxTextureSize);
  return {
    preset, ...ART[preset],
    shadows: s.shadows ? s.shadowMapSize : 0,
    ao: s.ao && { resolution: s.ao.resolution, samples: s.ao.samples, denoiseSamples: s.ao.denoiseSamples },
    bloom: s.bloom ? s.bloom.resolution : null,
    grade: s.grade,
    // Engine 1.36.1 bug: antialias "off" recolours fog, haze and translucent overlays; the old Low's MSAA
    // stays until engine 1.36.2 (drop this clamp when pinning 1.36.2+).
    antialias: s.antialias === "off" ? "msaa" : s.antialias,
    budget: b,
  };
}

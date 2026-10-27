// Loop Loom save helpers for the engine client (pure: no engine, no DOM, so
// node tests check them and native/platform.ts uses them unchanged).
//
// The game's save (starhermit:storage `saves`) is the browser build's cloud
// document (session.js exportDoc: { v: 1, savedAt, progress, scores }) without
// its settings: the game's own options are engine `settings`, and volumes,
// graphics, language, reduced motion, high contrast and larger text are the
// runtime's Options. The browser build's cloud slot (the JS SDK's saveJSON of
// the whole exportDoc under game:<slug>) reads as a foreign save: its progress
// and scores merge in through session.js mergeDocs, and its game options are
// adopted where this game has not set them.

/** The game's own options and their defaults (the browser build's DEFAULT_SETTINGS minus what the runtime owns). */
export const DEFAULT_OPTIONS = {
  palette: 'default', leftHanded: false, holdToLift: false, timingAssist: false,
  haptics: true, telemetryConsent: false, difficulty: 3,
};
export const OPTION_KEYS = Object.keys(DEFAULT_OPTIONS);
export const PALETTE_IDS = ['default', 'deuteranopia', 'protanopia', 'tritanopia', 'contrast'];

/** Every key the browser build patched into the account's settings KV (main.js kvSettings + sh-language.js). */
export const BROWSER_KEYS = [
  'version', 'music', 'effects', 'ambience', 'voice', 'muted', 'palette', 'reducedMotion', 'highContrast', 'largerText',
  'leftHanded', 'holdToLift', 'timingAssist', 'haptics', 'quality', 'cameraShake', 'tutorialSeen', 'telemetryConsent',
  'difficulty', 'gamepad', 'graphics', 'ui.language',
];

const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

/** The valid game options in an old settings object (the cloud doc's settings or the KV). */
export function pickOptions(raw) {
  const r = obj(raw);
  const out = {};
  for (const k of OPTION_KEYS) {
    const v = r[k];
    if (k === 'palette') { if (PALETTE_IDS.includes(v)) out[k] = v; }
    else if (k === 'difficulty') { if (Number.isInteger(v) && v >= 1 && v <= 10) out[k] = v; }
    else if (typeof v === 'boolean') out[k] = v;
  }
  return out;
}

/** What the engine save holds: the cloud document's progress and scores. */
export function saveData(doc) {
  const d = obj(doc);
  return { v: 1, savedAt: Number(d.savedAt) || 0, progress: d.progress ?? null, scores: d.scores ?? null };
}

/** Whether two save documents hold the same progress and scores. */
export function sameData(a, b) {
  const x = saveData(a), y = saveData(b);
  return JSON.stringify([x.progress, x.scores]) === JSON.stringify([y.progress, y.scores]);
}

/** The browser build's cloud save text → { doc, options }, or null when it is not one. */
export function readForeign(text) {
  let doc;
  try { doc = typeof text === 'string' ? JSON.parse(text) : text; } catch { return null; }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc) || doc.v !== 1) return null;
  if (!doc.progress && !doc.scores) return null;
  return { doc, options: pickOptions(doc.settings) };
}

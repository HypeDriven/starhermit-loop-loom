// Sound, as the browser build's audio.js: the authored one-shots
// (sfx/<name>.opus, sfx/manifest.json) per game event with the seeded
// variant pick for `move`, the adaptive music pad (C, E♭, G, B♭, C stepping
// every 1.6 s with one, two or three voices as more of the board is sorted)
// and the atelier room tone (a two-second seeded brown-noise loop through a
// 320 Hz low-pass), plus the captions every event emits (shown even when
// muted).
//
// The browser build's four buses become the runtime's (Options › Audio owns
// the volumes, the mute and the voice limit): music → "music", effects and
// ambience → "effects", the voice cues (hint, achievement — kept audible when
// effects are mixed down) and the menu click / back → "interface"; the old
// default bus levels (music 60 %, effects 80 %, ambience 40 %, voice 70 %)
// are folded into each sound's gain. The pad's sine notes and the noise loop
// are rendered into clips once (createClip): a live synthesis graph makes
// clip loads fail on the engine's web runtime. The synthesized stand-ins the
// browser build played while a clip decoded are not ported, so a clip still
// loading is silent (its caption still shows). Clips load once the mixer
// runs (natively at once, in a browser after the first press), one at a
// time; rendered clips one a frame.
import { context, createClip, loadClip, play as playClip, type AudioClip, type Bus, type Sound } from "starhermit:audio";
import { Rules } from "./game.ts";

const LEVEL = { music: 0.6, effects: 0.8, ambience: 0.4, voice: 0.7 };
/** audio.js SFX_BY_EVENT. */
const SFX: Record<string, string[]> = {
  select: ["loop-lift"], deselect: ["loop-lower"], move: ["loop-place", "loop-settle"], invalid: ["move-denied"],
  "complete-peg": ["peg-complete"], win: ["loom-finished"], lose: ["round-over"], undo: ["move-undone"],
  hint: ["hint-chime"], click: ["ui-click"], back: ["ui-back"], "round-start": ["round-start"],
  "time-warning": ["time-warning"], achievement: ["achievement-unlock"],
};
const VOICE = new Set(["hint", "achievement"]);
const INTERFACE = new Set(["click", "back"]);
/** audio.js captionFor. */
const CAPTIONS: Record<string, string> = {
  select: "Loop lifted", deselect: "Loop lowered", move: "Loop placed", invalid: "That move is not allowed",
  "complete-peg": "Peg completed", win: "Loom complete", lose: "Round over", undo: "Move undone", hint: "Hint suggested",
  achievement: "Achievement unlocked", back: "Back", "round-start": "Round started", "time-warning": "Time running out",
};

const clips = new Map<string, AudioClip>();
const queue: string[] = [];
let loading = false;
let wantClips = false;
let suspended = false;
let avRng = Rules.mulberry32(1234);
let captionFn: ((text: string) => void) | null = null;

/** The caption line's listener (English keys, translated where shown). */
export function onCaption(fn: (text: string) => void): void { captionFn = fn; }
/** audio.js setSeed: the audiovisual variant stream for a round. */
export function setSeed(seed: number): void { avRng = Rules.mulberry32((seed ^ 0xa53f9c11) >>> 0); }

function load(name: string): void { if (!queue.includes(name) && !clips.has(name)) queue.push(name); }
function pump(): void {
  if (loading || !queue.length) return;
  const name = queue.shift()!;
  loading = true;
  loadClip(`sfx/${name}.opus`).then((c) => { clips.set(name, c); loading = false; }, (e: unknown) => { console.warn(`sfx ${name}: ${String(e)}`); loading = false; });
}
/** Asks for the clips; they load once the mixer runs (see update). */
export function loadSfx(): void { wantClips = true; }

/** A game event's sample (once loaded) and its caption. */
export function play(event: string): void {
  const cap = CAPTIONS[event];
  if (cap && captionFn) captionFn(cap);
  const names = SFX[event];
  if (!names || suspended) return;
  const file = names.length === 1 ? names[0]! : names[Math.floor(avRng() * names.length)]!;
  const clip = clips.get(file);
  if (!clip) return;
  const bus: Bus = VOICE.has(event) || INTERFACE.has(event) ? "interface" : "effects";
  const gain = VOICE.has(event) ? LEVEL.voice : LEVEL.effects;
  try { playClip(clip, { bus, gain }); }
  catch { clips.delete(file); load(file); } // a clip the mixer lost: load it again
}

// -- rendered clips -------------------------------------------------------------------
const RATE = 22050;
/** audio.js blip('music', f, 1.6, 'sine', 0.05): gain 0.05, held 15 ms, then setTargetAtTime(0, …, 0.4 s). */
function noteClip(freq: number): AudioClip {
  const n = Math.round(1.9 * RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = t < 0.015 ? 1 : Math.exp(-(t - 0.015) / 0.4);
    out[i] = Math.sin(2 * Math.PI * freq * t) * env * (i > n - 200 ? (n - i) / 200 : 1);
  }
  return createClip([out], RATE);
}
/** audio.js startAmbience: two seconds of leaky-integrated noise (×8) through a 320 Hz low-pass at gain 0.5, looped. */
function roomToneClip(): AudioClip {
  const n = 2 * RATE;
  const rng = Rules.mulberry32(Rules.fnv1a("av:atelier"));
  const a = 1 - Math.exp(-2 * Math.PI * 320 / RATE);
  const out = new Float32Array(n);
  let last = 0, y = 0, y2 = 0;
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) { last = last * 0.98 + (rng() * 2 - 1) * 0.02; noise[i] = last * 8; }
  // Two passes of a two-pole low-pass (the biquad's stand-in), warmed over the loop once so the seam is quiet.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      y += a * (noise[i]! - y);
      y2 += a * (y - y2);
      if (pass === 1) out[i] = y2 * 0.5;
    }
  }
  return createClip([out], RATE);
}

// -- music and the room tone ---------------------------------------------------------------
const SCALE = [261.6, 311.1, 392.0, 466.2, 523.3];
const notes = new Map<number, AudioClip>();
let roomTone: AudioClip | null = null;
let roomSound: Sound | null = null;
let step = 0;
let nextNote = 0;
let playing = false;
let progress: () => number = () => 0;

/** audio.js startAmbience + startMusic: the pad follows `getProgress` (0–1, the sorted share of the board). */
export function startRound(getProgress: () => number): void { progress = getProgress; playing = true; }
/** A hidden window: the pad and the room tone hold (audio.js suspended its context). */
export function setSuspended(on: boolean): void { suspended = on; }

/** Each frame: the clips once the mixer runs (one at a time), the rendered notes and room tone one a
 * frame after them, then the room tone by state and the pad's next step by mixer time. */
export function update(): void {
  if (context.state !== "running") return;
  if (wantClips) {
    wantClips = false;
    for (const names of Object.values(SFX)) for (const n of names) load(n);
    return;
  }
  pump();
  if (loading || queue.length) return;
  if (!roomTone) { roomTone = roomToneClip(); return; }
  for (const f of SCALE) if (!notes.has(f)) { notes.set(f, noteClip(f)); return; }
  try {
    const want = playing && !suspended;
    if (want && !roomSound) roomSound = playClip(roomTone, { bus: "effects", gain: LEVEL.ambience, loop: true });
    else if (!want && roomSound) { roomSound.stop(); roomSound = null; }
  } catch (e) { console.warn(`audio: ${String(e)}`); return; }
  if (!playing || suspended) return;
  const now = context.currentTime;
  if (now < nextNote) return;
  nextNote = Math.max(now, nextNote) + 1.6;
  const p = Math.max(0, Math.min(1, progress()));
  const voices = p > 0.66 ? 3 : p > 0.33 ? 2 : 1;
  for (let i = 0; i < voices; i++) {
    const note = notes.get(SCALE[(step + i * 2) % SCALE.length]!);
    try { if (note) playClip(note, { bus: "music", gain: 0.05 * LEVEL.music }); } catch { /* the mixer is full */ }
  }
  step++;
}

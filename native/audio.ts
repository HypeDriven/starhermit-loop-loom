// Sound, as the browser build's audio.js: the authored one-shots
// (sfx/<name>.opus, sfx/manifest.json) per game event with a SoundBank's
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
// are rendered offline into clips once: a live synthesis graph makes
// clip loads fail on the engine's web runtime. The synthesized stand-ins the
// browser build played while a clip decoded are not ported, so a clip still
// loading is silent (its caption still shows). Every clip loads at once in
// onStart (the engine hands each loaded clip to the mixer, natively and in a
// browser); the pad and room tone wait
// for the mixer to run (in a browser, the first press).
import { OfflineAudioContext, SoundBank, context, createClip, loadClip, play as playClip, type AudioClip, type Bus, type Sound } from "starhermit:audio";

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
let suspended = false;
let moveBank: SoundBank | null = null;
let captionFn: ((text: string) => void) | null = null;

/** The caption line's listener (English keys, translated where shown). */
export function onCaption(fn: (text: string) => void): void { captionFn = fn; }

/** Loads every clip at once (onStart); a cue whose clip is still loading is silent. */
export function loadSfx(): void {
  const loads = new Map<string, Promise<AudioClip | null>>();
  for (const name of new Set(Object.values(SFX).flat())) {
    loads.set(name, loadClip(`sfx/${name}.opus`).then((c) => { clips.set(name, c); return c; }, (e: unknown) => { console.warn(`sfx ${name}: ${String(e)}`); return null; }));
  }
  void Promise.all(SFX.move!.map((n) => loads.get(n)!)).then((loaded) => {
    const list = loaded.filter((c) => c !== null);
    if (list.length) moveBank = new SoundBank({ clips: list, bus: "effects", gain: LEVEL.effects });
  });
  void renderBeds().catch((e: unknown) => console.warn(`audio render: ${String(e)}`));
}

/** A game event's sample (once loaded) and its caption. */
export function play(event: string): void {
  const cap = CAPTIONS[event];
  if (cap && captionFn) captionFn(cap);
  const names = SFX[event];
  if (!names || suspended) return;
  if (names.length > 1) { try { moveBank?.play(); } catch { /* the mixer is full this frame: skip it */ } return; }
  const clip = clips.get(names[0]!);
  if (!clip) return;
  const bus: Bus = VOICE.has(event) || INTERFACE.has(event) ? "interface" : "effects";
  const gain = VOICE.has(event) ? LEVEL.voice : LEVEL.effects;
  try { playClip(clip, { bus, gain }); }
  catch { /* the mixer is full this frame: skip it */ }
}

// -- rendered clips -------------------------------------------------------------------
const RATE = 22050;
const NOTE_LEN = 1.9;
/** audio.js blip('music', f, 1.6, 'sine', 0.05): gain 0.05, held 15 ms, then setTargetAtTime(0, …, 0.4 s). */
async function renderNote(freq: number): Promise<AudioClip> {
  const off = new OfflineAudioContext(1, Math.round(NOTE_LEN * RATE), RATE);
  const osc = off.createOscillator();
  osc.frequency.value = freq;
  const env = off.createGain();
  const fade = NOTE_LEN - 200 / RATE;
  env.gain.setValueAtTime(1, 0);
  env.gain.setTargetAtTime(0, 0.015, 0.4);
  env.gain.setValueAtTime(Math.exp(-(fade - 0.015) / 0.4), fade);
  env.gain.linearRampToValueAtTime(0, NOTE_LEN);
  osc.connect(env).connect(off.destination);
  osc.start();
  return createClip(await off.startRendering());
}
/** audio.js startAmbience: two seconds of brown noise through a 320 Hz low-pass, looped (periodic once settled). */
async function renderRoomTone(): Promise<AudioClip> {
  const n = 2 * RATE, settle = Math.round(0.25 * RATE);
  const off = new OfflineAudioContext(1, settle + n, RATE);
  const noise = off.createNoise({ color: "brown", seed: 0xa7e1, seconds: 2 });
  const lp = off.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  noise.connect(lp).connect(off.destination);
  noise.start();
  const r = await off.startRendering();
  return createClip([r.getChannelData(0).slice(settle)], RATE);
}
async function renderBeds(): Promise<void> {
  roomTone = await renderRoomTone();
  for (const f of SCALE) notes.set(f, await renderNote(f));
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

/** Each frame once the mixer runs: the room tone by state and the pad's next step by mixer time. */
export function update(): void {
  if (context.state !== "running") return;
  if (!roomTone) return;
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

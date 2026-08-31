'use strict';

// Loop Loom — WebAudio: buses (music/effects/ambience/voice), procedural
// original transients tied to logical events, seeded pitch variants,
// focus/background behavior, captions hooks.

import { mulberry32 } from './rules.js';

let ctx = null;
const buses = {};
let settings = null;
let captionCb = null;
let avRng = mulberry32(1234); // audiovisual variant stream (separate from rules)
let musicTimer = 0;
let musicStep = 0;
let ambienceNodes = null;

// Authored one-shot samples (sfx/<name>.opus, see sfx/manifest.json) mapped to
// the logical events below. Each event prefers its sample; procedural
// synthesis below stays as the loading/failure fallback.
const SFX_BY_EVENT = {
  'select': ['loop-lift'],
  'deselect': ['loop-lower'],
  'move': ['loop-place', 'loop-settle'],
  'invalid': ['move-denied'],
  'complete-peg': ['peg-complete'],
  'win': ['loom-finished'],
  'lose': ['round-over'],
  'undo': ['move-undone'],
  'hint': ['hint-chime'],
  'click': ['ui-click'],
  'achievement': ['achievement-unlock'],
};
const sfxCache = new Map(); // name -> AudioBuffer | 'loading' | null (failed)

function ensureCtx() {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  ctx = new AC();
  const master = ctx.createGain();
  master.connect(ctx.destination);
  buses.master = master;
  for (const name of ['music', 'effects', 'ambience', 'voice']) {
    const g = ctx.createGain();
    g.connect(master);
    buses[name] = g;
  }
  applyVolumes();
  return ctx;
}

function applyVolumes() {
  if (!ctx || !settings) return;
  const m = settings.muted ? 0 : 1;
  buses.master.gain.value = m;
  buses.music.gain.value = settings.music;
  buses.effects.gain.value = settings.effects;
  buses.ambience.gain.value = settings.ambience;
  buses.voice.gain.value = settings.voice;
}

export function configure(s) {
  settings = s;
  applyVolumes();
}

export function onCaption(cb) { captionCb = cb; }
function caption(text) { if (captionCb) captionCb(text); }

export function unlock() {
  const c = ensureCtx();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
  if (c) for (const names of Object.values(SFX_BY_EVENT)) names.forEach(loadSfx);
}

// Lazy fetch/decode/cache of one authored clip. No-op once settled.
function loadSfx(name) {
  const c = ensureCtx();
  if (!c || sfxCache.has(name)) return;
  sfxCache.set(name, 'loading');
  fetch(`sfx/${name}.opus`)
    .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.arrayBuffer(); })
    .then((bytes) => c.decodeAudioData(bytes))
    .then((buf) => sfxCache.set(name, buf))
    .catch(() => sfxCache.set(name, null));
}

// Play the event's mapped sample through the effects bus; returns false when
// it is missing or still loading so the caller falls back to synthesis.
function playSfx(name) {
  const names = SFX_BY_EVENT[name];
  if (!ctx || !names) return false;
  const clip = names.length === 1 ? names[0] : names[(avRng() * names.length) | 0];
  const buf = sfxCache.get(clip);
  if (buf === undefined) { loadSfx(clip); return false; }
  if (!buf || buf === 'loading') return false;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(buses.effects);
  src.start();
  return true;
}

export function setSeed(seed) { avRng = mulberry32((seed ^ 0xa53f9c11) >>> 0); }

// Short original transient: layered oscillator + filtered noise tick.
function blip(bus, freq, dur, type, gain, slide) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.setTargetAtTime(0, t + 0.015, dur / 4);
  o.connect(g); g.connect(buses[bus] || buses.effects);
  o.start(t);
  o.stop(t + dur + 0.3);
}

function noiseTick(bus, dur, gain, filterFreq) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime;
  const len = Math.max(1, (c.sampleRate * dur) | 0);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (avRng() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = filterFreq; f.Q.value = 1.2;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f); f.connect(g); g.connect(buses[bus] || buses.effects);
  src.start(t);
}

// Event map — input acknowledgment < legal move < combo/goal < round completion.
export function playEvent(name) {
  if (!settings || settings.muted) { caption(captionFor(name)); return; }
  try {
    unlock();
    if (!playSfx(name)) {
      const v = 0.9 + avRng() * 0.2; // seeded pitch variant for replay consistency
      switch (name) {
      case 'select': blip('effects', 520 * v, 0.09, 'triangle', 0.12); break;
      case 'deselect': blip('effects', 380 * v, 0.08, 'triangle', 0.09); break;
      case 'move': noiseTick('effects', 0.12, 0.25, 900 * v); blip('effects', 300 * v, 0.14, 'sine', 0.14, -80); break;
      case 'invalid': blip('effects', 160, 0.16, 'square', 0.08, -40); break;
      case 'complete-peg': blip('effects', 660 * v, 0.2, 'sine', 0.16, 220); noiseTick('effects', 0.18, 0.15, 2400); break;
      case 'win': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip('effects', f, 0.35, 'sine', 0.16), i * 110)); break;
      case 'lose': blip('effects', 220, 0.4, 'sine', 0.14, -90); break;
      case 'undo': blip('effects', 340, 0.12, 'triangle', 0.1, 120); break;
      case 'hint': blip('voice', 740, 0.14, 'sine', 0.12, 60); break;
      case 'click': blip('effects', 880, 0.05, 'sine', 0.07); break;
      case 'achievement': [784, 988].forEach((f, i) => setTimeout(() => blip('voice', f, 0.3, 'sine', 0.14), i * 140)); break;
      default: blip('effects', 440, 0.08, 'sine', 0.08);
      }
    }
  } catch { /* audio unavailable */ }
  caption(captionFor(name));
}

function captionFor(name) {
  return {
    select: 'Loop lifted', deselect: 'Loop lowered', move: 'Loop placed',
    invalid: 'That move is not allowed', 'complete-peg': 'Peg completed',
    win: 'Loom complete', lose: 'Round over', undo: 'Move undone',
    hint: 'Hint suggested', achievement: 'Achievement unlocked',
  }[name] || '';
}

// Quiet ambience: looped filtered noise "atelier room tone".
export function startAmbience() {
  const c = ensureCtx();
  if (!c || ambienceNodes) return;
  try {
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = last * 0.98 + (avRng() * 2 - 1) * 0.02; d[i] = last * 8; }
    const src = c.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 320;
    const g = c.createGain(); g.gain.value = 0.5;
    src.connect(f); f.connect(g); g.connect(buses.ambience);
    src.start();
    ambienceNodes = { src, g };
  } catch { /* ignore */ }
}

// Adaptive music: gentle pad pattern; stems intensify as progress rises.
export function startMusic(getProgress) {
  stopMusic();
  const scale = [261.6, 311.1, 392.0, 466.2, 523.3];
  const step = () => {
    if (!ctx || ctx.state !== 'running') return;
    const p = Math.max(0, Math.min(1, getProgress ? getProgress() : 0));
    const n = p > 0.66 ? 3 : p > 0.33 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const f = scale[(musicStep + i * 2) % scale.length];
      blip('music', f, 1.6, 'sine', 0.05);
    }
    musicStep += 1;
  };
  ensureCtx();
  musicTimer = setInterval(step, 1600);
  step();
}
export function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = 0; } }

// Backgrounding: suspend the context; resume on return.
export function bindVisibility() {
  if (typeof document === 'undefined') return;
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else ctx.resume().catch(() => {});
  });
}

export default { configure, onCaption, unlock, setSeed, playEvent, startAmbience, startMusic, stopMusic, bindVisibility };

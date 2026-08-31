'use strict';

// Loop Loom — Three.js render: textile-atelier scene, brass pegs, fiber loops,
// selection/preview layers, pooled particles, quality tiers, camera.
// Rendering consumes immutable snapshots; it never mutates rules state.

import * as THREE from 'three';
import { mulberry32 } from './rules.js';
import { getTheme, PALETTES } from './content.js';

const LAYER_ENV = 0, LAYER_GAME = 1, LAYER_MARKER = 2, LAYER_FX = 3;

let renderer = null;
let scene = null;
let camera = null;
let canvas = null;
let rafId = 0;
let running = false;
let theme = getTheme('atelier');
let palette = PALETTES.default;
let reducedMotion = false;
let quality = { pixelRatio: 1.5, shadows: true, particles: 600, detail: 1 };

// Deterministic visual seed (decoration stream — never touches rules).
let decorRng = mulberry32(0xC0FFEE);

let boardGroup = null;
let pegMeshes = [];
let pegTargets = [];       // invisible raycast targets per peg
let loopPool = [];         // pooled loop meshes
let markers = [];          // legal-target ground markers
let selectRing = null;
let particlePool = null;
let tweens = [];
let shakeAmp = 0;
let pointerPar = { x: 0, y: 0 };
let onPegEvent = null;
let currentState = null;
let selection = null;      // { peg } while lifted
let lastUniformPegs = new Set();

// Framing constants (authored, not magic offsets).
const FRAMING = { dist: 7.6, height: 4.6, lookY: 0.9, fov: 40 };
const LOOP_SPACING = 0.34;
const LOOP_R = 0.3, LOOP_TUBE = 0.115;
const PEG_H = 2.6;

const tmpV = new THREE.Vector3();

function pegX(i, count) {
  const spacing = count > 6 ? 1.05 : 1.3;
  return (i - (count - 1) / 2) * spacing;
}

// ---------------------------------------------------------------------------
// Scene construction
// ---------------------------------------------------------------------------

function buildEnvironment() {
  const env = new THREE.Group();
  env.name = 'environment';

  // Table top — soft fiber wood.
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.5, 14),
    new THREE.MeshStandardMaterial({ color: theme.floor, roughness: 0.9, metalness: 0.05 }));
  table.position.y = -0.25;
  table.receiveShadow = true;
  env.add(table);

  // Woven mat under the pegs.
  const mat = new THREE.Mesh(
    new THREE.CylinderGeometry(5.6, 5.9, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(theme.floor).multiplyScalar(1.25), roughness: 1 }));
  mat.position.y = 0.04;
  mat.receiveShadow = true;
  env.add(mat);

  // Background spools and shelf props (procedural, decorative).
  for (let i = 0; i < 7; i++) {
    const r = decorRng();
    const spool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22 + r * 0.15, 0.22 + r * 0.15, 0.5 + decorRng() * 0.5, 14),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(palette[i % palette.length]), roughness: 0.85 }));
    spool.position.set(-7 + decorRng() * 14, 0.3, -4.5 - decorRng() * 2);
    spool.castShadow = quality.shadows;
    env.add(spool);
  }

  // Loose fiber strands: thin curved tubes across the table.
  for (let i = 0; i < 5; i++) {
    const pts = [];
    const x0 = -6 + decorRng() * 12;
    for (let k = 0; k <= 8; k++) {
      pts.push(new THREE.Vector3(x0 + k * 0.35, 0.03, 2.5 + Math.sin(k * 1.3 + i) * 0.3 + decorRng() * 0.4));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, 0.02, 5),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(palette[(i + 2) % palette.length]), roughness: 1 }));
    env.add(tube);
  }
  return env;
}

function makeLoopGeometry(colorIdx) {
  // Torus with a small shape-coded stitch marker so color is never the only
  // channel: crimson sphere, indigo cone, fern box, marigold octahedron,
  // violet pyramid, ember cylinder.
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette[colorIdx % palette.length]),
    roughness: 0.75, metalness: 0.05,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(LOOP_R, LOOP_TUBE, 10 + quality.detail * 6, 20 + quality.detail * 8), mat);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = quality.shadows;
  group.add(ring);
  let markerGeo;
  switch (colorIdx % 6) {
    case 0: markerGeo = new THREE.SphereGeometry(0.07, 8, 8); break;
    case 1: markerGeo = new THREE.ConeGeometry(0.07, 0.12, 8); break;
    case 2: markerGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1); break;
    case 3: markerGeo = new THREE.OctahedronGeometry(0.08); break;
    case 4: markerGeo = new THREE.ConeGeometry(0.08, 0.12, 4); break;
    default: markerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8);
  }
  const stitch = new THREE.Mesh(markerGeo, new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.6 }));
  stitch.position.set(LOOP_R, LOOP_TUBE * 0.6, 0);
  group.add(stitch);
  return group;
}

function makePeg(x) {
  const g = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: theme.brass, metalness: 0.85, roughness: 0.35 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, PEG_H, 14), brass);
  stem.position.y = PEG_H / 2;
  stem.castShadow = quality.shadows;
  g.add(stem);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), brass);
  knob.position.y = PEG_H + 0.08;
  g.add(knob);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.12, 20), brass);
  base.position.y = 0.06;
  g.add(base);
  g.position.x = x;
  return g;
}

function makeGroundMarker(x, legal) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.56, 24),
    new THREE.MeshBasicMaterial({ color: legal ? 0x7fe08a : 0xe07f7f, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.1, 0);
  m.layers.set(LAYER_MARKER);
  return m;
}

function buildBoard(state) {
  if (boardGroup) {
    scene.remove(boardGroup);
    boardGroup.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }
  boardGroup = new THREE.Group();
  boardGroup.name = 'board';
  pegMeshes = [];
  pegTargets = [];
  markers = [];
  loopPool = [];
  const count = state.pegs.length;
  for (let i = 0; i < count; i++) {
    const peg = makePeg(pegX(i, count));
    peg.userData.pegIndex = i;
    boardGroup.add(peg);
    pegMeshes.push(peg);
    // Explicit interaction layer: an invisible tall pick cylinder.
    const pick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, PEG_H + 1.4, 8),
      new THREE.MeshBasicMaterial({ visible: false }));
    pick.position.set(pegX(i, count), (PEG_H + 1) / 2, 0);
    pick.userData.pegIndex = i;
    pick.layers.set(LAYER_GAME);
    boardGroup.add(pick);
    pegTargets.push(pick);
    const mk = makeGroundMarker(pegX(i, count), true);
    boardGroup.add(mk);
    markers.push(mk);
    // Loop slots (pooled): max cap loops per peg.
    for (let k = 0; k < state.cap; k++) {
      const slot = new THREE.Group();
      slot.position.set(pegX(i, count), 0.28 + k * LOOP_SPACING, 0);
      slot.visible = false;
      boardGroup.add(slot);
      loopPool.push({ slot, peg: i, level: k, colorIdx: -1 });
    }
  }
  // Selection ring (grounded marker under lifted origin).
  selectRing = new THREE.Mesh(
    new THREE.RingGeometry(0.46, 0.6, 28),
    new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  selectRing.rotation.x = -Math.PI / 2;
  selectRing.position.y = 0.1;
  selectRing.visible = false;
  selectRing.layers.set(LAYER_MARKER);
  boardGroup.add(selectRing);
  scene.add(boardGroup);
  syncLoops(state, false);
}

// Particle pool (bounded; tier controls count; never intercepts raycasts).
function buildParticles() {
  const max = 1200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffe6b0, size: 0.05, transparent: true, opacity: 0.9 });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.layers.set(LAYER_FX);
  scene.add(points);
  particlePool = { points, alive: [], max };
}

function spawnParticles(x, y, z, n, spread) {
  if (reducedMotion || !particlePool) return;
  n = Math.min(n, quality.particles - particlePool.alive.length);
  for (let i = 0; i < n; i++) {
    particlePool.alive.push({
      x, y, z,
      vx: (decorRng() - 0.5) * spread, vy: 0.6 + decorRng() * 1.2, vz: (decorRng() - 0.5) * spread,
      life: 0.7 + decorRng() * 0.5,
    });
  }
}

function stepParticles(dt) {
  if (!particlePool) return;
  const attr = particlePool.points.geometry.attributes.position;
  const alive = particlePool.alive;
  let w = 0;
  for (let i = 0; i < alive.length; i++) {
    const p = alive[i];
    p.life -= dt;
    if (p.life <= 0 || p.y < 0) continue;
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    p.vy -= 2.4 * dt;
    alive[w++] = p;
  }
  alive.length = w;
  for (let i = 0; i < particlePool.max; i++) {
    if (i < alive.length) { attr.setXYZ(i, alive[i].x, alive[i].y, alive[i].z); }
    else attr.setXYZ(i, 0, -10, 0);
  }
  attr.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// State -> view sync
// ---------------------------------------------------------------------------

function loopTargetY(peg, level, lifted) {
  return 0.28 + level * LOOP_SPACING + (lifted ? 1.1 : 0);
}

function syncLoops(state, animate) {
  currentState = state;
  const count = state.pegs.length;
  const uniformNow = new Set();
  for (const rec of loopPool) {
    const pegArr = state.pegs[rec.peg];
    const has = rec.level < pegArr.length;
    rec.slot.visible = has;
    if (!has) { rec.colorIdx = -1; continue; }
    const c = pegArr[rec.level];
    if (rec.colorIdx !== c) {
      // (Re)build loop content for this color.
      while (rec.slot.children.length) {
        const ch = rec.slot.children.pop();
        ch.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
        rec.slot.remove(ch);
      }
      rec.slot.add(makeLoopGeometry(c));
      rec.colorIdx = c;
    }
    const lifted = selection && selection.peg === rec.peg && rec.level >= pegArr.length - selection.size;
    const tx = pegX(rec.peg, count);
    const ty = loopTargetY(rec.peg, rec.level, lifted);
    if (animate && !reducedMotion) {
      addTween(rec.slot.position, { x: tx, y: ty, z: 0 }, 0.28);
    } else {
      rec.slot.position.set(tx, ty, 0);
    }
  }
  // Peg completion detection for VFX/audio tier events.
  for (let i = 0; i < state.pegs.length; i++) {
    const p = state.pegs[i];
    if (p.length >= 2 && p.every((c) => c === p[0])) uniformNow.add(i);
  }
  for (const i of uniformNow) {
    if (!lastUniformPegs.has(i) && onPegEvent) onPegEvent('complete-peg', i);
    if (!lastUniformPegs.has(i)) {
      spawnParticles(pegX(i, count), 1.2, 0, 40, 1.6);
      if (!reducedMotion) shakeAmp = Math.max(shakeAmp, 0.05);
    }
  }
  lastUniformPegs = uniformNow;
}

// ---------------------------------------------------------------------------
// Tweens — authored duration/easing, interruptible, never cumulative lerp.
// ---------------------------------------------------------------------------

function addTween(vec3, target, dur) {
  for (const t of tweens) if (t.vec === vec3) { tweens.splice(tweens.indexOf(t), 1); break; }
  tweens.push({ vec: vec3, from: vec3.clone(), to: new THREE.Vector3(target.x, target.y, target.z), t: 0, dur });
}
function stepTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i];
    t.t += dt;
    const k = Math.min(1, t.t / t.dur);
    const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
    t.vec.lerpVectors(t.from, t.to, e);
    if (k >= 1) tweens.splice(i, 1);
  }
}

// Skip/fast-forward: settle every object into the exact deterministic end state.
export function settle() {
  tweens.length = 0;
  if (currentState) syncLoops(currentState, false);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function init(canvasEl, opts) {
  canvas = canvasEl;
  reducedMotion = !!(opts && opts.reducedMotion);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FRAMING.fov, 1, 0.1, 100);
  camera.layers.enable(LAYER_GAME);
  camera.layers.enable(LAYER_MARKER);
  camera.layers.enable(LAYER_FX);

  applyTheme(theme);
  buildParticles();
  resetCamera();

  window.addEventListener('resize', resize);
  resize();
  running = true;
  const clock = new THREE.Clock();
  const loop = () => {
    if (!running) return;
    const dt = Math.min(0.05, clock.getDelta());
    stepTweens(dt);
    stepParticles(dt);
    // Ground-marker pulse.
    const t = performance.now() / 1000;
    for (const m of markers) {
      if (m.userData.active) m.material.opacity = 0.35 + Math.sin(t * 4) * 0.15;
    }
    // Camera shake (event-tiered, disabled by reduced motion; never changes raycast truth).
    if (shakeAmp > 0.0005 && !reducedMotion) {
      camera.position.x += (decorRng() - 0.5) * shakeAmp;
      camera.position.y += (decorRng() - 0.5) * shakeAmp;
      shakeAmp *= 0.85;
    }
    // Gentle pointer parallax (interruptible, reduced-motion aware).
    if (!reducedMotion) {
      camera.position.x += pointerPar.x * 0.06;
      camera.position.y += pointerPar.y * 0.04;
    }
    camera.lookAt(0, FRAMING.lookY, 0);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  };
  loop();
}

function applyTheme(th) {
  theme = th;
  scene.background = new THREE.Color(th.bg);
  scene.fog = new THREE.Fog(th.bg, 14, 30);
  // Rebuild lights: one dominant key, soft environment fill, contact grounding.
  for (const l of scene.children.filter((o) => o.isLight)) scene.remove(l);
  const key = new THREE.DirectionalLight(th.key, 2.2);
  key.position.set(4, 8, 5);
  key.castShadow = quality.shadows;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(th.ambient, th.bg, 0.7));
  const rim = new THREE.DirectionalLight(th.ambient, 0.5);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  // Rebuild environment with new theme colors.
  const old = scene.getObjectByName('environment');
  if (old) { scene.remove(old); old.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
  scene.add(buildEnvironment());
}

export function setTheme(themeId) { applyTheme(getTheme(themeId)); }

export function setPalette(palId) {
  palette = PALETTES[palId] || PALETTES.default;
  if (currentState) {
    for (const rec of loopPool) rec.colorIdx = -1; // force rebuild
    syncLoops(currentState, false);
  }
}

export function setReducedMotion(v) {
  reducedMotion = !!v;
  if (reducedMotion) { settle(); shakeAmp = 0; if (particlePool) particlePool.alive.length = 0; }
}

export function setQuality(tier) {
  const dpr = window.devicePixelRatio || 1;
  if (tier === 'low') quality = { pixelRatio: Math.min(1, dpr), shadows: false, particles: 150, detail: 0 };
  else if (tier === 'medium') quality = { pixelRatio: Math.min(1.5, dpr), shadows: true, particles: 400, detail: 1 };
  else if (tier === 'high') quality = { pixelRatio: Math.min(2, dpr), shadows: true, particles: 900, detail: 2 };
  else { // auto: pick by device memory / cores heuristic
    const mem = navigator.deviceMemory || 4;
    setQuality(mem >= 4 ? 'high' : 'medium');
    return;
  }
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.shadowMap.enabled = quality.shadows;
  resize();
}

export function setBoard(state) {
  if (!boardGroup || pegTargets.length !== state.pegs.length ||
      (loopPool.length && loopPool[loopPool.length - 1].level + 1 !== state.cap)) {
    buildBoard(state);
  } else {
    syncLoops(state, true);
  }
}

export function setSelection(sel) {
  selection = sel; // { peg, size } | null
  if (selectRing) {
    selectRing.visible = !!sel;
    if (sel) selectRing.position.x = pegX(sel.peg, currentState.pegs.length);
  }
  if (currentState) syncLoops(currentState, false);
}

export function previewTargets(state, fromPeg) {
  const { legalActions } = rulesRef;
  const legal = new Set();
  if (fromPeg != null) {
    for (const a of legalActions(state)) if (a.from === fromPeg) legal.add(a.to);
  }
  markers.forEach((m, i) => {
    m.userData.active = legal.has(i);
    if (!legal.has(i)) m.material.opacity = 0;
  });
}

export function clearPreview() {
  markers.forEach((m) => { m.userData.active = false; m.material.opacity = 0; });
}

export function invalidFeedback(pegIdx) {
  // Shake the peg briefly (visual only) — explanation text is UI's job.
  const peg = pegMeshes[pegIdx];
  if (!peg || reducedMotion) return;
  const orig = peg.position.x;
  let n = 0;
  const iv = setInterval(() => {
    peg.position.x = orig + (n % 2 === 0 ? 0.06 : -0.06);
    if (++n > 5) { clearInterval(iv); peg.position.x = orig; }
  }, 40);
}

export function onEvent(cb) { onPegEvent = cb; }

export function dropEffect(pegIdx) {
  if (!currentState) return;
  const p = currentState.pegs[pegIdx];
  spawnParticles(pegX(pegIdx, currentState.pegs.length), 0.4 + p.length * LOOP_SPACING, 0, 12, 0.8);
}

export function winEffect() {
  if (!currentState) return;
  const n = currentState.pegs.length;
  for (let i = 0; i < n; i++) spawnParticles(pegX(i, n), 1.4, 0, 60, 2.2);
  if (!reducedMotion) shakeAmp = 0.12;
}

// Raycast only against the explicit interaction layer.
const raycaster = new THREE.Raycaster();
raycaster.layers.set(LAYER_GAME);
export function pointerToPeg(clientX, clientY) {
  if (!renderer) return null;
  const rect = canvas.getBoundingClientRect();
  const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
  const ny = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera({ x: nx, y: ny }, camera);
  const hits = raycaster.intersectObjects(pegTargets, false);
  return hits.length ? hits[0].object.userData.pegIndex : null;
}

export function setPointerParallax(x, y) { pointerPar.x = x; pointerPar.y = y; }

export function resetCamera() {
  camera.position.set(0, FRAMING.height, FRAMING.dist);
  camera.lookAt(0, FRAMING.lookY, 0);
}

function resize() {
  if (!renderer) return;
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(quality.pixelRatio);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

export function setHeartbeat(active) {
  // Background tabs reduce rendering to a low heartbeat.
  if (!active && running) { running = false; cancelAnimationFrame(rafId); }
}

export function dispose() {
  running = false;
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', resize);
  if (renderer) renderer.dispose();
}

// Late binding to avoid an import cycle (render <- rules is fine, but main
// passes snapshots only; rules are used here solely for legal previews).
import * as rulesRef from './rules.js';

export default {
  init, setTheme, setPalette, setReducedMotion, setQuality, setBoard,
  setSelection, previewTargets, clearPreview, invalidFeedback, onEvent,
  dropEffect, winEffect, pointerToPeg, setPointerParallax, resetCamera,
  settle, setHeartbeat, dispose,
};

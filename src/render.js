'use strict';

// Loop Loom — Three.js render: textile-atelier scene, brass pegs, fiber loops,
// selection/preview layers, pooled particles, quality tiers, camera.
// Rendering consumes immutable snapshots; it never mutates rules state.

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mulberry32 } from './rules.js';
import { getTheme, PALETTES } from './content.js';
import { detectPreset, describe, resolve, SHADOW_MAP, PARTICLE_BUDGET } from './gfx.js';

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
// Resolved graphics settings (see gfx.js). Headless/software GPUs resolve to Low.
let q = resolve({}, 'low');
let gpuName = '';
let detected = 'balanced';
let savedGfx = {};
let composer = null;
let gradePass = null;
let postKey = null;
let postFailed = false;
let envTexture = null;
let keyLight = null;
let keyBase = 2.2;
let dust = null;
let adaptiveScale = 1;
let pixelRatio = 1;
let frameTimes = [];
let fps = 0;
let lastSize = [0, 0];
let materialCache = new Map();

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
const camBase = new THREE.Vector3(0, FRAMING.height, FRAMING.dist); // fitted per viewport (fitCamera)
let currentPegCount = 5;
const LOOP_SPACING = 0.34;
const LOOP_R = 0.3, LOOP_TUBE = 0.115;
const PEG_H = 2.6;

const tmpV = new THREE.Vector3();

// Woven linen scan (assets/linen-weave.webp) applied to the table and mat.
// Loaded once, lazily; if the fetch or decode fails the flat theme colors
// simply stay in place, so the scene never depends on the asset.
let weaveTexture = null;
let weaveRequested = false;
const weaveWaiters = [];
function requestWeave(cb) {
  if (weaveTexture) { cb(weaveTexture); return; }
  weaveWaiters.push(cb);
  if (weaveRequested) return;
  weaveRequested = true;
  try {
    new THREE.TextureLoader().load('assets/linen-weave.webp', (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      weaveTexture = tex;
      while (weaveWaiters.length) weaveWaiters.pop()(tex);
    }, undefined, () => { weaveWaiters.length = 0; });
  } catch { weaveWaiters.length = 0; }
}

// Procedural yarn twist: diagonal plies, used as a colour modulation and bump
// map on detailed loops so the torus reads as spun fibre rather than plastic.
let yarnTexture = null;
function getYarnTexture() {
  if (yarnTexture || typeof document === 'undefined') return yarnTexture;
  const c = document.createElement('canvas');
  c.width = 128; c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = '#e6e6e6';
  g.fillRect(0, 0, 128, 32);
  for (let x = -32; x < 160; x += 8) {
    const grad = g.createLinearGradient(x, 0, x + 8, 0);
    grad.addColorStop(0, '#bdbdbd'); grad.addColorStop(0.5, '#ffffff'); grad.addColorStop(1, '#bdbdbd');
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(x, 32); g.lineTo(x + 6, 32); g.lineTo(x + 6 + 16, 0); g.lineTo(x + 16, 0);
    g.closePath(); g.fill();
  }
  // Loose fibre fuzz.
  const rng = mulberry32(0x7A2B);
  for (let i = 0; i < 220; i++) {
    g.fillStyle = `rgba(255,255,255,${0.08 + rng() * 0.12})`;
    g.fillRect(rng() * 128, rng() * 32, 1 + rng() * 3, 1);
  }
  yarnTexture = new THREE.CanvasTexture(c);
  yarnTexture.wrapS = yarnTexture.wrapT = THREE.RepeatWrapping;
  yarnTexture.repeat.set(10, 1);
  yarnTexture.anisotropy = 4;
  return yarnTexture;
}

// Soft round sprite for particles and dust motes.
let softDot = null;
function getSoftDot() {
  if (softDot || typeof document === 'undefined') return softDot;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  softDot = new THREE.CanvasTexture(c);
  softDot.colorSpace = THREE.SRGBColorSpace;
  return softDot;
}

const detailed = () => q.detail === 'detailed';

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
    new THREE.MeshStandardMaterial({ color: theme.floor, roughness: 0.9, metalness: 0.05, envMapIntensity: 0.25 }));
  table.position.y = -0.25;
  table.receiveShadow = true;
  env.add(table);
  requestWeave((tex) => {
    const t = tex.clone();
    t.needsUpdate = true;
    t.repeat.set(8, 5);
    table.material.map = t;
    table.material.needsUpdate = true;
  });

  // Woven mat under the pegs.
  const mat = new THREE.Mesh(
    new THREE.CylinderGeometry(5.6, 5.9, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(theme.floor).multiplyScalar(1.25), roughness: 1, envMapIntensity: 0.25 }));
  mat.position.y = 0.04;
  mat.receiveShadow = true;
  env.add(mat);
  requestWeave((tex) => {
    const t = tex.clone();
    t.needsUpdate = true;
    t.repeat.set(3, 3);
    mat.material.map = t;
    mat.material.needsUpdate = true;
  });

  // Background spools and shelf props (procedural, decorative).
  for (let i = 0; i < 7; i++) {
    const r = decorRng();
    const h = 0.5 + decorRng() * 0.5;
    const spool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22 + r * 0.15, 0.22 + r * 0.15, h, detailed() ? 28 : 14),
      detailed() ? yarnMaterial(i % palette.length, 0.5) : new THREE.MeshStandardMaterial({ color: new THREE.Color(palette[i % palette.length]), roughness: 0.85 }));
    spool.position.set(-7 + decorRng() * 14, 0.3, -4.5 - decorRng() * 2);
    spool.castShadow = true;
    env.add(spool);
    if (detailed()) {
      // Wooden flanges top and bottom.
      const wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.7, envMapIntensity: 0.3 });
      for (const sgn of [-1, 1]) {
        const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.3 + r * 0.15, 0.3 + r * 0.15, 0.05, 28), wood);
        fl.position.set(spool.position.x, spool.position.y + sgn * h / 2, spool.position.z);
        fl.castShadow = true;
        env.add(fl);
      }
    }
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
  const mat = detailed() ? yarnMaterial(colorIdx, 1) : cachedMaterial('loop-' + colorIdx, () => new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette[colorIdx % palette.length]),
    roughness: 0.75, metalness: 0.05,
  }));
  const ring = new THREE.Mesh(detailed() ? loopGeoDetailed() : loopGeoPlain(), mat);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  ring.receiveShadow = detailed();
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
  const stitch = new THREE.Mesh(markerGeo, cachedMaterial('stitch', () => new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.6 })));
  stitch.position.set(LOOP_R, LOOP_TUBE * 0.6, 0);
  group.add(stitch);
  return group;
}

// Materials are shared per colour/tier and dropped when palette, theme or detail change.
function cachedMaterial(key, make) {
  let m = materialCache.get(key);
  if (!m) { m = make(); materialCache.set(key, m); }
  return m;
}
function clearMaterialCache() {
  for (const m of materialCache.values()) m.dispose();
  materialCache = new Map();
}

// Spun-yarn look: sheen for the fibre fuzz, twist texture as colour + bump.
function yarnMaterial(colorIdx, repeatU) {
  return cachedMaterial(`yarn-${colorIdx}-${repeatU}`, () => {
    const col = new THREE.Color(palette[colorIdx % palette.length]);
    const tex = getYarnTexture();
    let map = tex;
    if (tex && repeatU !== 1) { map = tex.clone(); map.repeat.set(10 * repeatU, 1); map.needsUpdate = true; }
    return new THREE.MeshPhysicalMaterial({
      color: col, roughness: 0.78, metalness: 0,
      map: map || null, bumpMap: map || null, bumpScale: 1.2,
      sheen: 1, sheenRoughness: 0.45, sheenColor: col.clone().lerp(new THREE.Color(0xffffff), 0.45),
      envMapIntensity: 0.45,
    });
  });
}

let geoCache = {};
function loopGeoPlain() { return geoCache.plain || (geoCache.plain = new THREE.TorusGeometry(LOOP_R, LOOP_TUBE, 10, 20)); }
function loopGeoDetailed() { return geoCache.detailed || (geoCache.detailed = new THREE.TorusGeometry(LOOP_R, LOOP_TUBE, 22, 44)); }

function brassMaterial() {
  return cachedMaterial('brass', () => detailed()
    ? new THREE.MeshPhysicalMaterial({ color: theme.brass, metalness: 0.95, roughness: 0.26, clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 0.85 })
    : new THREE.MeshStandardMaterial({ color: theme.brass, metalness: 0.85, roughness: 0.35 }));
}

function makePeg(x) {
  const g = new THREE.Group();
  const brass = brassMaterial();
  const seg = detailed() ? 28 : 14;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, PEG_H, seg), brass);
  stem.position.y = PEG_H / 2;
  stem.castShadow = true;
  g.add(stem);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, detailed() ? 24 : 12, detailed() ? 18 : 10), brass);
  knob.position.y = PEG_H + 0.08;
  knob.castShadow = true;
  g.add(knob);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.12, detailed() ? 40 : 20), brass);
  base.position.y = 0.06;
  base.castShadow = detailed();
  base.receiveShadow = true;
  g.add(base);
  if (detailed()) {
    // A turned collar where the stem meets the base.
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 10, 28), brass);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.14;
    g.add(collar);
  }
  g.position.x = x;
  return g;
}

function disposeGeometries(root) {
  root.traverse((o) => {
    if (o.geometry && o.geometry !== geoCache.plain && o.geometry !== geoCache.detailed) o.geometry.dispose();
  });
}

function makeGroundMarker(x, legal) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.56, 24),
    new THREE.MeshBasicMaterial({ color: legal ? 0x7fe08a : 0xe07f7f, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.1, 0);
  m.layers.set(LAYER_MARKER);
  m.visible = false; // shown only while it marks a legal target
  return m;
}

function buildBoard(state) {
  if (boardGroup) {
    scene.remove(boardGroup);
    disposeGeometries(boardGroup);
  }
  boardGroup = new THREE.Group();
  boardGroup.name = 'board';
  pegMeshes = [];
  pegTargets = [];
  markers = [];
  loopPool = [];
  const count = state.pegs.length;
  if (count !== currentPegCount) { currentPegCount = count; fitCamera(); fitShadow(); }
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
  selectRing.visible = !!(selection && selection.peg < count);
  if (selectRing.visible) selectRing.position.x = pegX(selection.peg, count);
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
  const col = new Float32Array(max * 3).fill(1);
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setDrawRange(0, 0);
  const points = new THREE.Points(geo, new THREE.PointsMaterial());
  points.frustumCulled = false;
  points.layers.set(LAYER_FX);
  scene.add(points);
  particlePool = { points, alive: [], max };
  styleParticles();
}

// Low: the original small flat flecks. High: soft additive sparks in the
// completed peg's yarn colour (they are what bloom picks up).
function styleParticles() {
  if (!particlePool) return;
  const old = particlePool.points.material;
  const high = q.particles === 'high';
  particlePool.points.material = high
    ? new THREE.PointsMaterial({ size: 0.11, map: getSoftDot(), vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending })
    : new THREE.PointsMaterial({ color: 0xffe6b0, size: 0.05, transparent: true, opacity: 0.9 });
  old.dispose();
}

const WARM = new THREE.Color(0xffe6b0);
function spawnParticles(x, y, z, n, spread, colorIdx) {
  if (reducedMotion || !particlePool) return;
  n = Math.min(n, PARTICLE_BUDGET[q.particles] - particlePool.alive.length);
  const base = colorIdx != null ? new THREE.Color(palette[colorIdx % palette.length]) : WARM;
  for (let i = 0; i < n; i++) {
    const c = decorRng() < 0.35 ? WARM : base;
    particlePool.alive.push({
      x, y, z,
      vx: (decorRng() - 0.5) * spread, vy: 0.6 + decorRng() * 1.2, vz: (decorRng() - 0.5) * spread,
      life: 0.7 + decorRng() * 0.5,
      r: c.r * 1.6, g: c.g * 1.6, b: c.b * 1.6,
    });
  }
}

// Ambient dust motes drifting through the lamp light (background: animated).
function buildDust() {
  const n = 70;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3);
  const seed = [];
  const rng = mulberry32(0xD057);
  for (let i = 0; i < n; i++) {
    // Behind and around the peg row only, never between the pegs and the camera.
    const s = { x: -7 + rng() * 14, y: 0.3 + rng() * 5, z: -6 + rng() * 5.5, ph: rng() * 6.28, sp: 0.04 + rng() * 0.08 };
    seed.push(s);
    pos.set([s.x, s.y, s.z], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: 0.05, map: getSoftDot(), color: 0xffe2b8, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.layers.set(LAYER_FX);
  scene.add(pts);
  dust = { points: pts, seed, t: 0 };
}

function stepAmbient(dt) {
  const animated = q.background === 'animated';
  if (dust) dust.points.visible = animated;
  if (!animated || reducedMotion) { if (keyLight) keyLight.intensity = keyBase; return; }
  if (dust) {
    dust.t += dt;
    const attr = dust.points.geometry.attributes.position;
    for (let i = 0; i < dust.seed.length; i++) {
      const s = dust.seed[i];
      let y = s.y + ((dust.t * s.sp) % 5.2);
      if (y > 5.4) y -= 5.2;
      attr.setXYZ(i, s.x + Math.sin(dust.t * 0.3 + s.ph) * 0.25, y, s.z + Math.cos(dust.t * 0.25 + s.ph) * 0.2);
    }
    attr.needsUpdate = true;
  }
  // Lamp shimmer: a slow, shallow breathing of the key light.
  if (keyLight) {
    const t = dust ? dust.t : 0;
    keyLight.intensity = keyBase * (1 + 0.035 * Math.sin(t * 0.8) + 0.015 * Math.sin(t * 2.7 + 1.3));
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
  const cattr = particlePool.points.geometry.attributes.color;
  for (let i = 0; i < particlePool.max; i++) {
    if (i < alive.length) {
      const p = alive[i];
      attr.setXYZ(i, p.x, p.y, p.z);
      const f = Math.min(1, p.life * 1.5);
      cattr.setXYZ(i, p.r * f, p.g * f, p.b * f);
    } else break;
  }
  // Only live particles are drawn (no parked points under the table).
  particlePool.points.geometry.setDrawRange(0, alive.length);
  attr.needsUpdate = true;
  cattr.needsUpdate = true;
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
        disposeGeometries(ch);
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
      spawnParticles(pegX(i, count), 1.2, 0, 40, 1.6, state.pegs[i][0]);
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
  if (ready() && currentState) syncLoops(currentState, false);
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  detectGpu();
  q = resolve(savedGfx, detected);
  renderer.shadowMap.enabled = SHADOW_MAP[q.shadows] > 0;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(FRAMING.fov, 1, 0.1, 100);
  camera.layers.enable(LAYER_GAME);
  camera.layers.enable(LAYER_MARKER);
  camera.layers.enable(LAYER_FX);
  // A fresh context: every GPU-side cache and the old board belong to the previous one.
  boardGroup = null;
  composer = null; gradePass = null; postKey = null; postFailed = false;
  envTexture = null; dust = null; particlePool = null;
  clearMaterialCache();
  geoCache = {};

  applyTheme(theme);
  buildParticles();
  buildDust();
  applyReflections();
  resetCamera();

  window.addEventListener('resize', resize);
  resize();
  running = true;
  let last = performance.now();
  const loop = () => {
    if (!running) return;
    const now = performance.now();
    const ms = Math.min(250, now - last);
    last = now;
    const dt = Math.min(0.05, ms / 1000);
    stepTweens(dt);
    stepParticles(dt);
    stepAmbient(dt);
    // Ground-marker pulse.
    const t = now / 1000;
    for (const m of markers) {
      if (m.userData.active) m.material.opacity = 0.35 + Math.sin(t * 4) * 0.15;
    }
    // The camera is assigned every frame from the immutable fitted base plus
    // bounded shake and parallax offsets, so nothing accumulates between frames.
    camera.position.copy(camBase);
    if (shakeAmp > 0.0005 && !reducedMotion) {
      camera.position.x += (decorRng() - 0.5) * shakeAmp;
      camera.position.y += (decorRng() - 0.5) * shakeAmp;
      shakeAmp *= 0.85;
    }
    if (!reducedMotion) {
      const px = Math.max(-0.5, Math.min(0.5, pointerPar.x)), py = Math.max(-0.5, Math.min(0.5, pointerPar.y));
      camera.position.x += px * 0.6;
      camera.position.y += py * 0.4;
    }
    camera.lookAt(0, FRAMING.lookY, 0);
    renderFrame(ms);
    rafId = requestAnimationFrame(loop);
  };
  loopFn = loop;
  loop();
}
let loopFn = null;

function detectGpu() {
  gpuName = '';
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    gpuName = String((ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '');
  } catch { gpuName = ''; }
  const mobile = typeof navigator !== 'undefined' &&
    ((navigator.maxTouchPoints > 0 && typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) ||
     /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || ''));
  detected = detectPreset(gpuName, { mobile });
}

// Key light shadow box fitted to the peg row and the mat, not the whole table.
function fitShadow() {
  if (!keyLight) return;
  const halfW = Math.abs(pegX(0, currentPegCount || 5)) + 1.4;
  const cam = keyLight.shadow.camera;
  const ext = Math.max(halfW, 3.2);
  cam.left = -ext; cam.right = ext;
  cam.top = 4.2; cam.bottom = -3.4;
  cam.near = 4; cam.far = 20;
  cam.updateProjectionMatrix();
}

function applyTheme(th) {
  theme = th;
  scene.background = new THREE.Color(th.bg);
  scene.fog = new THREE.Fog(th.bg, 14, 30);
  // Theme colours live in cached materials (brass, spools): rebuild them.
  clearMaterialCache();
  // Rebuild lights: one dominant key, soft environment fill, contact grounding.
  for (const l of scene.children.filter((o) => o.isLight)) scene.remove(l);
  keyBase = 2.2;
  const key = new THREE.DirectionalLight(th.key, keyBase);
  key.position.set(4, 8, 5);
  const size = SHADOW_MAP[q.shadows];
  key.castShadow = size > 0;
  key.shadow.mapSize.set(size || 1024, size || 1024);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  scene.add(key);
  scene.add(key.target);
  keyLight = key;
  fitShadow();
  scene.add(new THREE.HemisphereLight(th.ambient, th.bg, 0.7));
  const rim = new THREE.DirectionalLight(th.ambient, 0.5);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  // Rebuild environment with new theme colors.
  const old = scene.getObjectByName('environment');
  if (old) { scene.remove(old); disposeGeometries(old); }
  scene.add(buildEnvironment());
  // Pegs carry the theme's brass: rebuild the board when one is up.
  if (boardGroup && currentState) buildBoard(currentState);
}

// Image-based lighting: a prefiltered studio room gives brass real reflections.
function applyReflections() {
  if (!renderer || !scene) return;
  if (q.reflections === 'on') {
    if (!envTexture) {
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();
      } catch { envTexture = null; }
    }
    scene.environment = envTexture;
    scene.environmentIntensity = 0.38;
  } else {
    scene.environment = null;
  }
}

// True once init() built a live WebGL scene. When WebGL is unavailable the
// public API becomes inert so the accessible DOM board stays fully playable.
function ready() { return !!(renderer && scene && camera); }

export function setTheme(themeId) {
  theme = getTheme(themeId);
  if (ready()) applyTheme(theme);
}

export function setPalette(palId) {
  const next = PALETTES[palId] || PALETTES.default;
  if (next === palette) return;
  palette = next;
  if (ready()) applyTheme(theme); // spools and loop materials carry palette colours
  if (ready() && currentState) {
    for (const rec of loopPool) rec.colorIdx = -1; // force rebuild
    syncLoops(currentState, false);
  }
}

export function setReducedMotion(v) {
  reducedMotion = !!v;
  if (reducedMotion) { settle(); shakeAmp = 0; if (particlePool) particlePool.alive.length = 0; }
}

// Legacy tier names (auto/low/medium/high) map onto the new presets.
export function setQuality(tier) {
  const map = { low: 'low', medium: 'balanced', balanced: 'balanced', high: 'high', ultra: 'ultra' };
  setGraphics(Object.assign({}, savedGfx, { preset: map[tier] || 'auto' }));
}

/** Apply saved graphics settings ({ preset, render_scale, adaptive, show_fps, <category> }). */
export function setGraphics(saved) {
  const prev = q;
  savedGfx = Object.assign({}, saved || {});
  q = resolve(savedGfx, detected);
  adaptiveScale = 1;
  frameTimes = [];
  postKey = null; // rebuild the post chain on the next frame
  fpsVisible(q.showFps);
  if (typeof document !== 'undefined' && document.body) {
    document.body.dataset.gfxPreset = q.preset;
    document.body.dataset.gfxBackground = q.background;
  }
  if (canvas) canvas.dataset.gfxPreset = q.preset;
  if (!ready()) return;
  const size = SHADOW_MAP[q.shadows];
  renderer.shadowMap.enabled = size > 0;
  if (keyLight) {
    keyLight.castShadow = size > 0;
    if (size > 0 && keyLight.shadow.mapSize.x !== size) {
      keyLight.shadow.mapSize.set(size, size);
      if (keyLight.shadow.map) { keyLight.shadow.map.dispose(); keyLight.shadow.map = null; }
    }
  }
  applyReflections();
  if (prev.particles !== q.particles) styleParticles();
  if (prev.detail !== q.detail) {
    applyTheme(theme); // rebuilds environment, materials and board at the new detail
  }
  // Materials pick up shadow-map changes on recompile.
  scene.traverse((o) => {
    const m = o.material;
    if (!m) return;
    for (const mm of Array.isArray(m) ? m : [m]) mm.needsUpdate = true;
  });
}

/** What the Graphics panel shows: GPU, auto choice, resolved tiers, cost and frame rate. */
export function graphicsInfo(t) {
  const px = [Math.round(lastSize[0] * pixelRatio), Math.round(lastSize[1] * pixelRatio)];
  return {
    gpu: gpuName || 'unknown GPU',
    detected,
    resolved: q,
    summary: describe(q, ready() ? px : null, t),
    fps: Math.round(fps),
    adaptiveScale: Math.round(adaptiveScale * 100) / 100,
    postFailed,
    webgl: ready(),
  };
}

function fpsVisible(on) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById('fps-meter');
  if (on && !el) {
    el = document.createElement('div');
    el.id = 'fps-meter';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = '— fps';
    (document.getElementById('app') || document.body).append(el);
  }
  if (el) el.hidden = !on;
}

// Colour grade + vignette (display-space colours in, display-space out).
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uAmount: { value: 1.0 }, uVignette: { value: 0.28 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uAmount; uniform float uVignette;
    varying vec2 vUv;
    void main() {
      vec4 src = texture2D(tDiffuse, vUv);
      vec3 c = src.rgb;
      vec3 lc = clamp(c, 0.0, 1.0);
      // Gentle S-curve, a touch more saturation for the dyed yarn, warm highlights / cool shadows.
      vec3 s = mix(lc, lc * lc * (3.0 - 2.0 * lc), 0.22);
      float l = dot(s, vec3(0.299, 0.587, 0.114));
      s = mix(vec3(l), s, 1.1);
      s *= mix(vec3(0.97, 0.98, 1.04), vec3(1.05, 1.0, 0.94), smoothstep(0.2, 0.8, l));
      s = s * 0.97 + 0.02;
      c = mix(c, s + max(c - 1.0, 0.0), uAmount);
      float d = length((vUv - 0.5) * vec2(1.0, 0.9));
      c *= 1.0 - uVignette * smoothstep(0.32, 0.85, d);
      gl_FragColor = vec4(c, src.a);
    }`,
};

function currentPostKey(w, h) {
  return q.post ? [q.ao, q.bloom, q.grade, q.antialias, w, h, pixelRatio].join('|') : 'none';
}

function buildPost(w, h) {
  if (composer) { composer.dispose(); composer = null; }
  gradePass = null;
  if (!q.post) return;
  const pw = Math.max(1, Math.round(w * pixelRatio)), ph = Math.max(1, Math.round(h * pixelRatio));
  try {
    const target = new THREE.WebGLRenderTarget(pw, ph, {
      type: THREE.HalfFloatType, samples: q.antialias === 'msaa' ? 4 : 0,
    });
    const c = new EffectComposer(renderer, target);
    c.setPixelRatio(pixelRatio);
    c.setSize(w, h);
    c.addPass(new RenderPass(scene, camera));
    if (q.ao !== 'off') {
      const ao = new GTAOPass(scene, camera, pw, ph);
      ao.output = GTAOPass.OUTPUT.Default;
      ao.blendIntensity = 0.75;
      ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.4, thickness: 1.0, scale: 1.0, samples: q.ao === 'high' ? 16 : 8 });
      ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: q.ao === 'high' ? 6 : 4, rings: 2, samples: q.ao === 'high' ? 16 : 8 });
      c.addPass(ao);
    }
    if (q.bloom === 'on') {
      // High threshold: only sparks, glints on brass and the lift ring bloom.
      c.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.32, 0.5, 0.9));
    }
    if (q.grade === 'on') {
      gradePass = new ShaderPass(GradeShader);
      c.addPass(gradePass);
    }
    c.addPass(new OutputPass());
    if (q.antialias === 'smaa') c.addPass(new SMAAPass(pw, ph));
    if (q.antialias === 'fxaa') {
      const fxaa = new ShaderPass(FXAAShader);
      fxaa.material.uniforms.resolution.value.set(1 / pw, 1 / ph);
      c.addPass(fxaa);
    }
    composer = c;
    postFailed = false;
  } catch {
    // Post-processing is an enhancement: render directly if the chain cannot be built.
    postFailed = true;
    composer = null;
  }
}

// Adaptive resolution: step the render scale down when frames are slow, back up when fast.
function adapt(ms) {
  frameTimes.push(ms);
  if (frameTimes.length < 90) return false;
  const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  frameTimes.length = 0;
  fps = 1000 / avg;
  const el = typeof document !== 'undefined' && document.getElementById('fps-meter');
  if (el && !el.hidden) el.textContent = `${Math.round(fps)} fps · ${Math.round(pixelRatio * 100) / 100}×`;
  if (!q.adaptive) return false;
  const before = adaptiveScale;
  if (avg > 26) adaptiveScale = Math.max(0.6, adaptiveScale - 0.1);
  else if (avg < 14 && adaptiveScale < 1) adaptiveScale = Math.min(1, adaptiveScale + 0.05);
  return before !== adaptiveScale;
}

function renderFrame(ms) {
  const rescale = adapt(ms);
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, q.cap) * q.scale * (q.adaptive ? adaptiveScale : 1);
  if (w !== lastSize[0] || h !== lastSize[1] || ratio !== pixelRatio || rescale) {
    lastSize = [w, h];
    pixelRatio = ratio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
  }
  const key = currentPostKey(w, h);
  if (key !== postKey) {
    postKey = key;
    buildPost(w, h);
  }
  if (composer) {
    try { composer.render(ms / 1000); return; } catch { postFailed = true; composer = null; }
  }
  renderer.render(scene, camera);
}

export function setBoard(state) {
  currentState = state;
  if (!ready()) return;
  if (!boardGroup || pegTargets.length !== state.pegs.length ||
      (loopPool.length && loopPool[loopPool.length - 1].level + 1 !== state.cap)) {
    buildBoard(state);
  } else {
    syncLoops(state, true);
  }
}

export function setSelection(sel) {
  selection = sel; // { peg, size } | null
  if (!ready()) return;
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
    m.visible = legal.has(i);
    if (!legal.has(i)) m.material.opacity = 0;
  });
}

export function clearPreview() {
  markers.forEach((m) => { m.userData.active = false; m.visible = false; m.material.opacity = 0; });
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
  if (!ready() || !currentState) return;
  const p = currentState.pegs[pegIdx];
  spawnParticles(pegX(pegIdx, currentState.pegs.length), 0.4 + p.length * LOOP_SPACING, 0, 12, 0.8, p[p.length - 1]);
}

export function winEffect() {
  if (!ready() || !currentState) return;
  const n = currentState.pegs.length;
  for (let i = 0; i < n; i++) spawnParticles(pegX(i, n), 1.4, 0, 60, 2.2, currentState.pegs[i][0]);
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
  if (!camera) return;
  pointerPar.x = 0; pointerPar.y = 0;
  shakeAmp = 0;
  fitCamera();
  camera.position.copy(camBase);
  camera.lookAt(0, FRAMING.lookY, 0);
}

// Fit the peg row (plus stack height) into the canvas minus the bottom HUD
// band (tray + peg mirror), for any aspect ratio.
function fitCamera() {
  if (!camera || !canvas) return;
  const count = currentPegCount || 5;
  const halfW = Math.abs(pegX(0, count)) + 1.1;
  const halfH = (PEG_H + 0.6) / 2;
  const tanV = Math.tan((FRAMING.fov * Math.PI) / 360);
  let bottomFrac = 0;
  if (typeof document !== 'undefined') {
    const H = canvas.clientHeight || 1;
    const cr = canvas.getBoundingClientRect();
    for (const id of ['action-tray', 'a11y-board']) {
      const el = document.getElementById(id);
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.offsetWidth <= 1) continue;
      const r = el.getBoundingClientRect();
      if (r.width > cr.width * 0.5 || r.left < cr.left + cr.width * 0.5) bottomFrac = Math.max(bottomFrac, (cr.bottom - r.top) / H);
    }
  }
  const freeH = Math.max(0.45, 1 - Math.min(0.4, bottomFrac) - 0.04);
  const base = Math.hypot(FRAMING.dist, FRAMING.height - FRAMING.lookY);
  const needH = halfH / (tanV * freeH);
  const needW = halfW / (tanV * camera.aspect * 0.94);
  const k = Math.max(1, needH / base, needW / base);
  camBase.set(0, FRAMING.lookY + (FRAMING.height - FRAMING.lookY) * k, FRAMING.dist * k);
}

function resize() {
  if (!renderer) return;
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  fitCamera();
}

export function setHeartbeat(active) {
  // Background tabs reduce rendering to a low heartbeat.
  if (!active && running) { running = false; cancelAnimationFrame(rafId); }
  else if (active && !running && ready() && loopFn) { running = true; loopFn(); }
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
  init, setTheme, setPalette, setReducedMotion, setQuality, setGraphics, graphicsInfo, setBoard,
  setSelection, previewTargets, clearPreview, invalidFeedback, onEvent,
  dropEffect, winEffect, pointerToPeg, setPointerParallax, resetCamera,
  settle, setHeartbeat, dispose,
};

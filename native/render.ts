// The atelier on starhermit:scene, as the browser build's render.js drew it
// with three.js r169: a linen-covered table and woven mat, seven background
// spools (wooden flanges on detailed surfaces) and five loose fibre strands,
// slim tapered brass pegs with a knob, a base and (detailed) a turned collar,
// fat torus yarn loops (yarn-twist colour and bump texture on detailed
// surfaces; torus and stitch merged into one vertex-coloured mesh on Low)
// each with a bone-white stitch marker in a distinct solid per colour, ground
// rings marking legal targets and the lift origin, sparks on drops, peg
// completions and wins, dust motes and the lamp shimmer, and the camera fitted
// to the peg row above the bottom HUD band with a decaying shake and pointer
// parallax. Rendering reads rules state and never writes it.
//
// From three.js r169 (engine.minor 26): light intensities and shadow box as the page set them (the engine's
// r155+ units); canvas textures are starhermit:canvas OffscreenCanvases;
// RoomEnvironment(renderer) + PMREM give the reflections at the game's own
// environmentIntensity 0.38 (r169 let scene.environment override the
// materials' envMapIntensity, so materials keep 1); the post chain (GTAO,
// UnrealBloom threshold 0.9, the GradeShader on the linear buffer before OutputPass, FXAA / SMAA /
// MSAA) is renderer.ao / bloom / grade / antialias; the fitted orthographic
// shadow box is render.js's; MeshPhysicalMaterial's sheen
// on the yarn is not drawn by the engine (the yarn keeps its twist texture
// and bump). Peg picking intersects the camera ray with each peg's pick
// cylinder by hand (the old invisible pick meshes). Adaptive resolution, the
// pixel-ratio cap and the frame-rate readout are the runtime's.
import {
  ACESFilmicToneMapping, AdditiveBlending, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color,
  ConeGeometry, CylinderGeometry, DirectionalLight, DoubleSide, Fog, Group, HemisphereLight, Mesh, MeshBasicMaterial,
  MeshLambertMaterial, MeshPhysicalMaterial, MeshStandardMaterial, OctahedronGeometry, OrthographicCamera, PerspectiveCamera, PMREMGenerator, Points,
  PointsMaterial, Raycaster, RepeatWrapping, RingGeometry, RoomEnvironment, SphereGeometry, SRGBColorSpace, TextureLoader,
  TorusGeometry, TubeGeometry, Vector2, Vector3, mergeGeometries, renderer, scene,
  type Material, type Object3D, type Texture,
} from "starhermit:scene";
import { OffscreenCanvas } from "starhermit:canvas";
import { frame } from "starhermit:engine";
import { Content, Rules, type State, type Theme } from "./game.ts";
import type { Look } from "./quality.ts";

const PI = Math.PI;
/** render.js FRAMING: authored camera framing constants. */
const FRAMING = { dist: 7.6, height: 4.6, lookY: 0.9, fov: 40 };
const LOOP_SPACING = 0.34;
const LOOP_R = 0.3, LOOP_TUBE = 0.115;
const PEG_H = 2.6;
const PARTICLE_BUDGET = { low: 150, high: 900 };

renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const camera = new PerspectiveCamera(FRAMING.fov, 16 / 9, 0.1, 100);
renderer.camera = camera;
const camBase = new Vector3(0, FRAMING.height, FRAMING.dist);

let look: Look | null = null;
let reducedMotion = false;
let theme: Theme = Content.getTheme("atelier");
let palette: string[] = Content.PALETTES.default!;
let paletteId = "default";
let decorRng = Rules.mulberry32(0xC0FFEE);
let currentState: State | null = null;
let selection: { peg: number; size: number } | null = null;
let lastUniform = new Set<number>();
let currentPegCount = 5;
let bottomFrac = 0;
let onPegEvent: ((name: string, peg: number) => void) | null = null;

const detailed = (): boolean => !!look?.detailed;
const seg = (n: number, min = 3): number => Math.max(min, Math.round(n * (look?.budget.segments ?? 1)));
function pegX(i: number, count: number): number {
  const spacing = count > 6 ? 1.05 : 1.3;
  return (i - (count - 1) / 2) * spacing;
}

// -- textures --------------------------------------------------------------------------------------
// Woven linen scan (assets/linen-weave.webp) on the table and mat; until it loads (or if it fails) the
// flat theme colours stay.
let weave: Texture | null = null;
let weaveRequested = false;
const weaveWaiters: ((t: Texture) => void)[] = [];
function requestWeave(cb: (t: Texture) => void): void {
  if (weave) { cb(weave); return; }
  weaveWaiters.push(cb);
  if (weaveRequested) return;
  weaveRequested = true;
  new TextureLoader().load("assets/linen-weave.webp", (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    weave = tex;
    while (weaveWaiters.length) weaveWaiters.pop()!(tex);
  }, undefined, (e) => { weaveWaiters.length = 0; console.warn(`linen-weave: ${e.message}`); });
}

/** Procedural yarn twist (diagonal plies and fibre fuzz) at the budget's width, as colour and bump map. */
let yarnTex: Texture | null = null;
function yarnTexture(): Texture {
  const px = look?.budget.yarn ?? 128;
  if (yarnTex && yarnTex.width === px) return yarnTex;
  yarnTex?.dispose();
  const c = new OffscreenCanvas(px, px / 4);
  const g = c.getContext("2d");
  g.scale(px / 128, px / 128);
  g.fillStyle = "#e6e6e6";
  g.fillRect(0, 0, 128, 32);
  for (let x = -32; x < 160; x += 8) {
    const grad = g.createLinearGradient(x, 0, x + 8, 0);
    grad.addColorStop(0, "#bdbdbd"); grad.addColorStop(0.5, "#ffffff"); grad.addColorStop(1, "#bdbdbd");
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(x, 32); g.lineTo(x + 6, 32); g.lineTo(x + 22, 0); g.lineTo(x + 16, 0);
    g.closePath(); g.fill();
  }
  const rng = Rules.mulberry32(0x7A2B);
  for (let i = 0; i < 220; i++) {
    g.fillStyle = `rgba(255,255,255,${0.08 + rng() * 0.12})`;
    g.fillRect(rng() * 128, rng() * 32, 1 + rng() * 3, 1);
  }
  yarnTex = new CanvasTexture(c);
  yarnTex.wrapS = yarnTex.wrapT = RepeatWrapping;
  yarnTex.repeat.set(10, 1);
  yarnTex.anisotropy = 4;
  return yarnTex;
}

/** Soft round sprite for sparks and dust. */
const dotCanvas = new OffscreenCanvas(64, 64);
{
  const g = dotCanvas.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
}
const softDot = new CanvasTexture(dotCanvas);
softDot.colorSpace = SRGBColorSpace;

// -- materials -------------------------------------------------------------------------------------
interface MatParams {
  color?: number | Color | string; map?: Texture | null; bumpMap?: Texture | null; bumpScale?: number; roughness?: number; metalness?: number;
  vertexColors?: boolean;
}
type Mat = MeshStandardMaterial | MeshLambertMaterial;
/** render.js budgetMaterial: Lambert (Low), Standard (Balanced), Physical where `phys` is given (High/Ultra). */
function budgetMaterial(params: MatParams, phys?: { clearcoat: number; clearcoatRoughness: number }): Mat {
  const kind = look?.budget.material ?? "standard";
  if (kind === "lambert") {
    const { roughness: _r, metalness: _m, bumpMap: _b, bumpScale: _s, ...rest } = params;
    return new MeshLambertMaterial(rest);
  }
  if (kind === "physical" && phys) return new MeshPhysicalMaterial({ ...params, ...phys });
  return new MeshStandardMaterial(params);
}
let materialCache = new Map<string, Material>();
function cached<M extends Material>(key: string, make: () => M): M {
  let m = materialCache.get(key) as M | undefined;
  if (!m) { m = make(); materialCache.set(key, m); }
  return m;
}
function clearMaterialCache(): void {
  for (const m of materialCache.values()) m.dispose();
  materialCache = new Map();
}
/** Spun-yarn look: the twist texture as colour and bump (the old sheen is not drawn by the engine). */
function yarnMaterial(colorIdx: number, repeatU: number): Mat {
  return cached(`yarn-${colorIdx}-${repeatU}`, () => {
    const col = new Color(palette[colorIdx % palette.length]!);
    let map = yarnTexture();
    if (repeatU !== 1) { map = map.clone(); map.repeat.set(10 * repeatU, 1); map.needsUpdate = true; }
    return budgetMaterial({ color: col, roughness: 0.78, metalness: 0, map, bumpMap: map, bumpScale: 1.2 });
  });
}
function brassMaterial(): Mat {
  return cached("brass", () => detailed()
    ? budgetMaterial({ color: theme.brass, metalness: 0.95, roughness: 0.26 }, { clearcoat: 0.3, clearcoatRoughness: 0.2 })
    : budgetMaterial({ color: theme.brass, metalness: 0.85, roughness: 0.35 }));
}

// -- lights ----------------------------------------------------------------------------------------
let keyLight: DirectionalLight | null = null;
let keyBase = 2.2;
const lights: Object3D[] = [];
/** Key light shadow box fitted to the peg row and the mat, not the whole table (render.js fitShadow). */
function fitShadow(): void {
  if (!keyLight) return;
  const halfW = Math.abs(pegX(0, currentPegCount || 5)) + 1.4;
  const cam = keyLight.shadow.camera as OrthographicCamera;
  const ext = Math.max(halfW, 3.2);
  cam.left = -ext; cam.right = ext;
  cam.top = 4.2; cam.bottom = -3.4;
  cam.near = 4; cam.far = 20;
  cam.updateProjectionMatrix();
}
function buildLights(): void {
  for (const l of lights) scene.remove(l);
  lights.length = 0;
  keyBase = 2.2;
  const key = new DirectionalLight(theme.key, keyBase);
  key.position.set(4, 8, 5);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 3;
  keyLight = key;
  fitShadow();
  const hemi = new HemisphereLight(theme.ambient, theme.bg, 0.7);
  const rim = new DirectionalLight(theme.ambient, 0.5);
  rim.position.set(-5, 3, -4);
  lights.push(key, key.target, hemi, rim);
  for (const l of lights) scene.add(l);
  applyShadows();
}

// -- the environment -------------------------------------------------------------------------------
let envGroup: Group | null = null;
/** Marks a mesh as a shadow caster (on while the level has shadows). */
function cast<M extends Mesh>(m: M): M { m.userData.cast = true; m.castShadow = shadowsOn(); return m; }
function disposeTree(root: Object3D): void {
  root.traverse((o) => {
    const m = o as Mesh;
    if (m.geometry && !geoKeep.has(m.geometry)) m.geometry.dispose();
  });
}
function buildEnvironment(): void {
  if (envGroup) { scene.remove(envGroup); disposeTree(envGroup); }
  decorRng = Rules.mulberry32(0xC0FFEE);
  const env = new Group();
  // Table top and the woven mat under the pegs (linen weave once loaded).
  const table = new Mesh(new BoxGeometry(24, 0.5, 14), budgetMaterial({ color: theme.floor, roughness: 0.9, metalness: 0.05 }));
  table.position.y = -0.25;
  table.receiveShadow = true;
  env.add(table);
  requestWeave((tex) => { const t = tex.clone(); t.needsUpdate = true; t.repeat.set(8, 5); table.material.map = t; });
  const mat = new Mesh(new CylinderGeometry(5.6, 5.9, 0.08, seg(48, 16)),
    budgetMaterial({ color: new Color(theme.floor).multiplyScalar(1.25), roughness: 1 }));
  mat.position.y = 0.04;
  mat.receiveShadow = true;
  env.add(mat);
  requestWeave((tex) => { const t = tex.clone(); t.needsUpdate = true; t.repeat.set(3, 3); mat.material.map = t; });
  // Background spools (wooden flanges on detailed surfaces).
  for (let i = 0; i < 7; i++) {
    const r = decorRng();
    const h = 0.5 + decorRng() * 0.5;
    const spool = new Mesh(new CylinderGeometry(0.22 + r * 0.15, 0.22 + r * 0.15, h, detailed() ? seg(28, 10) : seg(14, 8)),
      detailed() ? yarnMaterial(i % palette.length, 0.5) : budgetMaterial({ color: new Color(palette[i % palette.length]!), roughness: 0.85 }));
    spool.position.set(-7 + decorRng() * 14, 0.3, -4.5 - decorRng() * 2);
    cast(spool);
    env.add(spool);
    if (detailed()) {
      const wood = budgetMaterial({ color: 0x6b4a2f, roughness: 0.7 });
      for (const sgn of [-1, 1]) {
        const fl = new Mesh(new CylinderGeometry(0.3 + r * 0.15, 0.3 + r * 0.15, 0.05, seg(28, 10)), wood);
        fl.position.set(spool.position.x, spool.position.y + sgn * h / 2, spool.position.z);
        cast(fl);
        env.add(fl);
      }
    }
  }
  // Loose fibre strands across the table.
  for (let i = 0; i < 5; i++) {
    const pts: Vector3[] = [];
    const x0 = -6 + decorRng() * 12;
    for (let k = 0; k <= 8; k++) pts.push(new Vector3(x0 + k * 0.35, 0.03, 2.5 + Math.sin(k * 1.3 + i) * 0.3 + decorRng() * 0.4));
    const tube = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), seg(24, 12), 0.02, 5),
      budgetMaterial({ color: new Color(palette[(i + 2) % palette.length]!), roughness: 1 }));
    env.add(tube);
  }
  envGroup = env;
  scene.add(env);
  applyShadows();
}

// -- loops -----------------------------------------------------------------------------------------
let geoCache: Record<string, BufferGeometry> = {};
const geoKeep = new Set<BufferGeometry>();
function keep<G extends BufferGeometry>(key: string, make: () => G): G {
  let g = geoCache[key] as G | undefined;
  if (!g) { g = make(); geoCache[key] = g; geoKeep.add(g); }
  return g;
}
function clearGeoCache(): void {
  for (const g of Object.values(geoCache)) { geoKeep.delete(g); g.dispose(); }
  geoCache = {};
}
const loopGeoPlain = (): TorusGeometry => keep("plain", () => new TorusGeometry(LOOP_R, LOOP_TUBE, seg(10, 6), seg(20, 12)));
const loopGeoDetailed = (): TorusGeometry => keep("detailed", () => new TorusGeometry(LOOP_R, LOOP_TUBE, seg(22, 8), seg(44, 16)));
/** The shape-coded stitch: crimson sphere, indigo cone, fern box, marigold octahedron, violet pyramid, ember cylinder. */
function stitchGeometry(colorIdx: number): BufferGeometry {
  switch (colorIdx % 6) {
    case 0: return new SphereGeometry(0.07, 8, 8);
    case 1: return new ConeGeometry(0.07, 0.12, 8);
    case 2: return new BoxGeometry(0.1, 0.1, 0.1);
    case 3: return new OctahedronGeometry(0.08);
    case 4: return new ConeGeometry(0.08, 0.12, 4);
    default: return new CylinderGeometry(0.06, 0.06, 0.1, 8);
  }
}
const stitchGeo = (c: number): BufferGeometry => keep(`stitch-${c % 6}`, () => stitchGeometry(c));
const STITCH_COLOR = new Color(0xf5f0e6);
/** Low (`merge`): torus and stitch merged into one vertex-coloured geometry per colour. */
function mergedLoopGeometry(colorIdx: number): BufferGeometry {
  return keep(`merged-${colorIdx}`, () => {
    const paint = (geo: BufferGeometry, color: Color): BufferGeometry => {
      const g = geo.index ? geo.toNonIndexed() : geo;
      const n = g.getAttribute("position")!.count, col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) col.set([color.r, color.g, color.b], i * 3);
      g.setAttribute("color", new BufferAttribute(col, 3));
      return g;
    };
    const ring = new TorusGeometry(LOOP_R, LOOP_TUBE, seg(10, 6), seg(20, 12)).rotateX(PI / 2);
    const stitch = stitchGeometry(colorIdx).translate(LOOP_R, LOOP_TUBE * 0.6, 0);
    return mergeGeometries([paint(ring, new Color(palette[colorIdx % palette.length]!)), paint(stitch, STITCH_COLOR)])!;
  });
}
function makeLoop(colorIdx: number): Group {
  const group = new Group();
  if (look?.budget.merge && !detailed()) {
    const mesh = new Mesh(mergedLoopGeometry(colorIdx), cached("loop-merged", () => new MeshLambertMaterial({ vertexColors: true })));
    cast(mesh);
    group.add(mesh);
    return group;
  }
  const mat = detailed() ? yarnMaterial(colorIdx, 1)
    : cached(`loop-${colorIdx}`, () => budgetMaterial({ color: new Color(palette[colorIdx % palette.length]!), roughness: 0.75, metalness: 0.05 }));
  const ring = new Mesh(detailed() ? loopGeoDetailed() : loopGeoPlain(), mat);
  ring.rotation.x = PI / 2;
  cast(ring);
  ring.receiveShadow = detailed() && shadowsOn();
  group.add(ring);
  const stitch = new Mesh(stitchGeo(colorIdx), cached("stitch", () => budgetMaterial({ color: 0xf5f0e6, roughness: 0.6 })));
  stitch.position.set(LOOP_R, LOOP_TUBE * 0.6, 0);
  group.add(stitch);
  return group;
}

// -- the board -------------------------------------------------------------------------------------
let boardGroup: Group | null = null;
let pegMeshes: Group[] = [];
interface Slot { slot: Group; peg: number; level: number; colorIdx: number }
let loopPool: Slot[] = [];
interface Marker { mesh: Mesh; mat: MeshBasicMaterial; active: boolean }
let markers: Marker[] = [];
let selectRing: Mesh | null = null;
function makePeg(x: number): Group {
  const g = new Group();
  const brass = brassMaterial();
  const sides = detailed() ? seg(28, 10) : seg(14, 8);
  const stem = new Mesh(new CylinderGeometry(0.09, 0.13, PEG_H, sides), brass);
  stem.position.y = PEG_H / 2;
  cast(stem);
  g.add(stem);
  const knob = new Mesh(new SphereGeometry(0.15, detailed() ? seg(24, 10) : seg(12, 8), detailed() ? seg(18, 8) : seg(10, 6)), brass);
  knob.position.y = PEG_H + 0.08;
  cast(knob);
  g.add(knob);
  const base = new Mesh(new CylinderGeometry(0.42, 0.5, 0.12, detailed() ? seg(40, 16) : seg(20, 12)), brass);
  base.position.y = 0.06;
  if (detailed()) cast(base);
  base.receiveShadow = true;
  g.add(base);
  if (detailed()) {
    const collar = new Mesh(new TorusGeometry(0.15, 0.035, seg(10, 6), seg(28, 12)), brass);
    collar.rotation.x = PI / 2;
    collar.position.y = 0.14;
    g.add(collar);
  }
  g.position.x = x;
  return g;
}
function buildBoard(state: State): void {
  if (boardGroup) {
    scene.remove(boardGroup);
    for (const m of markers) m.mat.dispose();
    disposeTree(boardGroup);
  }
  boardGroup = new Group();
  pegMeshes = []; markers = []; loopPool = [];
  const count = state.pegs.length;
  if (count !== currentPegCount) { currentPegCount = count; fitShadow(); }
  for (let i = 0; i < count; i++) {
    const peg = makePeg(pegX(i, count));
    boardGroup.add(peg);
    pegMeshes.push(peg);
    const mat = new MeshBasicMaterial({ color: 0x7fe08a, transparent: true, opacity: 0, side: DoubleSide });
    const mk = new Mesh(new RingGeometry(0.42, 0.56, 24), mat);
    mk.rotation.x = -PI / 2;
    mk.position.set(pegX(i, count), 0.1, 0);
    mk.visible = false;
    boardGroup.add(mk);
    markers.push({ mesh: mk, mat, active: false });
    for (let k = 0; k < state.cap; k++) {
      const slot = new Group();
      slot.position.set(pegX(i, count), 0.28 + k * LOOP_SPACING, 0);
      slot.visible = false;
      boardGroup.add(slot);
      loopPool.push({ slot, peg: i, level: k, colorIdx: -1 });
    }
  }
  selectRing = new Mesh(new RingGeometry(0.46, 0.6, 28), new MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.85, side: DoubleSide }));
  selectRing.rotation.x = -PI / 2;
  selectRing.position.y = 0.1;
  selectRing.visible = !!(selection && selection.peg < count);
  if (selection && selectRing.visible) selectRing.position.x = pegX(selection.peg, count);
  boardGroup.add(selectRing);
  scene.add(boardGroup);
  applyShadows();
  syncLoops(state, false);
}

// -- sparks and dust -------------------------------------------------------------------------------
const MAX_PARTICLES = Math.round(PARTICLE_BUDGET.high * 3);
const partGeo = new BufferGeometry();
const partPos = new Float32Array(MAX_PARTICLES * 3);
const partCol = new Float32Array(MAX_PARTICLES * 3).fill(1);
partGeo.setAttribute("position", new BufferAttribute(partPos, 3));
partGeo.setAttribute("color", new BufferAttribute(partCol, 3));
partGeo.setDrawRange(0, 0);
/** Low: small flat warm flecks. High: soft additive sparks in the yarn colour (what bloom picks up). */
const sparkLow = new PointsMaterial({ color: 0xffe6b0, size: 0.05, transparent: true, opacity: 0.9 });
const sparkHigh = new PointsMaterial({ size: 0.11, map: softDot, vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: AdditiveBlending });
const sparks = new Points(partGeo, sparkLow);
sparks.frustumCulled = false;
scene.add(sparks);
interface Spark { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; r: number; g: number; b: number }
const alive: Spark[] = [];
const WARM = new Color(0xffe6b0);
function spawnParticles(x: number, y: number, z: number, n: number, spread: number, colorIdx: number | null): void {
  if (reducedMotion || !look) return;
  const k = look.budget.sparks;
  n = Math.min(Math.round(n * k), Math.min(MAX_PARTICLES, Math.round(PARTICLE_BUDGET[look.particles] * k)) - alive.length);
  const base = colorIdx != null && colorIdx >= 0 ? new Color(palette[colorIdx % palette.length]!) : WARM;
  for (let i = 0; i < n; i++) {
    const c = decorRng() < 0.35 ? WARM : base;
    alive.push({
      x, y, z, vx: (decorRng() - 0.5) * spread, vy: 0.6 + decorRng() * 1.2, vz: (decorRng() - 0.5) * spread,
      life: 0.7 + decorRng() * 0.5, r: c.r * 1.6, g: c.g * 1.6, b: c.b * 1.6,
    });
  }
}
function stepParticles(dt: number): void {
  let w = 0;
  for (let i = 0; i < alive.length; i++) {
    const p = alive[i]!;
    p.life -= dt;
    if (p.life <= 0 || p.y < 0) continue;
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    p.vy -= 2.4 * dt;
    alive[w] = p;
    const f = Math.min(1, p.life * 1.5);
    partPos[w * 3] = p.x; partPos[w * 3 + 1] = p.y; partPos[w * 3 + 2] = p.z;
    partCol[w * 3] = p.r * f; partCol[w * 3 + 1] = p.g * f; partCol[w * 3 + 2] = p.b * f;
    w++;
  }
  alive.length = w;
  partGeo.setDrawRange(0, w);
  partGeo.getAttribute("position")!.needsUpdate = true;
  partGeo.getAttribute("color")!.needsUpdate = true;
  sparks.visible = w > 0;
}

const MAX_DUST = 180;
const dustGeo = new BufferGeometry();
const dustPos = new Float32Array(MAX_DUST * 3);
const dustSeed: { x: number; y: number; z: number; ph: number; sp: number }[] = [];
{
  const rng = Rules.mulberry32(0xD057);
  for (let i = 0; i < MAX_DUST; i++) {
    // Behind and around the peg row only, never between the pegs and the camera.
    const s = { x: -7 + rng() * 14, y: 0.3 + rng() * 5, z: -6 + rng() * 5.5, ph: rng() * 6.28, sp: 0.04 + rng() * 0.08 };
    dustSeed.push(s);
    dustPos.set([s.x, s.y, s.z], i * 3);
  }
}
dustGeo.setAttribute("position", new BufferAttribute(dustPos, 3));
const dust = new Points(dustGeo, new PointsMaterial({ size: 0.05, map: softDot, color: 0xffe2b8, transparent: true, opacity: 0.4, depthWrite: false, blending: AdditiveBlending }));
dust.frustumCulled = false;
scene.add(dust);
let ambientT = 0;
function stepAmbient(dt: number): void {
  const animated = !!look?.animated;
  const n = Math.min(MAX_DUST, look?.budget.dust ?? 0);
  dust.visible = animated && n > 0;
  dustGeo.setDrawRange(0, n);
  if (!animated || reducedMotion) { if (keyLight) keyLight.intensity = keyBase; return; }
  ambientT += dt;
  for (let i = 0; i < n; i++) {
    const s = dustSeed[i]!;
    let y = s.y + ((ambientT * s.sp) % 5.2);
    if (y > 5.4) y -= 5.2;
    dustPos[i * 3] = s.x + Math.sin(ambientT * 0.3 + s.ph) * 0.25;
    dustPos[i * 3 + 1] = y;
    dustPos[i * 3 + 2] = s.z + Math.cos(ambientT * 0.25 + s.ph) * 0.2;
  }
  dustGeo.getAttribute("position")!.needsUpdate = true;
  // Lamp shimmer: a slow, shallow breathing of the key light.
  if (keyLight) keyLight.intensity = keyBase * (1 + 0.035 * Math.sin(ambientT * 0.8) + 0.015 * Math.sin(ambientT * 2.7 + 1.3));
}

// -- state → view ----------------------------------------------------------------------------------
interface Tween { vec: Vector3; from: Vector3; to: Vector3; t: number; dur: number }
const tweens: Tween[] = [];
function addTween(vec: Vector3, to: Vector3, dur: number): void {
  const i = tweens.findIndex((t) => t.vec === vec);
  if (i >= 0) tweens.splice(i, 1);
  tweens.push({ vec, from: vec.clone(), to, t: 0, dur });
}
function stepTweens(dt: number): void {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i]!;
    t.t += dt;
    const k = Math.min(1, t.t / t.dur);
    const e = 1 - Math.pow(1 - k, 3); // ease-out cubic
    t.vec.copy(t.from).lerp(t.to, e);
    if (k >= 1) tweens.splice(i, 1);
  }
}
let shakeAmp = 0;
function syncLoops(state: State, animate: boolean): void {
  currentState = state;
  const count = state.pegs.length;
  for (const rec of loopPool) {
    const pegArr = state.pegs[rec.peg]!;
    const has = rec.level < pegArr.length;
    rec.slot.visible = has;
    if (!has) { rec.colorIdx = -1; continue; }
    const c = pegArr[rec.level]!;
    if (rec.colorIdx !== c) {
      for (const ch of [...rec.slot.children]) { rec.slot.remove(ch); disposeTree(ch); }
      rec.slot.add(makeLoop(c));
      rec.colorIdx = c;
    }
    const lifted = !!selection && selection.peg === rec.peg && rec.level >= pegArr.length - selection.size;
    const to = new Vector3(pegX(rec.peg, count), 0.28 + rec.level * LOOP_SPACING + (lifted ? 1.1 : 0), 0);
    if (animate && !reducedMotion) addTween(rec.slot.position, to, 0.28);
    else rec.slot.position.copy(to);
  }
  // Peg completion: the cue, a burst in the peg's colour and a small shake.
  const uniformNow = new Set<number>();
  state.pegs.forEach((p, i) => { if (p.length >= 2 && p.every((c) => c === p[0])) uniformNow.add(i); });
  for (const i of uniformNow) {
    if (lastUniform.has(i)) continue;
    onPegEvent?.("complete-peg", i);
    spawnParticles(pegX(i, count), 1.2, 0, 40, 1.6, state.pegs[i]![0]!);
    if (!reducedMotion) shakeAmp = Math.max(shakeAmp, 0.05);
  }
  lastUniform = uniformNow;
}

// -- graphics level --------------------------------------------------------------------------------
let envMap: Texture | null = null;
function applyReflections(): void {
  if (!look?.reflections) { scene.environment = null; return; }
  if (!envMap) {
    try { envMap = new PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture; }
    catch (e) { console.warn(`environment: ${e instanceof Error ? e.message : String(e)}`); }
  }
  scene.environment = envMap;
  scene.environmentIntensity = 0.38;
}
const shadowsOn = (): boolean => !!look && look.shadows > 0;
function applyShadows(): void {
  const on = shadowsOn();
  renderer.shadowMap.enabled = on;
  if (keyLight) { keyLight.castShadow = on; if (on) keyLight.shadow.mapSize = look!.shadows; }
  scene.traverse((o) => { if (o.userData.cast) (o as Mesh).castShadow = on; });
}
function applyTheme(): void {
  scene.background = new Color(theme.bg);
  scene.fog = new Fog(theme.bg, 14, 30);
  clearMaterialCache();
  buildLights();
  buildEnvironment();
  if (currentState) { for (const r of loopPool) r.colorIdx = -1; buildBoard(currentState); }
}
/** The graphics level's look (quality.ts): post effects at once; materials, geometry LOD and the board rebuilt
 * when the budget changes. */
export function applyLook(next: Look): void {
  if (look && JSON.stringify(look) === JSON.stringify(next)) return;
  const before = look;
  look = next;
  renderer.ao = next.ao === "off" ? null : {
    blendIntensity: 0.75, radius: 0.5, distanceExponent: 1.4, thickness: 1.0, scale: 1.0, samples: next.ao === "high" ? 16 : 8, resolution: next.budget.aoRes,
    denoise: { lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: next.ao === "high" ? 6 : 4, rings: 2, samples: next.ao === "high" ? 16 : 8, radiusExponent: 2 },
  };
  // High threshold: only sparks, glints on brass and the lift ring bloom.
  // r169 page: UnrealBloomPass 0.32 → 0.32² at minor 29 (r185 bloom).
  renderer.bloom = next.bloom ? { strength: 0.32 * 0.32, radius: 0.5, threshold: 0.9, resolution: next.budget.bloomRes } : null;
  // render.js GradeShader (before OutputPass, so on linear light): a 0.22 S-curve, +10 % saturation, warm
  // highlights / cool shadows, the s * 0.97 + 0.02 lift with over-range light kept, the 0.28 vignette.
  renderer.grade = next.grade ? {
    space: "linear", contrast: 0.22, saturation: 1.1, levels: [0.97, 0.02], overRange: "keep",
    shadows: [0.97, 0.98, 1.04], highlights: [1.05, 1.0, 0.94], split: [0.2, 0.8],
    vignette: { amount: 0.28, inner: 0.32, outer: 0.85, scale: [1, 0.9] },
  } : null;
  renderer.antialias = next.antialias;
  sparks.material = next.particles === "high" ? sparkHigh : sparkLow;
  const b = before?.budget, nb = next.budget;
  if (!before || before.detailed !== next.detailed || b!.material !== nb.material || b!.segments !== nb.segments || b!.yarn !== nb.yarn || b!.merge !== nb.merge) {
    clearGeoCache();
    applyTheme();
  } else applyShadows();
  applyReflections();
}
export function setReducedMotion(on: boolean): void {
  reducedMotion = on;
  if (on) { settle(); shakeAmp = 0; alive.length = 0; }
}
export function setTheme(id: string): void {
  const t = Content.getTheme(id);
  if (t.id === theme.id) return;
  theme = t;
  if (look) applyTheme();
}
export function setPalette(id: string): void {
  if (id === paletteId) return;
  paletteId = id;
  palette = Content.PALETTES[id] ?? Content.PALETTES.default!;
  for (const k of Object.keys(geoCache)) if (k.startsWith("merged-")) { const g = geoCache[k]!; geoKeep.delete(g); g.dispose(); delete geoCache[k]; }
  if (look) applyTheme();
}
export function onEvent(fn: (name: string, peg: number) => void): void { onPegEvent = fn; }
/** Shows a board: rebuilt when the peg count or capacity changes, else the loops tween to their places. */
export function setBoard(state: State): void {
  const rebuild = !boardGroup || pegMeshes.length !== state.pegs.length || (loopPool.length && loopPool[loopPool.length - 1]!.level + 1 !== state.cap);
  currentState = state;
  if (!look) return;
  if (rebuild) {
    lastUniform = new Set(state.pegs.flatMap((p, i) => (p.length >= 2 && p.every((c) => c === p[0]) ? [i] : [])));
    buildBoard(state);
  } else syncLoops(state, true);
}
/** A new round: the board without the completion cues for pegs that start uniform. */
export function resetBoard(state: State): void {
  lastUniform = new Set(state.pegs.flatMap((p, i) => (p.length >= 2 && p.every((c) => c === p[0]) ? [i] : [])));
  tweens.length = 0;
  selection = null;
  if (selectRing) selectRing.visible = false;
  currentState = state;
  if (!look) return;
  if (!boardGroup || pegMeshes.length !== state.pegs.length) buildBoard(state);
  else syncLoops(state, false);
}
export function setSelection(sel: { peg: number; size: number } | null): void {
  selection = sel;
  if (selectRing) {
    selectRing.visible = !!sel;
    if (sel && currentState) selectRing.position.x = pegX(sel.peg, currentState.pegs.length);
  }
  if (currentState && look) syncLoops(currentState, false);
}
export function previewTargets(state: State, fromPeg: number | null): void {
  const legal = new Set<number>();
  if (fromPeg != null) for (const a of Rules.legalActions(state)) if (a.from === fromPeg) legal.add(a.to);
  markers.forEach((m, i) => { m.active = legal.has(i); m.mesh.visible = m.active; if (!m.active) m.mat.opacity = 0; });
}
export function clearPreview(): void { for (const m of markers) { m.active = false; m.mesh.visible = false; m.mat.opacity = 0; } }
/** Skip/fast-forward: every loop at its exact end position. */
export function settle(): void {
  tweens.length = 0;
  if (currentState && look) syncLoops(currentState, false);
}
let invalidPeg = -1;
let invalidT = 0;
/** A short horizontal shake of the refused peg (visual only). */
export function invalidFeedback(peg: number): void {
  if (reducedMotion || !pegMeshes[peg]) return;
  if (invalidPeg >= 0 && pegMeshes[invalidPeg] && currentState) pegMeshes[invalidPeg]!.position.x = pegX(invalidPeg, currentState.pegs.length);
  invalidPeg = peg;
  invalidT = 0;
}
export function dropEffect(peg: number): void {
  if (!currentState) return;
  const p = currentState.pegs[peg]!;
  spawnParticles(pegX(peg, currentState.pegs.length), 0.4 + p.length * LOOP_SPACING, 0, 12, 0.8, p[p.length - 1] ?? null);
}
export function winEffect(): void {
  if (!currentState) return;
  const n = currentState.pegs.length;
  for (let i = 0; i < n; i++) spawnParticles(pegX(i, n), 1.4, 0, 60, 2.2, currentState.pegs[i]![0] ?? null);
  if (!reducedMotion) shakeAmp = 0.12;
}

// -- camera and picking ----------------------------------------------------------------------------
const pointerPar = { x: 0, y: 0 };
export function setPointerParallax(x: number, y: number): void { pointerPar.x = x; pointerPar.y = y; }
export function resetCamera(): void { pointerPar.x = 0; pointerPar.y = 0; shakeAmp = 0; }
/** The share of the window's height the bottom HUD band (tray, peg mirror) covers. */
export function setBottomBand(frac: number): void { bottomFrac = Math.max(0, frac); }
/** render.js fitCamera: the peg row and its stacks fit above the bottom band at any aspect. */
function fitCamera(): void {
  const halfW = Math.abs(pegX(0, currentPegCount)) + 1.1;
  const halfH = (PEG_H + 0.6) / 2;
  const tanV = Math.tan((FRAMING.fov * PI) / 360);
  const freeH = Math.max(0.45, 1 - Math.min(0.4, bottomFrac) - 0.04);
  const base = Math.hypot(FRAMING.dist, FRAMING.height - FRAMING.lookY);
  const needH = halfH / (tanV * freeH);
  const needW = halfW / (tanV * camera.aspect * 0.94);
  const k = Math.max(1, needH / base, needW / base);
  camBase.set(0, FRAMING.lookY + (FRAMING.height - FRAMING.lookY) * k, FRAMING.dist * k);
}
const raycaster = new Raycaster();
const ndc = new Vector2();
/** The peg under a window point (px), by its pick cylinder (r 0.55, y −0.2 … 3.4), or null. */
export function pegAt(x: number, y: number): number | null {
  const f = frame();
  if (!currentState || f.width <= 0 || f.height <= 0) return null;
  ndc.set((x / f.width) * 2 - 1, -(y / f.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const o = raycaster.ray.origin, d = raycaster.ray.direction;
  const n = currentState.pegs.length;
  let best: number | null = null, bestT = Infinity;
  for (let i = 0; i < n; i++) {
    const cx = o.x - pegX(i, n), cz = o.z;
    const a = d.x * d.x + d.z * d.z, b = 2 * (cx * d.x + cz * d.z), c = cx * cx + cz * cz - 0.55 * 0.55;
    const disc = b * b - 4 * a * c;
    if (a < 1e-9 || disc < 0) continue;
    for (const t of [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)]) {
      const yy = o.y + d.y * t;
      if (t > 0 && yy >= -0.2 && yy <= PEG_H + 0.8 && t < bestT) { bestT = t; best = i; break; }
    }
  }
  return best;
}

// -- the frame -------------------------------------------------------------------------------------
/** render.js loop(): tweens, sparks, ambience, marker pulse, the refused peg's shake, then the camera from its
 * fitted base plus bounded shake and parallax (nothing accumulates between frames). */
export function update(dtIn: number): void {
  const f = frame();
  const dt = Math.min(0.05, Math.max(0, dtIn));
  if (f.width > 0 && f.height > 0) {
    const aspect = f.width / f.height;
    if (aspect !== camera.aspect) { camera.aspect = aspect; camera.updateProjectionMatrix(); }
  }
  fitCamera();
  stepTweens(dt);
  stepParticles(dt);
  stepAmbient(dt);
  for (const m of markers) if (m.active) m.mat.opacity = 0.35 + Math.sin(f.time * 4) * 0.15;
  if (invalidPeg >= 0 && currentState) {
    invalidT += dt;
    const peg = pegMeshes[invalidPeg];
    const x0 = pegX(invalidPeg, currentState.pegs.length);
    if (!peg || invalidT > 0.24) { if (peg) peg.position.x = x0; invalidPeg = -1; }
    else peg.position.x = x0 + (Math.floor(invalidT / 0.04) % 2 === 0 ? 0.06 : -0.06);
  }
  camera.position.copy(camBase);
  if (shakeAmp > 0.0005 && !reducedMotion) {
    camera.position.x += (decorRng() - 0.5) * shakeAmp;
    camera.position.y += (decorRng() - 0.5) * shakeAmp;
    shakeAmp *= 0.85;
  }
  if (!reducedMotion) {
    camera.position.x += Math.max(-0.5, Math.min(0.5, pointerPar.x)) * 0.6;
    camera.position.y += Math.max(-0.5, Math.min(0.5, pointerPar.y)) * 0.4;
  }
  camera.lookAt(0, FRAMING.lookY, 0);
}

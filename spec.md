# Loop Loom — Game Design Document

**Status:** running spec. Everything below describes the game as it ships today, except the
final "Design intent not yet implemented" list.

---

## 1. Overview

**Pitch.** Untangle a weaver's peg board: lift the top run of same-coloured yarn loops, drop it on a
matching colour or an empty peg, and keep going until every brass peg holds one colour.

| | |
|---|---|
| Genre | Single-player ordering / sorting puzzle (stack-transfer family) |
| Players | 1, with asynchronous score comparison |
| Session | 40 s (Learn lesson) to ~4 min (difficulty 10 Practice board); one Journey stage ≈ 1–2 min |
| Platforms | StarHermit engine 1.24.0 (host API 1.21, `engine.minor=20`): natively in the StarHermit client (Windows, Linux) and in browsers through the engine's web runtime; portrait and landscape; keyboard, mouse, touch, gamepad |
| Rendering | `starhermit:scene` (three.js r185 conventions) with the engine's post effects; the menus, HUD and the accessible peg mirror on `starhermit:ui` |
| Build | A script game: `engine.entry=native/main.ts` (TypeScript, type-checked with `tsc`), no bundler; `npm run package` writes the web loader `index.html` and the file index `starhermit-files.json` |

### File map

| Path | Owns |
|---|---|
| `starhermit.txt` | Manifest: name, owner, `server=score-script.js`, cover, engine pin (1.24.0, minor 20), capabilities (platform, storage, clipboard), `control.*` keys, `engine.group.*`, `engine.gamepad.*` |
| `native/main.ts` | Entry module: app state machine, screen routing, round lifecycle (lift, drop, refusals, undo, hint, Learn step gate, Swift Shuttle timer), achievements and local boards, score posting, input (actions, pointer/touch on the 3D pegs), fixed-step clock, lifecycle |
| `native/screens.ts` | Every screen on `starhermit:ui`: backdrop, title, modes, setup, play (HUD, rails / drawers, peg mirror, tray), pause, settings, results, help, caption line, toast; the responsive layouts |
| `native/render.ts` | The atelier on `starhermit:scene`: table, mat, spools, strands, pegs, loops, stitch markers, ground rings, sparks, dust, lamp shimmer, tweens, shake, parallax, camera fit, peg picking, per-level look |
| `native/quality.ts` | The old presets and budgets keyed by the runtime's graphics tier (`frame().quality`) and level index |
| `native/audio.ts` | Authored clips per event on the runtime's buses, the rendered music pad and room tone, captions |
| `native/platform.ts` | Save (progress + score boards) with merge and old cloud-save migration, the game's options in engine settings with old settings-KV migration, player, invite link, server clock, leaderboard read and score posting through `score-script.js` |
| `native/style.ts`, `assets/ui-style.json`, `tools/ui-style.css` | UI theme and classes (`npm run css` converts the CSS); high-contrast tokens |
| `native/i18n.ts`, `native/game.ts` | Interface language → locale tables; typed facades over the shared `src/` modules |
| `src/rules.js` | Pure rules engine: legality, group moves, terminal states, scoring, board generation, BFS solver, hint |
| `src/content.js` | Themes, palettes, glyphs, Journey (48 stages, each built on first use), Learn lessons, Daily, Practice, Challenges, Score Chase, content validation |
| `src/session.js` | Round lifecycle, command log, undo stack, replay envelope, snapshot, local boards, cloud-document merge, achievements; an injectable round clock (`setClock`) |
| `src/save.js` | Pure save helpers: the game options and their validation, the old KV keys, save data, the old cloud document reader |
| `src/i18n.js`, `src/locales/`, `src/sh-strings.js` | Localization core (`T`, `N`, `setLocale`, `pickLocale`) and catalogues keyed by the US-English text; account strings |
| `score-script.js` | StarHermit platform script (`server=score-script.js`): range-checks a finished round's total and posts it to the `high-score` leaderboard (canonical copy in the games repo's `tools/score-script.js`) |
| `server.js` | Local-dev backend: static host + API (time, daily, replay-validated scores, achievements, presence); the client never calls these routes |
| `tests/*.test.js` | `node --test`: rules, content, session, save, i18n |
| `tests/native.mjs`, `tests/native/*.play` | Engine checks: web index up to date, `tsc`, `starhermit check` with zero warnings, generated play scripts |
| `tools/` | `package-web.mjs`, `css.mjs`, `gen-plays.mjs` + `solve.mjs` (play scripts from the rules' shortest solutions), `browser-play.mjs` (GPU Chrome play) |
| `sfx/manifest.txt` | Canonical clip table (`file \| event id \| description \| usage`) |
| `assets/` | `atelier-backdrop.webp` (menu backdrop), `linen-weave.webp` (table/mat texture), `ui-style.json` |
| `cover.jpg`, `coverart.png`, `icon.png` | StarHermit cover and icon |

---

## 2. Design pillars

**1. The board never lies.** Every rule that decides an outcome lives in `src/rules.js` and is queried,
never re-derived. The hint, the peg mirror's legal highlights, the 3D ground markers, the tutorial
step checker and the server's replay validator all call `legalActions` / `moveReason`.
*Rules in:* an explanation string for every rejection. *Rules out:* any "smart" UI that quietly forbids a
move the engine would allow, or allows one it would not.

**2. Colour is never the only channel.** Each loop colour carries a name (`crimson`, `indigo`, `fern`,
`marigold`, `violet`, `ember`), a glyph (`● ▲ ■ ◆ ★ ⬟`) and a 3D stitch marker of a distinct solid shape.
Four colour-vision palettes plus a high-contrast one ship.
*Rules out:* any state readable only as a hue — including "the peg glows green" as the sole legality cue.

**3. Two ways in, one game.** The 3D loom and the peg mirror are two views of one state; the mirror
is real UI buttons (focusable, named for screen readers with the full stack) and is on screen during every round, not
a degraded mode. A player, a screen reader and the e2e bot all reach the results screen the same way.
*Rules out:* interaction that only exists as a raycast against a mesh.

**4. Cozy, not sleepy.** The atelier is warm brass, dyed yarn and low golden light; feedback is short,
soft and wooden rather than arcade-bright. Effects are additive: with reduced motion on, every tween,
particle, shake and parallax is gone and the game plays identically.
*Rules out:* screen-filling flourishes, timers on modes that are not explicitly timed, and any failure
state that punishes with noise.

**5. Provable runs.** Every round records an ordered command log with periodic state hashes. The seed
generates the board; the board is BFS-validated for solvability and par before it ever ships.
`server.js` (local dev) can re-derive the board from the content id and replay the log; the deployed
platform board takes the client's total with a range check only. *Rules out:* boards sent by the
client and unvalidated daily content.

---

## 3. Player experience

**Target player.** Someone who likes a tidy, bounded puzzle in a browser tab: minesweeper-at-lunch, not
a session with a save file to manage.

**First 60 seconds.** Boot lands on the title with four buttons (Play, Modes & progress, How to play, Settings). `Play` with no save opens the Journey
stage the player has unlocked (stage 1 first time); the setup screen names the board — colours, pegs,
capacity, par, and one sentence of rules — before anything is committed. `Modes & progress → Learn`
opens the four lessons, which teach by requiring the action: Lesson 1 states that loops lift from the
top and will not advance until the player lifts the highlighted loop onto the empty peg; Lesson 2 does
the colour-matching rule; Lesson 3 the group lift; Lesson 4 removes the scaffolding and asks for a solve.
`How to play` generates its rule cards from the live key bindings, so it can never describe the wrong key.
Every peg press answers within one frame: the mirror button takes the lifted style, the 3D loops rise 1.1
units, legal target rings pulse, a clip plays and the screen reader hears the lifted group.

**Session shape.** Title → setup → 6–40 moves → results with a component breakdown → the next
recommended action (next stage, next lesson, or play again). A round survives a reload: an active session
is snapshotted to the device's storage on every move and offered back as `Resume saved round`.

**The emotional beat.** The moment a peg goes uniform. `native/render.ts` detects it during `syncLoops`, fires
`complete-peg`, throws a small burst of particles and a 0.05 shake — the only time the game congratulates
you mid-round, and it happens two to five times per board on the way up.

---

## 4. Core loop and rules contract

### Entities

State (`createState`, `src/rules.js`) is `{ pegs, cap, colors, seed, moves, invalid, undos, tick, status, terminal, moveLimit }`.
`pegs` is an array of arrays of colour indices ordered **bottom → top**. `cap` is 4 everywhere
(`CAP_DEFAULT`). Boards carry `colors` full colour sets plus 2 empty pegs, so a 4-colour board is 6 pegs
holding 16 loops.

### The one action

Move the top same-colour group from peg *A* to peg *B*.

| Rule | Owner |
|---|---|
| The lifted group is the maximal run of one colour at the top of the source | `topGroup` |
| Legal iff round active, both indices in range, `A ≠ B`, source non-empty, destination below `cap`, and destination empty or top-matching | `moveReason` — returns `same-peg`, `empty-source`, `no-space`, `color-mismatch`, `round-over`, `bad-peg`, or `null` |
| Transferred count is `min(groupSize, cap − destHeight)` — a group can be split by capacity, never by choice | `moveCount` |
| Order is preserved: the group is `splice`d off the source and pushed in the same order | `applyMove` |
| A rejected attempt increments `invalid` and `tick` and leaves the board untouched | `applyMove` / `applyInvalid` |

### Resolution order

`applyCommand` (`src/session.js`) is the only entry point. Per move: dedupe by command id → `applyMove`
→ on rejection, log an `invalid` command and return the reason → on success, push the pre-move state to
the undo stack, append the command, append the state hash, and call `finish()` if the round terminated.
Presentation follows: `render.setBoard` (tween), `dropEffect`, the `move` clip, a snapshot save,
HUD/rail/mirror refresh, and a live-region announcement of the full board.

### Terminal states

`terminalReason` returns `solved` when every non-empty peg is uniform (a peg of one loop counts), else
`move-limit` when `moves ≥ moveLimit`, else `null`. The Swift Shuttle challenge adds a fourth outcome,
`time-limit`, raised by `native/main.ts` on the fixed steps when `elapsedMs > timeTargetMs`. There is no stuck
state to detect: two empty pegs guarantee a legal action exists while any loop remains, and generated
boards are BFS-proved solvable.

### Scoring

`scoreComponents(state, par, elapsedMs)` — all integers, formatted only at the surface:

```
completion      = solved ? 1000 : 100 × (uniform pegs of height ≥ 2)
efficiency      = solved ? 25 × max(0, ceil(par × 1.5) − moves) : 0
mastery         = solved && undos === 0 ? 250 : 0
invalidPenalty  = −15 × invalid
total           = max(0, completion + efficiency + mastery + invalidPenalty)
```

**Worked example — Journey stage 1** (par 4, board `[[fern,indigo,indigo,indigo],[crimson,crimson,indigo,fern],[fern,fern,crimson,crimson],[],[]]`).
Solved in 4 moves, one rejected drop, no undo:
completion 1000 + efficiency 25 × (⌈6⌉ − 4) = 50 + mastery 250 − 15 = **1285**.
The results screen prints those four lines plus the total and the elapsed time, never a bare number.

### Tie-breaks

`compareResults`: higher total, then solved over unsolved, then fewer invalid attempts, then lower
elapsed time, then `localeCompare` on the stable session id — deterministic all the way down.

### RNG and seeding

`mulberry32` over an `fnv1a` hash of a content key. Three independent streams: rules/generation (seeded
per content record), audiovisual variation (`audio.setSeed(record.seed)`, picks the `loop-place` /
`loop-settle` variant and noise), and scene decoration (`native/render.ts`, fixed `0xC0FFEE`). Nothing the
player sees can perturb the rules stream.

`generateBoard(seed, colors, cap, emptyPegs)` deals a seeded shuffle of `colors × cap` loops into the
non-empty pegs and accepts the result only if it is not already solved, `solve()` returns a par, and
that par is at least `max(2, colors)` — otherwise it retries with a derived stream, up to 64 attempts.
`solve()` is a canonicalised BFS with a 300 000-state budget that prunes pointless moves (emptying a
already-uniform peg onto an empty one), so par is the true shortest solution.

### Undo and hint

Undo pops the snapshot stack, increments `undos` (which forfeits the 250-point mastery bonus) and is
logged as a command so replays stay exact. It is disabled by `record.noUndo` (the No Takebacks
challenge) and when the stack is empty; both button copies disable in lockstep. Hint scores every
non-pointless legal action one ply deep (+10 per uniform peg, +2 per freed peg, +4 for stacking onto a
match, +12 for topping a peg out to capacity) and highlights the winner for 1.6 s without spending a move.

---

## 5. Modes and progression

| Mode | Content source | Board | Ranked | Distinctive |
|---|---|---|---|---|
| Learn | `LESSONS` (4 authored boards) | 4 pegs, 2 colours, partial | no | Step gate: the lesson only advances when the player performs the exact `{from,to}` it asked for |
| Journey | `getJourneyStage(i)`, 48 records built at module load | 3→6 colours, +2 empty | no | Stage grid with done/locked states; every 8th stage adds a move limit of `par + 2 + ⌊par/4⌋` |
| Daily | `getDaily(utcDay)` | 4 colours, 6 pegs, fixed ruleset | **yes** | One seed per UTC day, worldwide; immutable after publication |
| Practice | `getPractice(difficulty, salt)` | 3–6 colours by level 1–10 | no | Difficulty select in setup; fresh salt per open |
| Challenge | `CHALLENGES` × salt | 4–5 colours | no | Taut Thread / Swap Meet (move limit `par+2`), Swift Shuttle (90 s), No Takebacks (undo off) |
| Score chase | `getScoreChase(salt)` | 5 colours | **yes** | Submitted with the replay envelope for authoritative validation |

**Difficulty curve.** `stageConfig(i)` raises colours as `min(6, 3 + ⌊i/10⌋)` and keeps two empty pegs
throughout, so pressure comes from branching factor and solution depth rather than from a smaller
workspace. `rec.difficulty` is `1 + round(9 × i/47)`. Every eighth stage is a mastery gate that tests the
concept just taught under a move limit before the next colour is introduced.

**Unlocks.** Clearing Journey stage *n* sets `journeyUnlocked = max(current, min(n, 47))` — exactly one
stage forward, so `Play` always resumes at the frontier. Five achievements: First Weave, Apprentice of
the Loom (all four lessons), Seven Suns (7 distinct Daily days), Master Weaver (a difficulty-8+ stage),
Hundred Hands (100 rounds). Grants are idempotent and local (mirrored by the cloud save when signed in).

**Daily integrity.** `content.validateAll()` (every Journey stage, lesson, challenge, a Daily and a Score Chase)
runs in the unit tests; the engine client does not run it at start (it BFS-solves 56 boards, seconds in the
native interpreter).

---

## 6. Controls and interaction

| Input | Keyboard / mouse | Touch | Gamepad |
|---|---|---|---|
| Lift / drop | Click a 3D peg or a mirror button, click a target; `Enter`/`Space` on the focused peg | Tap a peg or a mirror button, tap a target | South |
| Drag | Press on the source peg, release over the target (> 14 px counts as a drag) | Same | — |
| Move the peg focus | `←`/`→` (wrap), `↑`/`↓` (stop at the ends) | — | D-pad / left stick |
| Cancel a lift | Click the lifted peg, or `Escape` | Tap the lifted peg | East |
| Undo / hint | `U` / `H`, or the rail / tray buttons | Tray buttons | West / North |
| Pause | `P`, or `Escape` with nothing lifted, or the pause button | Pause button | Start |
| Camera reset | `R`, or View in the tray | View | Right stick press |

The actions are the manifest's `control.*` / `engine.gamepad.*` lines; players rebind keys and pad buttons in
the runtime's Options (Settings → Keyboard bindings opens it), and How to play prints the effective keys.
With a widget focused (Tab), the arrows and Enter belong to the UI (engine.minor 20); a click or tap on a peg
mirror button hands them back to the board. Pointer and touch presses are queued and decided after the frame's
UI is built, so a press on a widget is the widget's; a press held over 600 ms without moving does nothing.
The pointer position also drives the camera parallax.

**Input locking.** Only the terminal resolve locks input: `endRound` calls `render.settle()`, which drops the
tweens and snaps every loop to its exact final position, so skipping animation and letting it play produce
identical state. Peg presses are ignored unless the round is active. Double-commit protection is by command id.

**Feedback per input.** Legal lift: the mirror button gains the lifted style, loops rise, legal rings pulse
(and the legal mirror buttons turn green), `select` clip, 8 ms haptic, an announcement of the group size and
colour. Legal drop: tween, drop sparks, `move` clip, 14 ms haptic, board announcement. Rejection: peg shake,
`invalid` clip, a 100 ms haptic, a toast naming the reason, the same text announced, and a −15 tally in the
HUD score.

---

## 7. Screens and UI flow

App states: `boot → title → mode-select → active | tutorial ↔ paused → resolving → results`; every
transition is announced to screen readers. Screens: `title, modes, setup, play, pause, settings, results,
help`. `play` is the HUD, the tray, the rails and the peg mirror over the 3D loom; the others are centred
overlay panels (the menus over the atelier backdrop, pause and results over the board).

`Escape` / Back backs out of whichever overlay is open (help → its return screen, settings → pause or title,
modes/setup → title, pause → resume) with the softer `back` cue. Opening an overlay focuses its first button
and opens it at its top; tall panels scroll inside.

**Desktop (≥ 1024 logical px).** HUD strip across the top: objective card left, moves/score centred, ☰ and
pause right. 240 px rails: left objective, par and seed, Undo/Hint, Restart/Skip anim and progression; right
mode, connection, top scores (the hosted board signed in, else local) and achievements. Peg mirror centred
above the tray. The camera fits the peg row above the mirror and tray.

**Tablet and narrow windows.** The rails become drawers: `☰` opens the left one, `Panel` the right one, above
the mirror, capped at 46 % of the height.

**Portrait phone (≤ 700 px wide).** Smaller HUD cards; the tray is one row of equal buttons; 44 × 52 px
mirror buttons.

**Landscape phone (≤ 500 px tall).** The tray sits bottom-left (42 % of the width), the mirror bottom-right
(54 %, scrolling sideways when needed); drawers are 420 px wide at most.

**Scale and safe areas.** The runtime's UI scale and text size apply to everything; layouts use the
window's logical size inside the safe area.

---

## 8. Art direction

**The hero is the board.** The camera sits at `(0, 4.6, 7.6)` with a 40° FOV looking at `y = 0.9` — low
enough that stacks read as columns and high enough to see which peg is empty. Everything else is
background: the table, the mat, seven procedural spools and five loose fibre strands.

**Palette.** Five themes rotate by stage (`content.js THEMES`):

| Theme | bg | floor | brass | accent |
|---|---|---|---|---|
| Atelier | `#241f1c` | `#4a3c31` | `#c9a227` | `#e8c07a` |
| Dawn | `#2b2430` | `#574a52` | `#d4a94e` | `#f0a8b8` |
| Dusk | `#1d2333` | `#37405c` | `#c9a227` | `#8fa8e8` |
| Night | `#14161d` | `#272b36` | `#b08d2e` | `#7a94c8` |
| Ember | `#261a14` | `#4e3428` | `#d9a13b` | `#e88a5a` |

Loop colours (default palette): `#d64541 #3f7fd6 #4caf6d #f2c94c #9b59b6 #e67e22`. The UI shell is
`--bg #1a1d24`, panels `rgba(28,32,40,.96)`, text `#eef1f5`, dim `#9aa4b2`, accent `#e8c07a`, primary
button `#3b6ea5`. High contrast swaps to pure black panels, `#fff` text, `#ffd700` accent and `#005fcc`
buttons, and drops the backdrop image entirely.

**Shape language.** Fat torus loops (R 0.3, tube 0.115) on slim tapered brass stems capped with a sphere
knob; a bone-white stitch marker per colour in a distinct solid — sphere, cone, box, octahedron, 4-sided
pyramid, cylinder. Ground rings mark legal targets in `#7fe08a`; the lift origin gets a `#ffd27a` ring.
UI is 9–14 px radii, one weight of the system sans, no decorative type.

**Motion.** One easing (ease-out cubic) and one duration (0.28 s) for loop travel; tweens are replaced,
never stacked, so an interrupted move never accumulates drift. Lift raises 1.1 units. Particles are a
bounded pool (150 or 900 by the Particles setting) with gravity −2.4. Shake is capped at 0.05 for a peg
completion and 0.12 for a win, decaying ×0.85 per frame, and never affects raycasting. Pointer parallax
is ±0.06/0.04 units of camera offset.

**Reduced motion** (the runtime's option) removes all tweens, particles, shake, parallax and ambient motion;
loops jump to their exact positions and the game is fully playable.

**Graphics.** ACES filmic tone mapping (exposure 1.05), a warm key directional light (the engine's light
units: three r169 intensities ÷ π) with soft shadows over the board (`shadow.distance` 20, radius 3), a
hemisphere fill and a cool rim, and the theme colour as background and fog. The look follows the runtime's
graphics level (Options › Graphics: Auto from the device, or a chosen level; render scale, adaptive
resolution, the frame-rate limit and readout are the runtime's): `native/quality.ts` maps its four tiers onto
the browser build's presets.

| Tier | Shadows | AO | Bloom | Grade | AA | Reflections | Particles | Ambient motion | Detail | Materials | Yarn texture | Geometry LOD | Dust | Sparks |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| low | off | off | off | off | MSAA | off | 150 flat flecks | still | plain | Lambert, loop + stitch merged into one vertex-coloured mesh | — | ½ | — | 0.5× |
| balanced | 1024² | off | on | on | FXAA | on | 900 soft sparks | animated | detailed | Standard | 128 × 32 | ¾ | 50 | 0.75× |
| high | 2048² | on | on | on | SMAA | on | 900 soft sparks | animated | detailed | Physical (clear-coated brass) | 128 × 32 | 1 | 70 | 1× |
| ultra | 4096² | high | on | on | MSAA | on | 900 soft sparks | animated | detailed | Physical (clear-coated brass) | 256 × 64 | 1.5 | 120 | 1.5× |

Sparks scale within a tier by the runtime's level index (≤ 2×). Reflections are a PMREM-filtered
`RoomEnvironment` at `environmentIntensity` 0.38; bloom has threshold 0.9 (sparks, brass glints); the grade is
the old display-space shader's gentle S-curve, +10 % saturation, warm highlights / cool shadows and a 0.28
vignette. Detailed surfaces have the yarn-twist texture as colour and bump on the loops (the old sheen is not
drawn by the engine), a turned collar on each peg and wooden flanges on the spools. The linen weave
(`assets/linen-weave.webp`) covers the table and mat once loaded.

**Visual assets the design calls for.** A warm atelier key art that shows the actual object the game is
about (cover); a very dark, defocused atelier interior behind the menu overlays so the title screen has
depth without competing with the buttons; a woven linen scan for the table and mat so the surface reads
as cloth rather than flat colour. All three ship — see §15.

---

## 9. Audio direction

**Mix philosophy.** Everything is small, close-miked, wooden or soft — the sound of a hobby, not a slot
machine. Priority: input acknowledgment (quietest) < legal move < peg completion < round completion.
No stinger longer than three seconds.

**Buses.** The runtime's Options own the volumes, the mute and the voice limit (Options › Audio): music →
`music`; effects and ambience → `effects`; the click/back cues and the assistive voice cues (hint,
achievement) → `interface`, so they stay audible when effects are mixed down. The old default levels (music
0.6, effects 0.8, ambience 0.4, voice 0.7) are folded into each sound's gain. A hidden window holds the pad and
room tone.

**Ambience.** A two-second loop of brown noise low-passed at 320 Hz — atelier room tone, generated at
runtime from the audiovisual RNG so it costs no download.

**Music.** A five-note pad (C, E♭, G, B♭, C) stepping every 1.6 s, with one, two or three voices
depending on how much of the board is already sorted — the room fills in as the player wins.

**Every clip is authored (MOSS-SoundEffect v2.0, 48 kHz mono Opus)**; clips load one at a time once the mixer
runs (in browsers after the first press); a clip still loading is silent (its caption still shows). The pad's
notes and the room tone are rendered into clips once (no live synthesis graph). `sfx/manifest.txt` is the canonical table.

| Event id | File | Sound | Fires when |
|---|---|---|---|
| `select` | `loop-lift.opus` | Cloth rustle into a light metallic tick | The top group lifts off a peg |
| `deselect` | `loop-lower.opus` | Muted cloth flop with a woody knock | A lift is cancelled |
| `move` | `loop-place.opus` / `loop-settle.opus` | Fabric thud plus a short brass ring; two seeded variants | A legal move commits |
| `invalid` | `move-denied.opus` | Two dull knocks on a loom frame, no ring | A drop is rejected |
| `complete-peg` | `peg-complete.opus` | Bright bell with glass-bead sparkle | A peg first becomes uniform |
| `win` | `loom-finished.opus` | Four-note bell arpeggio over a fabric swish | The board is solved |
| `lose` | `round-over.opus` | Descending two-note marimba sigh | Move limit or timeout |
| `undo` | `move-undone.opus` | Reverse fabric whoosh with a metallic flick | An undo is applied |
| `hint` | `hint-chime.opus` | Soft glass ping with a shimmering tail | A hint is requested (voice bus) |
| `click` | `ui-click.opus` | Crisp wooden shuttle-switch click | Any forward menu press |
| `back` | `ui-back.opus` | Lower, softer wooden tock | Back / Done / Close / Leave, and `Escape` closing an overlay |
| `round-start` | `round-start.opus` | Shuttle sweep across warp threads with a low string hum | A round begins, just before the play screen |
| `time-warning` | `time-warning.opus` | Two taps on a hollow block over a rising hum | Ten seconds remain in Swift Shuttle |
| `achievement` | `achievement-unlock.opus` | Two-bell fanfare with a felt mallet hit | An achievement is granted (voice bus) |

**Captions.** Every event shows its caption for 2.2 s above the peg mirror (above the overlays elsewhere), muted or not.

---

## 10. Localization

The nine locales are **en-US, en-GB, es-419, es-ES, de-DE, fr-FR, fr-CA, pt-BR, it-IT**. The game follows the
runtime's interface language (`preferences().language`: the player's choice in Options › Language, else the
account's preferred language or the device's), mapped to the nearest locale (`pickLocale`); a change shows
on the next frame without touching the round. Every string is drawn through `T()` each frame from
`src/locales/` (keyed by the US-English text; en-GB lists the *colour* spellings, es-ES and fr-CA their
differences). Content copy — colour names, lessons and their prompts, challenges, the Daily Loom / Score Chase
titles, achievements and captions — is English data translated at display time. Account strings come from
`src/sh-strings.js`.

---

## 11. Accessibility

- **Keyboard-only path is complete.** Title → mode → setup → solve → results without a pointer: Tab and
  Enter through the buttons, the arrows move the peg focus (ringed on the mirror), Enter/Space lift and drop,
  Escape cancels or backs out, U/H/P/R cover undo, hint, pause and camera reset.
- **Screen readers.** State transitions with their reason, the lifted group's size and colour, the full board
  after every move, every rejection reason, hints and the final score are announced; each mirror button is
  named `Peg n: crimson, indigo, indigo` (or `empty`), suffixed `(lifted)`; the board description is a
  screen-reader target on the play screen.
- **Captions** mirror every sound effect as text.
- **Colour.** Name + glyph (● ▲ ■ ◆ ★ ⬟) + 3D stitch shape on every loop; four colour-vision palettes and a
  high-contrast palette (Settings › Color palette); the runtime's high contrast swaps the UI to black panels,
  white text, gold accents and drops the backdrop image.
- **Motion, text size.** The runtime's reduced motion and text scale. Left-handed controls reverse the tray.
- **Targets.** Buttons are at least 44 × 44 px; mirror buttons 52 × 56 px (44 × 52 on portrait phones).
- **Settings** (title or pause): Color palette, Left-handed controls, Hold to lift (stored, no behaviour —
  see §17), Timing assistance (turns off the Swift Shuttle timer), Haptics, Share anonymous usage counters
  (the counters stay on the device), Replay tutorial; Audio & graphics and Keyboard bindings open the runtime's
  Options.

---

## 12. StarHermit integration

`starhermit.txt`: `name`, `description`, `owner`, `server=score-script.js`, `cover=cover.jpg`,
`launch=index.html`, the engine pin (`engine.api=1`, `engine.entry=native/main.ts`, `engine.version=1.24.0`,
`engine.minor=20`), `engine.capabilities=platform,storage,clipboard`, one `control.<action>` line per keyboard
action (left, right, up, down, confirm, cancel, undo, hint, pause, camera), their groups and gamepad
defaults.

- **Player.** Signed in, the title and status rail show the account's display name and the save's sync state
  (synced / saving… / sync error); guests see "local play". The title offers **Sign in with StarHermit**
  (`requestSignIn`) to guests and **Invite a friend** (copies the invite link) to signed-in players. A session
  that ends shows the "signed out" toast; play goes on locally.
- **Save.** Progress (journey unlock and completions, lessons, daily days, achievements, round count, best
  scores; checksummed) and the local score boards are the engine save (`saves`), on the device and in the
  player's cloud slot. Another device's save is merged with `session.mergeDocs` (on a conflict and when the
  account's save replaces the device's). The browser build's cloud slot (`game:loop-loom`, the JS SDK's
  saveJSON of `{ v, savedAt, progress, settings, scores }`) shows as a foreign save: it is merged in, its game
  options adopted where unset, and replaced once (`replaceForeign`). The round in progress ("Resume saved
  round"), the session id and the usage counters stay on the device (key/value storage).
- **Settings.** The game's options are engine settings (`game.<key>`, synced with the account). The old
  per-player settings KV keys are read once: the game options are adopted unless set since, then every old
  key (volumes, graphics, language, …) is removed.
- **Leaderboard.** One board, `high-score` (integer, higher is better, 0–100,000). Signed in, every finished
  Journey, Daily, Challenge or Score Chase round (solved or not) posts its total through `score-script.js` (a
  practice session whose socket carries `{ type: 'result', scores }`), and the results show "Leaderboard
  rank: #N" (or posted / not posted); Practice and lessons post nothing. The status rail lists the board's top
  eight. Scores are server-checked by `score-script.js` (range check), as before.
- **Daily clock.** The Daily's UTC day comes from the platform's clock (`serverNow`), the device's when
  offline.

**Not used.** Multiplayer, rooms, matchmaking, chat, platform achievements, purchases. Achievements stay in
the save.

---

## 13. Technical architecture

**Module boundaries.** `src/rules.js` imports nothing. `src/content.js` imports only rules. `src/session.js`
adds persistence and achievements. `native/render.ts` and `native/audio.ts` read state and never write it;
`native/main.ts` owns every transition. `server.js` reuses rules, content and `validateReplay` unmodified.

**Determinism and replay.** The envelope is `{ schema, rulesVersion, contentVersion, contentId, seed,
initialHash, startedAt, commands[], hashes[], result }`; `validateReplay` reconstructs and replays it.

**Time.** The runtime's fixed steps (60 a second) drive the round clock (`session.setClock`: the launch's
wall-clock time plus the steps), so the Swift Shuttle timer and play scripts replay exactly; a hidden window
does not count. Animation uses the frame's delta, clamped to 50 ms.

**Persistence.** session.js's `localStorage` is a stand-in (`native/platform.ts`): `looploom.progress.v1` and
`looploom.scores.v1` live in the engine save; `looploom.snapshot.v1`, `looploom.sessionid.v1` and
`looploom.analytics.v1` in the device's key/value storage.

**Lifecycle.** Hiding the window pauses an active round, saves a snapshot, holds the audio and flushes the
save; returning toasts "Welcome back". Quitting saves the snapshot.

**Performance.** Board geometry is pooled (`cap × pegCount` loop slots reused by colour); particles a fixed
buffer drawn by draw range. Journey stages are generated on first use (a 6-colour stage takes up to ~0.5 s in
the native interpreter, once).

---

## 14. Testing and acceptance criteria

`npm test` runs:

- **Unit** (`node --test tests/*.test.js`, 49 cases): rules, content, session (as before), save (old cloud
  document reading, option validation, merge without save loops, the injectable clock), i18n (every key from
  `native/*.ts`, the content and the captions in all nine locales with matching placeholders; no stray keys).
- **Native** (`tests/native.mjs`): the web index matches the files, `tsc`, `starhermit check .` with no
  warnings, and every `tests/native/*.play` as a guest `--render-check`: menus (help, settings, practice,
  challenges, the Journey grid), Journey stage 1 to the results (a lift lowered, a refused drop, hint, pause,
  keys and mirror clicks), Learn lessons 1–2 and Next lesson, the 3D pegs by clicks, a portrait phone by touch
  (drawers, Help, lessons 1–2), a landscape phone by keys, and Swift Shuttle running out of time. Scripts are
  generated from the rules' shortest solutions (`npm run plays`).
- **Browser** (`npm run test:browser`, GPU Chrome via `tools/gpu-chrome.mjs`): the packaged loader at
  1366 × 768, 390 × 844 @3 and 844 × 390 @3 — Journey stage 1 by keys / by tapping the mirror buttons to the
  results, then on the desktop Learn lesson 1 by a mouse drag across the 3D pegs and the pause menu; no
  console errors or warnings. `~/games/tools/engine-web-smoke.mjs` passes too.

---

## 15. Asset inventory

| Path | Purpose | Source | Status |
|---|---|---|---|
| `coverart.png` | 1200×675 StarHermit cover: the peg board on a linen mat, one crimson loop mid-lift | FLUX.2 klein, seed 70110, 1216×688 → scaled, 256-colour PNG (314 KB) | generated in this pass (replaced a generic template placeholder) |
| `assets/atelier-backdrop.webp` | Dark defocused atelier behind the title/modes/setup overlays | FLUX.2 klein, seed 40287, 1536×864 → 1280×720 WebP (10 KB) | generated in this pass, drawn behind the menus (`.backdrop` in `tools/ui-style.css`) |
| `assets/linen-weave.webp` | Woven linen scan on the table top (8×5 repeat) and the mat (3×3) | FLUX.2 klein, seed 91554, 768×768 → 512×512 WebP (87 KB) | generated in this pass, wired in `native/render.ts buildEnvironment` |
| `favicon.svg`, `icon.png` | Browser and host icons | authored | shipped |
| `sfx/loop-lift.opus` … `sfx/achievement-unlock.opus` (12 clips) | Core event set — see §9 | MOSS-SoundEffect v2.0, 100 steps | shipped |
| `sfx/round-start.opus` | Round-start shuttle sweep | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `round-start` |
| `sfx/ui-back.opus` | Backing-out cue distinct from the forward click | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `back` |
| `sfx/time-warning.opus` | Ten-seconds-left cue in Swift Shuttle | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `time-warning` |
| Loops, pegs, table, mat, spools, fibre strands | The entire 3D scene | Procedural primitives in `native/render.ts` | shipped — no mesh files, nothing to download |
| Ambience and music | Room tone and the adaptive pad | Rendered into clips in `native/audio.ts` | shipped |

No 3D model files or character animations ship: the loom is a handful of primitives, which loads
instantly and re-colours per theme, and the game has no humanoid to animate.

Every texture load is optional. If `linen-weave.webp` or `atelier-backdrop.webp` fails to fetch, the flat
theme colours and the `#17130f` backdrop ground stay in place and nothing else changes.

---

## 16. Known limitations

- **Local boards are per-device** (they travel in the save); the results' comparison line is a personal best.
- **Practice and Challenge scores are unranked on the dev server** (`server.js`); the hosted board takes
  Challenge totals.
- **Hold to lift** persists but does nothing (tap-to-select and drag are the pointer model), as before.
- **Not ported:** the old Graphics section's per-category overrides (the runtime chooses a level), the
  synthesized stand-in sounds while a clip loads, the yarn's sheen (not drawn by the engine), the menu
  backdrop's lamp-breathing glow, and the DOM-only fallbacks (no-WebGL compatibility screen). Guests' old
  browser localStorage progress cannot migrate; signed-in players' cloud saves do.
- **Native play scripts** run phone layouts at scale 1: render checks with a `# viewport …@2`/`@3` line fail
  the runtime's trusted-screen probe for any game (reported); the browser check covers DPR 3. The 1.24.0
  play scripts have no drag step, so drags are checked in the browser.
- **Signed-in paths** (cloud merge, foreign save, KV migration, score posting) are covered by unit tests and
  the shared platform code, not live-tested here.

---

## 17. Design intent not yet implemented

1. **Hold-to-lift pointer mode.** The setting exists and persists; the pointer handler implements
   tap-to-select and drag only.
2. **Server-backed friend comparison** on the results screen (it reads the local board).

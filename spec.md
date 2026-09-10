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
| Platforms | Desktop and mobile browsers, portrait and landscape; keyboard, mouse, touch, gamepad |
| Rendering | Three.js r169 WebGL scene, with a DOM board mirror that is fully playable when WebGL is absent |
| Build | `esbuild` bundles `src/main.js` → `lib/bundle.js` (ESM, minified); `index.html` loads only that bundle |

### File map

| Path | Owns |
|---|---|
| `index.html` | Every screen's markup, the whole stylesheet, the DOM shell (HUD, rails, tray, board mirror, overlays) |
| `src/main.js` | App state machine, screen routing, input (pointer/keyboard/gamepad), HUD/rail updates, boot |
| `src/rules.js` | Pure rules engine: legality, group moves, terminal states, scoring, board generation, BFS solver, hint |
| `src/content.js` | Themes, palettes, glyphs, Journey (48 stages), Learn lessons, Daily, Practice, Challenges, Score Chase, content validation |
| `src/session.js` | Round lifecycle, command log, undo stack, replay envelope, localStorage persistence, achievements, local boards |
| `src/render.js` | Three.js atelier scene, pegs, loops, markers, particles, tweens, quality tiers, peg raycasting |
| `src/audio.js` | WebAudio buses, authored clip playback with procedural fallback, ambience, adaptive music, captions |
| `src/platform.js` | StarHermit REST adapter: launch token, activity, presence, score submit, achievements, telemetry |
| `src/server-time.js` | Round-trip-corrected server clock and the UTC day number the Daily uses |
| `server.js` | StarHermit game script: static host + authoritative API (time, daily, replay-validated scores, achievements, presence) |
| `tests/rules.test.js` `tests/content.test.js` `tests/session.test.js` | `node --test` unit/property/golden suites |
| `tests/e2e.mjs` | Playwright-core playthrough of the real UI at three viewports |
| `sfx/manifest.txt` | Canonical clip table (`file \| event id \| description \| usage`); `manifest.json` drives generation |
| `assets/` | `atelier-backdrop.webp` (menu backdrop), `linen-weave.webp` (table/mat texture) |
| `coverart.png` | 1200×675 StarHermit cover image |

---

## 2. Design pillars

**1. The board never lies.** Every rule that decides an outcome lives in `src/rules.js` and is queried,
never re-derived. The hint, the DOM mirror's `.legal` highlights, the 3D ground markers, the tutorial
step checker and the server's replay validator all call `legalActions` / `moveReason`.
*Rules in:* an explanation string for every rejection. *Rules out:* any "smart" UI that quietly forbids a
move the engine would allow, or allows one it would not.

**2. Colour is never the only channel.** Each loop colour carries a name (`crimson`, `indigo`, `fern`,
`marigold`, `violet`, `ember`), a glyph (`● ▲ ■ ◆ ★ ⬟`) and a 3D stitch marker of a distinct solid shape.
Four colour-vision palettes plus a high-contrast one ship.
*Rules out:* any state readable only as a hue — including "the peg glows green" as the sole legality cue.

**3. Two ways in, one game.** The WebGL loom and the DOM peg mirror are two views of one state; the mirror
is real `<button>` elements with full `aria-label` stack readouts and is on screen during every round, not
a degraded mode. A player, a screen reader and the e2e bot all reach the results screen the same way.
*Rules out:* interaction that only exists as a raycast against a mesh.

**4. Cozy, not sleepy.** The atelier is warm brass, dyed yarn and low golden light; feedback is short,
soft and wooden rather than arcade-bright. Effects are additive: with reduced motion on, every tween,
particle, shake and parallax is gone and the game plays identically.
*Rules out:* screen-filling flourishes, timers on modes that are not explicitly timed, and any failure
state that punishes with noise.

**5. Provable runs.** Every round records an ordered command log with periodic state hashes. The seed
generates the board; the board is BFS-validated for solvability and par before it ever ships.
Ranked scores are accepted only after `server.js` re-derives the board from the content id and replays
the log. *Rules out:* client-declared scores, boards sent by the client, and unvalidated daily content.

---

## 3. Player experience

**Target player.** Someone who likes a tidy, bounded puzzle in a browser tab: minesweeper-at-lunch, not
a session with a save file to manage.

**First 60 seconds.** Boot lands on the title with three buttons. `Play` with no save opens the Journey
stage the player has unlocked (stage 1 first time); the setup screen names the board — colours, pegs,
capacity, par, and one sentence of rules — before anything is committed. `Modes & progress → Learn`
opens the four lessons, which teach by requiring the action: Lesson 1 states that loops lift from the
top and will not advance until the player lifts the highlighted loop onto the empty peg; Lesson 2 does
the colour-matching rule; Lesson 3 the group lift; Lesson 4 removes the scaffolding and asks for a solve.
`How to play` generates its rule cards from the live key bindings, so it can never describe the wrong key.
Every peg press answers within one frame: the mirror button gains `.selected`, the 3D loops rise 1.1
units, legal target rings pulse, a clip plays and the live region announces the lifted group.

**Session shape.** Title → setup → 6–40 moves → results with a component breakdown → the next
recommended action (next stage, next lesson, or play again). A round survives a reload: an active session
is snapshotted to `localStorage` on every move and offered back as `Resume saved round`.

**The emotional beat.** The moment a peg goes uniform. `render.js` detects it during `syncLoops`, fires
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
Presentation follows: `render.setBoard` (tween), `dropEffect`, the `move` clip, a snapshot save, a
presence heartbeat, HUD/rail/mirror refresh, and a live-region announcement of the full board.

### Terminal states

`terminalReason` returns `solved` when every non-empty peg is uniform (a peg of one loop counts), else
`move-limit` when `moves ≥ moveLimit`, else `null`. The Swift Shuttle challenge adds a fourth outcome,
`time-limit`, raised by `main.js`'s 250 ms ticker when `elapsedMs > timeTargetMs`. There is no stuck
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
`loop-settle` variant and noise), and scene decoration (`render.js`, fixed `0xC0FFEE`). Nothing the
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
Hundred Hands (100 rounds). Grants are idempotent and mirrored to the host.

**Daily integrity.** `content.validateAll()` runs at boot. If a `daily-*` record fails validation the
client sets `dailyExcluded` and stops submitting that day rather than silently swapping the board.

---

## 6. Controls and interaction

| Input | Desktop | Mobile |
|---|---|---|
| Lift / drop | Click a peg, click a target | Tap a peg, tap a target |
| Drag | Press on the source, release over the target (>14 px counts as a drag) | Same; `touch-action: none` on the canvas keeps the gesture from scrolling |
| Cancel a lift | Click the lifted peg, or `Escape` | Tap the lifted peg |
| Undo / hint | `U` / `H`, or the rail buttons | Tray buttons |
| Pause | `P` or `Escape`, or the ❚❚ button | ❚❚ button |
| Board navigation | `←`/`→` (wrap), `↑`/`↓` (clamp), `Enter` or `Space` to act | The mirror buttons are ordinary tab stops |
| Camera reset | `R` | — |
| Gamepad | D-pad or left stick past ±0.6 to move focus, south act, east cancel, buttons 2/3 undo/hint, 9 pause | — |

Bindings and gamepad indices live in `settings.bindings` / `settings.gamepad` and are what the Help
screen prints. Pointer handling uses pointer capture, distinguishes tap from drag by distance, treats a
press held over 600 ms without movement as no action, and cancels cleanly on `pointercancel`.

**Input locking.** Only the terminal resolve locks input, and it lasts one frame: `endRound` calls
`render.settle()`, which zeroes the tween list and snaps every loop to its exact final position, so
skipping animation and letting it play produce byte-identical state. Peg presses are ignored whenever
`current.status !== 'active'`. Double-commit protection is by command id, not by a debounce timer.

**Feedback per input.** Legal lift: mirror `.selected`, loops rise, legal rings pulse, `select` clip,
8 ms haptic, announcement of the group size and colour. Legal drop: tween, drop particles, `move` clip,
14 ms haptic, board announcement. Rejection: peg shake, `invalid` clip, a `[30,40,30]` haptic pattern, a
toast naming the reason, the same text in the live region, and a −15 tally in the HUD score.

---

## 7. Screens and UI flow

App states (`data-appstate` on `<body>`): `boot → title → mode-select → active | tutorial ↔ paused →
resolving → results`, plus `preparing`, `countdown`, `reconnecting` and `progression` in the label table.
Every transition goes through `transition(next, reason)` in `main.js`, which announces the new state and
its reason. Screens (`data-screen`): `loading, title, modes, setup, play, pause, settings, results, help,
compat`. `play` is not an overlay — it is the HUD, the tray, the rails and the board mirror.

`Escape` backs out of whichever overlay is open (help → its return screen, settings → pause or title,
modes/setup → title, compat → play or title) with the softer `back` cue, and pauses during a round.
Opening an overlay moves focus to its first button.

**Desktop (≥1024 px).** Canvas fills the viewport. HUD strip across the top: objective left, moves/score
centre, drawer and pause right. 240 px rails, left objective/undo/hint/restart/skip and progression,
right mode/connection/top scores/achievements. Board mirror centred above the tray. Text blocks are
capped at 70 characters. The rails are hidden outside `play`, so menu screens show the backdrop, not
empty headings.

**Portrait mobile.** Rails collapse; `☰` and `Panel` open them as bottom drawers capped at 46 vh. The
mirror scrolls horizontally if the peg count exceeds the width, with 44×52 px minimum buttons. The tray
sits in the thumb zone.

**Landscape mobile (≤500 px tall).** The mirror moves to the bottom-right, clear of the tray; the rails
shrink to 200 px and re-anchor to the shorter viewport.

**Safe areas.** Every fixed edge uses `env(safe-area-inset-*)`; the viewport is `viewport-fit=cover`.
Nothing that can be cut off is load-bearing: objective, moves/score, pause, the mirror and the tray are
all inside the insets, and the toast and caption line sit clear of both the HUD and the mirror.

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

Loop colours (default palette): `#d64541 #3f7fd6 #4caf6d #f2c94c #9b59b6 #e67e22`. The DOM shell is
`--bg #1a1d24`, panels `rgba(28,32,40,.96)`, text `#eef1f5`, dim `#9aa4b2`, accent `#e8c07a`, primary
button `#3b6ea5`. High contrast swaps to pure black panels, `#fff` text, `#ffd700` accent and `#005fcc`
buttons, and drops the backdrop image entirely.

**Shape language.** Fat torus loops (R 0.3, tube 0.115) on slim tapered brass stems capped with a sphere
knob; a bone-white stitch marker per colour in a distinct solid — sphere, cone, box, octahedron, 4-sided
pyramid, cylinder. Ground rings mark legal targets in `#7fe08a`; the lift origin gets a `#ffd27a` ring.
UI is 9–14 px radii, one weight of the system sans, no decorative type.

**Motion.** One easing (ease-out cubic) and one duration (0.28 s) for loop travel; tweens are replaced,
never stacked, so an interrupted move never accumulates drift. Lift raises 1.1 units. Particles are a
bounded pool (150/400/900 by quality tier) with gravity −2.4. Shake is capped at 0.05 for a peg
completion and 0.12 for a win, decaying ×0.85 per frame, and never affects raycasting. Pointer parallax
is ±0.06/0.04 units of camera offset.

**Reduced motion** (setting or `prefers-reduced-motion`) removes all tweens, particles, shake, parallax
and CSS transitions; loops jump to their exact positions and the game is fully playable.

**Quality tiers.** auto (by `navigator.deviceMemory`), low (DPR 1, no shadows, 150 particles, low-poly
tori), medium, high (DPR 2, 900 particles). Shadow map 1024².

**Visual assets the design calls for.** A warm atelier key art that shows the actual object the game is
about (cover); a very dark, defocused atelier interior behind the menu overlays so the title screen has
depth without competing with the buttons; a woven linen scan for the table and mat so the surface reads
as cloth rather than flat colour. All three ship — see §15.

---

## 9. Audio direction

**Mix philosophy.** Everything is small, close-miked, wooden or soft — the sound of a hobby, not a slot
machine. Priority: input acknowledgment (quietest) < legal move < peg completion < round completion.
No stinger longer than three seconds.

**Buses.** `master → { music, effects, ambience, voice }`, with independent 0–1 sliders defaulting to
music 0.6, effects 0.8, ambience 0.4, voice 0.7, plus a master mute. Hint and achievement play on
`voice` so a player who mixes effects down still hears assistive cues. The context suspends when the tab
hides and resumes on return.

**Ambience.** A two-second loop of brown noise low-passed at 320 Hz — atelier room tone, generated at
runtime from the audiovisual RNG so it costs no download.

**Music.** A five-note pad (C, E♭, G, B♭, C) stepping every 1.6 s, with one, two or three voices
depending on how much of the board is already sorted — the room fills in as the player wins.

**Every clip is authored (MOSS-SoundEffect v2.0, 48 kHz mono Opus) with a procedural synth fallback**, so
a failed fetch degrades to a tone rather than silence. `sfx/manifest.txt` is the canonical table.

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

**Captions.** Every `playEvent` emits a caption string through `audio.onCaption`, shown for 2.2 s above
the board mirror — including while muted, so the cue survives a silent session.

---

## 10. Localization

The nine required locales are **en-US, en-GB, es-419, es-ES, de-DE, fr-FR, fr-CA, pt-BR, it-IT**.

Today all shipped strings are en-US and are authored inline: static copy in `index.html`, dynamic copy in
`src/main.js` (the `REASONS` table, `stateLabel`, HUD and rail text, help cards, results rows,
announcements), colour names in `src/content.js` and caption strings in `src/audio.js`. `<html lang>` is
`en`. The UI is already built for expansion — panels and buttons size to content, text blocks cap at
70 characters rather than at a pixel width, and nothing is laid out against a fixed English string length
— so a 35 % expansion into de-DE fits without reflow work. Extracting these strings into a locale table
with a `navigator.language` chooser and a settings override is the largest outstanding gap in the game;
see §17.

---

## 11. Accessibility

- **Keyboard-only path is complete.** Title → mode → setup → solve → results without a pointer:
  overlay buttons are ordinary tab stops, arrows move peg focus with wrap, `Enter`/`Space` lift and drop,
  `Escape` cancels or backs out, `U`/`H`/`P`/`R` cover undo, hint, pause and camera reset.
- **Focus.** Opening an overlay focuses its first button. Rebuilding the board mirror restores focus to
  the peg index that had it, so operating a peg never dumps focus to `<body>`. Focus rings are a 3 px
  accent outline with 2 px offset and are never suppressed.
- **Screen readers.** `#live-region` (`aria-live="polite"`) announces state transitions with their
  reason, the lifted group's size and colour name, the full board after every move, every rejection
  reason, hints and the final score. Each peg button's `aria-label` is `Peg n: crimson, indigo, indigo`
  (or `empty`), suffixed `(lifted)` while selected.
- **Captions** mirror every sound effect as text.
- **Colour.** Name + glyph + 3D shape on every loop; four colour-vision palettes and a high-contrast UI
  mode that forces black panels, white text and gold accents.
- **Motion.** A reduced-motion setting plus honouring `prefers-reduced-motion` at the CSS level.
- **Targets.** All buttons are at least 44×44 px; mirror pegs are 52×56 px on desktop and 44×52 px on
  small portrait screens, with 8 px gaps.
- **Text.** A larger-text setting scales the whole shell to 120 %. Left-handed mode reverses the tray.

---

## 12. StarHermit integration

`starhermit.txt` declares `name`, `launch=index.html`, `owner`, `server=server.js`, `cover=coverart.png`.

**Used.** Launch-token handshake (`platform.handshake()` reads `launch_token` from the query string,
holds it in memory only — never in storage — and scrubs the URL); activity pairing (`/api/v1/activity`
start/end, also on visibility change) so host playtime is accurate; throttled presence heartbeats
(`/api/v1/presence`, at most every 30 s, only while moves are being made); server time
(`/api/v1/time`, round-trip corrected) as the authority for the Daily's UTC day; leaderboards
(`/api/v1/scores` GET/POST) for Daily and Score Chase, submitted as a replay envelope and re-validated
server-side; achievements (`/api/v1/achievements`, idempotent per session id); anonymous aggregate
telemetry (`/api/v1/telemetry`), sent only with explicit consent and only as counters from a six-event
allowlist. `server.js` implements all of these, with per-IP token buckets (API 40 burst / 4 per second,
static 240 / 30) and JSON stores under `.server-data/`.

**Not used.** Real-time multiplayer, matchmaking, parties, chat, friends lists, cloud saves, entitlements
or purchases. Loop Loom is solo; the only social surface is asynchronous score comparison. The game is
fully playable with the whole API unreachable — every call resolves to `{ ok: false, error: 'offline' }`,
the status rail says so, and scores fall back to the local boards.

**Anti-cheat.** `POST /api/v1/scores` never trusts a client board or score. It re-derives the record from
`contentId`, rejects mismatched content or rules versions with 409, replays the command log through the
same `rules.js` the client used, recomputes the score, rejects a move count below par as impossible, and
stores the result idempotently per session+content. Practice and Challenge ids resolve to `null` and are
refused as unranked.

---

## 13. Technical architecture

**Module boundaries.** `rules.js` imports nothing and touches no DOM. `content.js` imports only
`rules.js`. `session.js` adds persistence and achievements on top of `rules.js`. `render.js` and
`audio.js` consume immutable snapshots and never write state. `main.js` is the only module that owns a
transition, and `server.js` re-uses `rules.js`, `content.js` and `validateReplay` unmodified — client and
host cannot drift, because they are the same functions.

**Determinism and replay.** The envelope is `{ schema, rulesVersion, contentVersion, contentId, seed,
initialHash, startedAt, commands[], hashes[], result }`, where `hashes` samples the FNV-1a state hash
every fifth tick plus the final one. `validateReplay` reconstructs the session from the record, refuses a
seed or initial-hash mismatch, applies every command (any illegal one aborts), and compares the final
hash and score. A property test drives random command streams through it.

**Persistence** (`localStorage`, versioned keys): `looploom.settings.v1`, `looploom.progress.v1`
(checksummed — a failed checksum silently resets to defaults rather than loading tampered progress),
`looploom.snapshot.v1` (the active round, cleared when it ends), `looploom.scores.v1` (top 50 global,
top 20 per day), `looploom.sessionid.v1`, `looploom.analytics.v1`. Every read and write is wrapped, so
blocked or full storage degrades to an in-memory session.

**Lifecycle.** Hiding the tab pauses an active round, saves a snapshot, stops the render loop and ends
the activity; returning restarts the renderer, restarts activity and toasts a "while you were away"
line. `webglcontextlost` is preventDefaulted and drops to the DOM board; `webglcontextrestored` rebuilds
the scene and re-pushes the board.

**Performance budgets.** One `requestAnimationFrame` loop with `dt` clamped to 50 ms. Geometry is built
once per board and pooled — `cap × pegCount` loop slots, reused by colour swap; particles are a fixed
1200-point buffer with dead points parked at `y = −10`; markers and pick cylinders are per-peg and
static. Rebuilds happen only when the peg count or capacity changes. Raycasts hit `LAYER_GAME` only —
eight invisible cylinders, never the scenery or the particles.

**How the e2e drives the real UI.** `tests/e2e.mjs` serves the repo on an ephemeral port, launches system
Chrome, and clicks only visible controls. It reads the board back out of the mirror buttons'
`aria-label`s, runs its own BFS (an independent re-implementation of the legality rules, so a rules bug
would desynchronise it), and clicks its way to a solve. Any console error or page error that is not
known GPU noise or an expected offline `/api/*` 404 fails the run.

---

## 14. Testing and acceptance criteria

`npm test` builds the bundle and runs 31 `node --test` cases:

- **Rules** — group lift boundaries, capacity truncation, every rejection reason, invalid tallying,
  solved and move-limit terminals, monotonic `tick`, integer score components, serialization round-trip,
  generated boards solvable/balanced/par-bounded, same seed → same board, hint legality, and a fuzz pass
  proving malformed commands never hang or corrupt state.
- **Content** — every Journey stage, lesson, challenge, a Daily and a Score Chase pass
  `validateContent` (legal, balanced, reachable, par matches the solver, no soft lock, move limit ≥ par).
- **Session** — command validation, idempotent duplicate ids, undo bookkeeping, replay envelope
  determinism, invalid attempts counted exactly once and surviving a replay, snapshot round-trip,
  malformed envelopes rejected without throwing, journey unlock advancing exactly one stage, stable
  achievement ids, and a golden test pinning representative session scores.

`npm run test:e2e` runs three passes — desktop 1280×800, mobile 390×844 with touch, and a no-WebGL pass
— each covering title, modes open/close (button and `Escape`), setup, round start, a deliberate illegal
drop (rejected, board unchanged, charged exactly −15 once), pause → settings → resume, a full solve
through the peg buttons, the results screen reading "Loom complete!", and the return to title.

**QA bar, as checkable statements.** Every mode the title and modes screens expose is reachable and
completable in the browser. The first-time player is taught by Learn, which requires the action, and by a
setup screen that states the rules before commitment. No console errors or warnings in any pass. At 1280×800,
390×844 portrait and 844×390 landscape, no text or control is clipped: the mirror scrolls rather than
overflowing, rails become drawers, and every fixed element is inside the safe-area insets. Every feature
that could use a StarHermit endpoint does (§12).

---

## 15. Asset inventory

| Path | Purpose | Source | Status |
|---|---|---|---|
| `coverart.png` | 1200×675 StarHermit cover: the peg board on a linen mat, one crimson loop mid-lift | FLUX.2 klein, seed 70110, 1216×688 → scaled, 256-colour PNG (314 KB) | generated in this pass (replaced a generic template placeholder) |
| `assets/atelier-backdrop.webp` | Dark defocused atelier behind the title/modes/setup overlays | FLUX.2 klein, seed 40287, 1536×864 → 1280×720 WebP (10 KB) | generated in this pass, wired as `#backdrop` in `index.html` |
| `assets/linen-weave.webp` | Woven linen scan on the table top (8×5 repeat) and the mat (3×3) | FLUX.2 klein, seed 91554, 768×768 → 512×512 WebP (87 KB) | generated in this pass, wired in `render.js buildEnvironment` |
| `favicon.svg`, `icon.png` | Browser and host icons | authored | shipped |
| `sfx/loop-lift.opus` … `sfx/achievement-unlock.opus` (12 clips) | Core event set — see §9 | MOSS-SoundEffect v2.0, 100 steps | shipped |
| `sfx/round-start.opus` | Round-start shuttle sweep | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `round-start` |
| `sfx/ui-back.opus` | Backing-out cue distinct from the forward click | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `back` |
| `sfx/time-warning.opus` | Ten-seconds-left cue in Swift Shuttle | MOSS-SoundEffect v2.0, 100 steps | generated in this pass, bound to `time-warning` |
| Loops, pegs, table, mat, spools, fibre strands | The entire 3D scene | Procedural Three.js primitives in `render.js` | shipped — no mesh files, nothing to download |
| Ambience and music | Room tone and the adaptive pad | Procedural WebAudio in `audio.js` | shipped |

No 3D model files or character animations ship: the loom is a handful of primitives, which loads
instantly and re-colours per theme, and the game has no humanoid to animate.

Every texture load is optional. If `linen-weave.webp` or `atelier-backdrop.webp` fails to fetch, the flat
theme colours and the `#17130f` backdrop ground stay in place and nothing else changes.

---

## 16. Known limitations

- **English only.** Nine locales are required; nine are not implemented (§10).
- **Local boards are per-device.** With the host unreachable, `Top scores` shows only this browser's
  results and every entry is the local player's, so the comparison line on the results screen is a
  personal best rather than a ranking.
- **Practice and Challenge scores are unranked by construction.** Their ids resolve to `null` on the
  server, so a strong Challenge run is recorded locally and nowhere else.
- **The 3D scene is decorative for play purposes.** Every decision can be made from the DOM mirror; a
  player who ignores the canvas loses nothing but atmosphere.
- **The gamepad path is polled, not tested end-to-end.** It is exercised by hand, not by `tests/e2e.mjs`.
- **`holdToLift` and `timingAssist` settings persist but only `timingAssist` changes behaviour** (it
  suppresses the speed-challenge timer); tap-to-select is always the pointer model.
- **No cloud save.** Progress lives in this browser's `localStorage`; clearing site data resets the
  Journey.

---

## 17. Design intent not yet implemented

1. **Localization.** A `src/i18n.js` locale table keyed by string id, `data-i18n` attributes on the
   static markup in `index.html`, a chooser that reads `navigator.language` with a settings override,
   and translations for en-US, en-GB, es-419, es-ES, de-DE, fr-FR, fr-CA, pt-BR and it-IT. The layout
   already tolerates the expansion; only the string extraction and the translations are missing.
2. **Hold-to-lift pointer mode.** The setting exists and persists; the pointer handler still only
   implements tap-to-select and drag.
3. **Server-backed friend comparison.** `fetchScores` and the server's GET board exist, but the results
   screen only reads the local board, so an online player sees their own history rather than the global
   top entries.

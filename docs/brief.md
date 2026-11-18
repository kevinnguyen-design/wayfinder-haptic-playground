# BRIEF: Wayfinder Haptic Playground

Read this entire file before writing any code. It is the single source of truth. If something here conflicts with a default habit of yours, this file wins.

---

## 1. What we are building

A public, static web app that lets anyone **see, hear, and (on Android) feel** how a haptic navigation system communicates directions, and lets them **design their own haptic vocabulary** by mixing and matching patterns.

It is a portfolio piece for **Kevin**, a Product Design graduate (Drexel, 2026) who works across hardware, firmware, UI/UX and front-end. It turns his senior thesis, **Wayfinder**, from a concept people can only read about into something they can experience in seconds. It will be put on GitHub, shared on LinkedIn, and opened by recruiters and talent hunters who give it about five seconds.

### The Wayfinder concept (domain context)

- A haptic navigation wearable for **sensory-sensitive pedestrians** who need to navigate **without screen or audio cues**.
- Core tension from user research: people could not settle between **comfort** and **function**, and no single wearable delivers both with current technology. Resolution: **two devices**. A **shoe insole** leans toward function (clear, directional, urgent). An **armband** leans toward comfort (gentle, confirming, ambient).
- Kevin designed a **custom haptic vocabulary**. His guiding principle: **vibration should work like punctuation, not prose.** Short, distinct, learnable marks, never long messages.
- Real hardware: Seeed Studio XIAO nRF52840 (BLE, IMU), DRV2605L haptic driver. About 10 users tested for sensitivity and comfort. The project is a concept with form prototypes, not a finished product. **Never claim more than that anywhere in the UI or README.**

---

## 2. Non-negotiables

These decisions were made deliberately. Do not revisit them.

1. **The 5-second rule.** On page load, with zero clicks, the visitor must see a moving, self-explanatory demo and understand "directions you feel, not see" within 5 seconds. No splash screen, no onboarding modal, no sign-up, no permission prompt, no cookie banner.
2. **No installs or prerequisites.** No Web Bluetooth, no app, no extension, no pairing. Anything requiring the visitor to set something up is out.
3. **No backend.** Static site only. No accounts, no database, no API keys, no analytics SDK, no map tiles, no third-party requests at runtime (self-hosted or system fonts only).
4. **The Vibration API is a silent bonus.** `navigator.vibrate` works only in Chromium-based browsers on Android, and cannot set amplitude (only on/off durations). If it exists, also buzz alongside audio and visuals. If it does not, do nothing and **show no error, warning or "unsupported" message**. Never mention it in the UI.
5. **Audio needs one gesture.** Browsers block autoplay audio. The hero plays visually immediately. Sound is unlocked by one prominent, obvious tap ("Hear it"). Sound off is the default state.
6. **Mobile portrait first.** Most LinkedIn clicks are on phones. Design 390px wide first, then scale up.
7. **Small and fast.** Budgets in section 12. Prefer platform APIs over libraries.
8. **Scope discipline.** Build what is in this brief. Anything not listed is out of scope (section 14). If you think something is missing, add it to a `NOTES.md` as a suggestion; do not build it.

---

## 3. Experience design

### 3.1 First 5 seconds (hero)

On load the viewport shows, stacked on mobile and side by side on wide screens:

- **Stage (top):** an SVG route on an abstract grid. A dot (the walker) walks along a path, in a continuous loop.
- **Body diagram (below or beside):** a simple, abstract figure showing **left insole, right insole, and armband**. When a haptic event fires, the matching device pulses visually (expanding rings plus glow), in sync with the walker.
- **Caption line** that changes with each cue, e.g. `Left turn: two firm pulses, left insole.` The caption names the cue and describes the pattern in plain words. This is what makes the cause and effect legible.
- **One primary button:** `Hear it` (toggles to `Sound on`). Large, thumb-reachable, unmistakable.
- Title and one-line promise above the stage: **"Directions you feel, not see."** Subtitle: a short sentence about Wayfinder as a thesis project.

The default loop must exercise **every cue at least once within roughly 25 to 30 seconds**, ordered so a visitor sees a left turn, a right turn, then something distinct (off-route or arrive) inside the first ~8 seconds.

### 3.2 Page sections (scroll order)

1. **Hero** (3.1).
2. **Your vocabulary**: the cue list (3.3) with mix-and-match.
3. **Try your own route**: tap/click to place waypoints and watch cues generate (3.5).
4. **Pattern editor** (3.4), reached from the vocabulary list. Can be a bottom sheet on mobile.
5. **For builders**: "Copy as firmware" export (section 9), short note about the real hardware, links to GitHub and the thesis context.
6. **Footer**: author credit, GitHub link, LinkedIn link, MIT license. Use placeholder constants for URLs in one `config.ts`.

The hero must remain the star. Sections 2 to 5 sit below the fold and must never delay first paint.

### 3.3 Vocabulary: mix and match

A **vocabulary** maps **cues** (what the system wants to say) to **patterns** (how it feels). The page loads with a default vocabulary (section 5). Users can:

- **Swap:** tap a cue row, pick any pattern from the **pattern library** (a grid of preview chips; tapping a chip plays it, a confirm button assigns it). Any pattern can be assigned to any cue.
- **Preset vocabularies:** a switcher with the presets in section 5.3. Switching applies instantly and the hero loop continues with the new vocabulary.
- **Edit:** open any pattern in the editor, change it, save as a copy (built-in patterns are read-only; "Duplicate and edit").
- **Create:** new empty pattern, or duplicate.
- **Reset:** per cue and whole vocabulary.
- **Ambiguity warning:** if two cues are assigned patterns that are too similar to tell apart (rule in 3.6), show a small inline warning on both rows: "Hard to tell apart from <other cue>". This is advice, never blocking.
- **Share:** "Share my vocabulary" copies a URL containing the entire vocabulary in the hash (section 8). Opening that URL loads it instantly, with the hero looping on it.
- **Import / export JSON:** download and upload the vocabulary file (validated, with friendly errors).
- **Persistence:** last-used vocabulary saved in `localStorage` (wrapped in try/catch; the app must work when storage is unavailable). A hash in the URL takes priority over storage.

Every cue row has a **play** button that fires that pattern on the visual, audio and vibration adapters, so people can compare quickly without waiting for the walker.

### 3.4 Pattern editor

A compact, touch-friendly **lane timeline**:

- One horizontal lane per **channel** (section 4.1): left insole, right insole, armband.
- Time axis 0 to max 1500 ms, with snapping to 10 ms.
- Each haptic event is a block: x position = start, width = duration, height/opacity = intensity (0 to 1). Add, drag, resize, delete. Tap-to-add on empty lane space with a default 80 ms event.
- Per-event controls: intensity slider, shape (`flat`, `rampUp`, `rampDown`).
- **Play** button and a moving playhead. Plays through all adapters.
- Live validation (section 4.3) with plain-language messages.
- Must work on a 390px wide screen with thumbs. Blocks need minimum 44px touch targets even when visually short (use padding/hit areas).

### 3.5 Try your own route

- Tap/click the stage to place waypoints (min 2, max 12). A "Clear" button and a "Random route" button.
- A route always starts with `start` and ends with `arrive`.
- A "Wander off route" button nudges the walker off the path to demonstrate `off-route`; the walker then snaps back when within threshold.
- Speed control (0.5x, 1x, 2x) and pause/play.
- Cues are generated by the cue engine (section 6) using the **current vocabulary**.

### 3.6 Distinguishability heuristic

Implement `similarity(a: Pattern, b: Pattern): number` in the core engine, returning 0 to 1, and warn above 0.8. Keep it simple and explainable: compare the set of channels used, the number of events, and the sequence of normalised event durations and gaps. Document the heuristic in code comments. This is a design heuristic, not validated research. Do not describe it as scientific anywhere.

---

## 4. Domain model

### 4.1 Channels (fixed in v1)

```ts
export type ChannelId = 'insole-l' | 'insole-r' | 'armband';

export interface Channel {
  id: ChannelId;
  label: string;                 // "Left insole"
  device: 'insole' | 'armband';
  side: 'left' | 'right' | 'none';
}
```

> **Assumption to confirm with Kevin:** the insole system has a left and a right unit, and the armband is a single unit. If the real hardware differs, only the `CHANNELS` constant and the diagram component change. Keep channels data-driven so that is true.

### 4.2 Core types

```ts
export type CueId =
  | 'start' | 'continue'
  | 'slight-left' | 'slight-right'
  | 'turn-left' | 'turn-right'
  | 'u-turn' | 'off-route' | 'arrive';

export type Shape = 'flat' | 'rampUp' | 'rampDown';

export interface HapticEvent {
  channel: ChannelId;
  startMs: number;               // >= 0
  durationMs: number;            // 20..600
  intensity: number;             // 0.1..1
  shape?: Shape;                 // default 'flat'
}

export interface Pattern {
  id: string;                    // stable slug, e.g. 'double-firm'
  name: string;                  // human label
  description: string;           // plain-language, used in captions
  events: HapticEvent[];
  builtin: boolean;
}

export interface Vocabulary {
  version: 1;
  id: string;
  name: string;
  patterns: Record<string, Pattern>;           // the pattern library in use
  assignments: Record<CueId, string>;          // cue -> pattern id
}
```

### 4.3 Validation rules (design heuristics, enforce in `validatePattern`)

- Pattern total length **<= 1500 ms**. Cues must be glanceable.
- **<= 8 events** per pattern.
- Event duration **20..600 ms**, intensity **0.1..1**.
- Minimum gap between consecutive events **on the same channel: 60 ms** (otherwise they blur into one).
- Pattern must have at least one event.
- Every cue in a vocabulary must reference an existing pattern.

`validatePattern` returns a list of `{ severity: 'error' | 'warning', message }`. Errors block save. Warnings do not.

---

## 5. The haptic vocabulary (the content, build exactly this)

Principle: **punctuation, not prose.** Insoles carry **direction and urgency** (function). The armband carries **state and reassurance** (comfort). Left/right turns are felt on the matching foot, so the meaning is understood in seconds without being taught.

### 5.1 Pattern library (all built-in, read-only)

Times are in ms. `I` is intensity. Event notation: `channel@start+duration I`.

| id | name | description (for captions) | events |
|---|---|---|---|
| `tick-soft` | Soft tick | one soft tap | `armband@0+40 I0.3` |
| `tick-L` | Light tap, left foot | a light tap on the left foot | `insole-l@0+60 I0.5` |
| `tick-R` | Light tap, right foot | a light tap on the right foot | `insole-r@0+60 I0.5` |
| `double-L` | Firm double, left foot | two firm pulses on the left foot | `insole-l@0+90 I0.9`, `insole-l@180+90 I0.9` |
| `double-R` | Firm double, right foot | two firm pulses on the right foot | `insole-r@0+90 I0.9`, `insole-r@180+90 I0.9` |
| `long-L` | Long press, left foot | one long pulse on the left foot | `insole-l@0+350 I0.8` |
| `long-R` | Long press, right foot | one long pulse on the right foot | `insole-r@0+350 I0.8` |
| `alternate-feet` | Alternate feet | left then right foot, twice | `insole-l@0+200 I0.8`, `insole-r@260+200 I0.8`, `insole-l@520+200 I0.8`, `insole-r@780+200 I0.8` |
| `rising-three` | Rising three | three armband pulses that grow stronger | `armband@0+110 I0.4`, `armband@200+110 I0.6`, `armband@400+240 I0.9` |
| `soft-double-arm` | Soft double, armband | two gentle armband pulses | `armband@0+70 I0.35`, `armband@160+70 I0.35` |
| `alarm-all` | All-device buzz | every device buzzes together | `insole-l@0+500 I0.9`, `insole-r@0+500 I0.9`, `armband@0+500 I0.9` |
| `swell-arm` | Armband swell | one armband pulse that fades in | `armband@0+450 I0.7 rampUp` |
| `short-long-arm` | Short then long, armband | a short pulse then a long one | `armband@0+60 I0.5`, `armband@160+300 I0.5` |
| `long-short-arm` | Long then short, armband | a long pulse then a short one | `armband@0+300 I0.5`, `armband@400+60 I0.5` |
| `echo-L` | Left foot with armband echo | a firm left pulse, then a soft armband echo | `insole-l@0+90 I0.9`, `armband@200+70 I0.35` |
| `echo-R` | Right foot with armband echo | a firm right pulse, then a soft armband echo | `insole-r@0+90 I0.9`, `armband@200+70 I0.35` |

### 5.2 Default vocabulary: "Wayfinder Default"

| cue | pattern | meaning |
|---|---|---|
| `start` | `soft-double-arm` | "Ready, we're going." |
| `continue` | `tick-soft` | "Still on track." (emitted sparingly) |
| `slight-left` | `tick-L` | small correction left |
| `slight-right` | `tick-R` | small correction right |
| `turn-left` | `double-L` | turn left |
| `turn-right` | `double-R` | turn right |
| `u-turn` | `alternate-feet` | turn around |
| `off-route` | `alarm-all` | you've left the route |
| `arrive` | `rising-three` | you've arrived |

### 5.3 Preset vocabularies (switcher)

1. **Wayfinder Default**: as above.
2. **Armband only (quiet)**: for people who do not want insoles. Direction is carried by rhythm on one channel. `turn-left` = `short-long-arm`, `turn-right` = `long-short-arm`, `slight-left` = `soft-double-arm`, `slight-right` = `tick-soft`, `u-turn` = `rising-three`, `off-route` = `alarm-all`, `arrive` = `swell-arm`, `start` = `soft-double-arm`, `continue` = `tick-soft`. (Duplicated assignments are allowed; the ambiguity warning should flag them, which also demonstrates the feature. If the warning noise is excessive for a built-in preset, adjust assignments so the preset itself has no warnings.)
3. **Insoles only (function first)**: `turn-left` = `double-L`, `turn-right` = `double-R`, `slight-left` = `tick-L`, `slight-right` = `tick-R`, `u-turn` = `alternate-feet`, `off-route` = `alarm-all`, `arrive` = `long-L`, `start` = `long-R`, `continue` = `tick-L`. If this produces ambiguity warnings, adjust the preset, not the heuristic.
4. **Echo (comfort layered on function)**: `turn-left` = `echo-L`, `turn-right` = `echo-R`, others as Default.

All presets must be valid per 4.3 and warning-free per 3.6.

---

## 6. Cue engine (pure, framework-free)

All logic below lives in `src/core/` with **no React, no DOM, no Web APIs**, and is fully unit tested.

- Input: a route (`Point[]`), walker position, and a `lookaheadUnits` constant (default 40).
- Heading change at a waypoint = absolute angle difference between the incoming and outgoing segments, normalised to 0..180.
- Classification:
  - `< 20` degrees: `continue` (emit at most once every 8 seconds of walker time)
  - `20 to < 50`: `slight-left` or `slight-right` (sign decides side)
  - `50 to < 135`: `turn-left` or `turn-right`
  - `>= 135`: `u-turn`
- The cue fires when the walker is within `lookaheadUnits` of the waypoint, once per waypoint.
- `start` fires at the first frame of a run. `arrive` fires when the walker reaches the final waypoint.
- `off-route` fires when the walker's perpendicular distance to the path exceeds `offRouteThreshold` (default 28 units) and re-arms when the walker returns within `returnThreshold` (default 12).
- API sketch:

```ts
export function classifyTurn(prev: Point, at: Point, next: Point): CueId;
export function createRouteRunner(route: Point[], opts?: RunnerOptions): {
  step(dtMs: number): { position: Point; cues: CueId[]; done: boolean };
  nudgeOffRoute(): void;
  reset(): void;
};
export function resolveCue(vocab: Vocabulary, cue: CueId): Pattern;
export function validatePattern(p: Pattern): Issue[];
export function validateVocabulary(v: Vocabulary): Issue[];
export function similarity(a: Pattern, b: Pattern): number;
export function toFirmware(vocab: Vocabulary, opts: ExportOptions): string;
```

---

## 7. Output adapters

The engine never talks to the browser directly. A single `HapticBus` receives `play(pattern, { source })` and fans out to adapters. Each adapter implements:

```ts
interface HapticAdapter {
  play(pattern: Pattern): void;
  stop(): void;
}
```

- **VisualAdapter**: drives UI state (which channels are active, with intensity and time) so React components render rings and glow. Use CSS animations / Web Animations API, not an animation library. Respect `prefers-reduced-motion` by replacing expanding rings with simple opacity changes.
- **AudioAdapter** (Web Audio API, no audio files): synthesised.
  - One lazily created `AudioContext`, resumed on the first user gesture (the "Hear it" button).
  - Each event becomes an oscillator with a gain envelope: ~5 ms attack, held to `durationMs`, ~20 ms release. Intensity maps to peak gain (cap at a comfortable level, no clipping).
  - Timbre by channel: insoles = low triangle wave around 90 to 120 Hz (a thump); armband = higher sine around 280 to 340 Hz (a softer tone). Left/right insoles pan to -0.5 and +0.5 with `StereoPannerNode`; armband centre or slightly right.
  - `rampUp` / `rampDown` shape the gain envelope.
  - Muted by default. A visible toggle. Never auto-unmute.
- **VibrationAdapter**: if `'vibrate' in navigator`, collapse the pattern (all channels merged by time) into a `navigator.vibrate([...])` array of on/off durations. If unsupported, a complete no-op with no UI feedback. Call it only from user-gesture-initiated or already-activated contexts; failures must be swallowed silently.

---

## 8. State, persistence, sharing

- **State:** Zustand store for vocabulary, route, runner state, mute flag, UI selection. Keep the engine state outside React render loops (use `requestAnimationFrame` with a fixed-step runner and pause when the tab is hidden).
- **URL sharing:** serialise the vocabulary to JSON, compress with the native `CompressionStream('deflate-raw')` where available, base64url encode, and place it in `location.hash` as `#v=<payload>`. Fall back to uncompressed base64url if `CompressionStream` is missing. Keep the encoded string under ~2 KB for typical vocabularies; show a graceful message if it would exceed ~6 KB. On load, parse, **validate hard** (treat the hash as untrusted input), and fall back to the default on any error without showing an error screen.
- **localStorage:** last vocabulary, mute preference not persisted (always starts muted). All access in try/catch.
- **JSON import:** same validation as the hash.

---

## 9. Firmware export ("Copy as firmware")

Goal: prove the web demo is connected to real hardware (XIAO nRF52840 with a DRV2605L). Output is Arduino C++ using the Adafruit DRV2605 library, copied to clipboard and shown in a modal with a code block (no syntax-highlighting library; plain `<pre>` with simple styling).

Two export modes (toggle):

1. **Realtime (exact):** uses real-time playback mode. Faithful to timing and intensity. For each event: set amplitude, wait, set zero. Generated code uses `DRV2605_MODE_REALTIME` and `setRealtimeValue(...)`. This is the default.
2. **Effects (ROM library):** maps events to built-in effects through the waveform sequencer where a wait is encoded by setting the high bit (`0x80 | (ms / 10)`). Use a **small, conservative** mapping table in code (for example, strong click, sharp click, soft bump, double click, triple click, strong buzz, alert) and **mark every effect ID with `// verify against TI DRV2605L datasheet`**. Do not invent IDs you cannot defend. If unsure, leave a `TODO` comment instead of guessing. Select the ERM/LRA library via an export option (`library` and motor type), defaulting to LRA.

Both modes must:

- Emit one function per cue, e.g. `void cue_turn_left()`, plus a `void playCue(CueId)` switch.
- Respect channels with clear stubs: the DRV2605L has a fixed I2C address, so multiple drivers need an I2C multiplexer. Generate `selectChannel(CH_INSOLE_L)` style stubs with a `// TODO: map to your mux port or driver instance` comment.
- Avoid claiming tested hardware behaviour. Top-of-file comment: generated by the Wayfinder Haptic Playground, review before flashing.
- Be covered by snapshot-style unit tests (string output for the default vocabulary).

---

## 10. Visual and UX design direction

Kevin's design stance is **utilitarian**, with a "practical maximalist" streak. Think technical instrument, not startup landing page.

- **Do not** use the generic AI aesthetic: purple/blue gradients, glassmorphism, centred hero with a generic gradient blob, emoji as icons, stock illustration.
- Clean, high-contrast, engineered. A restrained palette: near-black and off-white base, **one** strong signal colour for active haptics (choose one, e.g. a signal orange or acid green) and a muted second for secondary states. Provide both light and dark via CSS variables and `prefers-color-scheme`.
- Typography: system font stack for body; if one display face is used, self-host a **single subsetted woff2** with `font-display: swap`. A monospaced face (system `ui-monospace`) for timings, labels and code.
- Layout: strict grid, generous spacing, thin 1px rules. Show data like an instrument readout (e.g. `0090 ms · I 0.9 · L-INSOLE`).
- Body diagram: simple geometric figure in SVG. It must read clearly at 140 px tall on a phone.
- Motion: purposeful only. Rings expand on events; the walker moves smoothly; nothing else animates idly.
- Touch: all controls >= 44x44 px. No hover-only affordances.
- Copy tone: plain, confident, short. No hype, no "revolutionary". The honest framing is "a thesis concept, made playable".

---

## 11. Architecture and stack

**Stack:** Vite, React, TypeScript (strict), Zustand, Tailwind CSS (current stable at project start; pin versions in `package.json`), Vitest, ESLint, Prettier. No router (single page). No UI kit. No animation library. No chart library.

**Repo layout:**

```
wayfinder-haptic-playground/
  README.md
  brief.md                  (this file, kept in repo under /docs)
  NOTES.md                  (suggestions you chose not to build)
  LICENSE                   (MIT)
  index.html
  vite.config.ts
  src/
    core/                   (pure TS, 100% testable)
      types.ts
      channels.ts
      cues.ts
      route.ts
      validate.ts
      similarity.ts
      firmware.ts
      codec.ts              (vocabulary <-> hash/JSON, validation)
      data/
        patterns.ts
        vocabularies.ts
    adapters/
      bus.ts
      visual.ts
      audio.ts
      vibration.ts
    state/
      store.ts
    ui/
      Hero.tsx
      Stage.tsx
      BodyDiagram.tsx
      VocabularyList.tsx
      PatternPicker.tsx
      PatternEditor.tsx
      RouteBuilder.tsx
      FirmwareModal.tsx
      ShareButton.tsx
    config.ts               (URLs, copy constants)
    main.tsx
  public/
    og.png                  (1200x630 social preview)
    favicon.svg
  .github/workflows/ci.yml  (lint, typecheck, test, build)
  docs/
```

**Dependency rule:** `core` imports nothing from `adapters`, `state` or `ui`. `ui` may import from all. Enforce with an ESLint restriction.

---

## 12. Quality bars

- **Performance:** initial JS <= 120 KB gzipped, total initial transfer <= 200 KB. Largest Contentful Paint < 1.5 s on mid-range mobile over 4G. Lighthouse mobile: Performance >= 95, Accessibility >= 95, Best Practices >= 95, SEO >= 90. Lazy-load the pattern editor and firmware modal with dynamic `import()`.
- **Accessibility:** fully keyboard operable; visible focus; semantic buttons and labels; `aria-live="polite"` on the caption line; meaning is never conveyed by colour alone (labels and icons too); `prefers-reduced-motion` honoured; sound is opt-in; contrast WCAG AA.
- **Testing (Vitest):** classification boundaries, route runner (cue timing, once-per-waypoint, off-route and re-arm), `validatePattern`, `validateVocabulary`, `similarity`, codec round trip plus hostile input, firmware output snapshots for the default vocabulary, all presets validate and are warning-free.
- **Type safety:** `strict`, no `any`, no non-null assertions without a comment.
- **Robustness:** corrupted hash, corrupted localStorage, no `localStorage`, no `AudioContext`, no `CompressionStream`, and `prefers-reduced-motion` must not break the page.
- **CI:** one GitHub Actions workflow running lint, typecheck, tests and build on push and PR.

---

## 13. Delivery phases

Work in these phases in order. **Commit at the end of each phase** with a clear message. After each phase run lint, typecheck and tests, and fix before moving on. Do not start a phase until the previous acceptance criteria pass. Stay concise in your replies; do not paste large files back.

**Phase 1: Foundation.** Scaffold, tooling, CI, `core/types`, `channels`, `data/patterns`, `data/vocabularies`, `validate`. All presets validate. *Accept:* tests green; every library pattern and preset passes validation.

**Phase 2: Engine.** `cues`, `route`, `similarity`, `codec`. *Accept:* the engine tests in section 12 pass; a default route produces every cue.

**Phase 3: Hero.** Stage, body diagram, walker loop, visual adapter, caption line, audio adapter plus "Hear it", silent vibration adapter, responsive layout, design tokens and dark/light. *Accept:* with no clicks, a moving demo plays on load; a first-time viewer can say what it does within 5 seconds; mobile portrait looks intentional.

**Phase 4: Vocabulary.** Cue list with play buttons, pattern picker, preset switcher, ambiguity warnings, persistence, share link, JSON import/export. *Accept:* swapping a pattern changes what the hero loop plays on the next occurrence of that cue; a shared link reproduces a custom vocabulary exactly.

**Phase 5: Editor and routes.** Lane timeline editor with validation; "Try your own route", wander-off, speed. *Accept:* a user can make a new pattern on a phone and assign it to a cue; custom routes generate correct cues.

**Phase 6: Export and polish.** Firmware modal and exporters, performance pass against budgets, accessibility pass, `og.png`, favicon, meta tags (title, description, Open Graph, Twitter card so a LinkedIn link preview looks good). *Accept:* all quality bars in section 12 met; measured and reported in the README.

**Phase 7: Ship.** README (section 15), deploy config (Vercel or GitHub Pages; if Pages, set Vite `base` correctly), final CI green. *Accept:* live URL works on a phone, hash links work on the deployed URL.

---

## 14. Out of scope (do not build)

Web Bluetooth or any hardware connection. User accounts, sync, or a backend. Real maps or geolocation. Speech or voice. A native app. Analytics or tracking. A CMS. Internationalisation (English only in v1). A tutorial or onboarding flow. Dark patterns of any kind. Any claim of clinical validation or accessibility certification.

---

## 15. README requirements

The README is part of the product. Structure:

1. Title, one-line promise, **live demo link**, and a **GIF** of the hero (record at the end; leave a clearly marked placeholder).
2. "What this is": two honest sentences, including that Wayfinder is a thesis concept with form prototypes.
3. "Try this": three things to do in 30 seconds (watch the loop and tap Hear it; swap a pattern; share your vocabulary).
4. "Design decisions": comfort vs function and the two-device split, vibration as punctuation, insoles for direction and armband for state, why no Bluetooth (zero-setup demo), why the Vibration API is only a bonus. Short, specific, first person ("I").
5. "From web to hardware": the firmware export and where it fits (XIAO nRF52840 plus DRV2605L), with a placeholder for a photo or video of the board.
6. "How it's built": architecture diagram (simple text or Mermaid), the pure `core` separation, tests, performance numbers actually measured.
7. "Known limitations": Vibration API support, patterns are design heuristics and not validated beyond informal testing with about 10 users, firmware export needs review before flashing.
8. Run, test, build commands. License.

Do not invent statistics, user quotes or study results. Only use the facts in this brief.

---

## 16. How to work

- Follow section 13 strictly. One phase at a time.
- Make reasonable decisions on small details without asking. If something is truly blocking, ask one concise question. Otherwise record your assumption in `NOTES.md` and continue.
- If a requirement here appears wrong or unsafe, say so briefly before proceeding rather than silently deviating.
- Keep dependencies minimal. Justify any new dependency in one line in `NOTES.md`.
- Prefer small, readable modules over cleverness. Comments explain *why*, not *what*.
- Be honest in all copy. This is a concept demo, not a product.

---

## 17. Definition of done

- [ ] Page loads into a self-explanatory moving demo with zero clicks
- [ ] Every cue is shown, captioned, and can be heard
- [ ] Users can swap patterns, switch presets, edit patterns, and share a link
- [ ] Ambiguity warnings work
- [ ] Silent vibration bonus works on Android Chrome and shows nothing elsewhere
- [ ] Firmware export produces plausible, clearly caveated Arduino code
- [ ] Budgets and quality bars in section 12 are met and measured
- [ ] CI green, tests green, deployed, social preview works
- [ ] README complete with placeholders for GIF and hardware photo

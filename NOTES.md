# NOTES

Assumptions, decisions, and suggestions not built. See `docs/brief.md`.

## Assumptions

- Channels: two insole units (left, right) plus one armband (brief 4.1). Confirm with Kevin. Only `src/core/channels.ts` and the body diagram change if the hardware differs.
- Repo root is this folder. The brief's `wayfinder-haptic-playground/` is the package name.
- `brief.md` moved to `docs/brief.md` per brief section 11.
- Overlapping events on the same channel are errors. A negative gap is below the 60 ms minimum.
- `validateVocabulary` reports pattern issues only for assigned patterns. Unassigned library patterns are checked by the editor in phase 5.
- Built-in patterns and presets are deep-frozen so they stay read-only at runtime.

## Open for phase 2

- Brief 5.3 presets contain duplicate assignments (Armband only: `start`/`slight-left` both `soft-double-arm`, `continue`/`slight-right` both `tick-soft`; Insoles only: `continue`/`slight-left` both `tick-L`). Once `similarity` exists, these will warn. Per brief: adjust the presets, not the heuristic, so every preset is warning-free.

## Dependencies (one line each)

- react, react-dom: UI (brief 11).
- zustand: state store (brief 8).
- vite, @vitejs/plugin-react: build and dev server.
- tailwindcss, @tailwindcss/vite: styling (brief 11).
- typescript, @types/*: strict typing.
- vitest: unit tests.
- eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, eslint-config-prettier: linting, plus the `core` import restriction.
- prettier: formatting.

## Known issues

- `npm audit`: 12 high, all dev tooling (vite, vitest, typescript-eslint, plugin-react via picomatch/fdir/tinyglobby). Runtime deps: 0 (`npm audit --omit=dev`). Only fix is `npm audit fix --force` (breaking). Revisit when upstream ships patched releases.

## Suggestions (not built)

- None yet.

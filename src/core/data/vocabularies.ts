import type { CueId, Vocabulary } from '../types';
import { PATTERNS } from './patterns';

// Brief 5.2 and 5.3. Presets may be adjusted in phase 2 if the similarity
// heuristic flags them; the heuristic stays as specified.

const preset = (id: string, name: string, assignments: Record<CueId, string>): Vocabulary =>
  Object.freeze({
    version: 1,
    id,
    name,
    patterns: PATTERNS,
    assignments: Object.freeze(assignments),
  });

const DEFAULT_ASSIGNMENTS: Record<CueId, string> = {
  start: 'soft-double-arm',
  continue: 'tick-soft',
  'slight-left': 'tick-L',
  'slight-right': 'tick-R',
  'turn-left': 'double-L',
  'turn-right': 'double-R',
  'u-turn': 'alternate-feet',
  'off-route': 'alarm-all',
  arrive: 'rising-three',
};

export const PRESETS: readonly Vocabulary[] = Object.freeze([
  preset('wayfinder-default', 'Wayfinder Default', DEFAULT_ASSIGNMENTS),
  preset('armband-only', 'Armband only (quiet)', {
    start: 'soft-double-arm',
    continue: 'tick-soft',
    'slight-left': 'soft-double-arm',
    'slight-right': 'tick-soft',
    'turn-left': 'short-long-arm',
    'turn-right': 'long-short-arm',
    'u-turn': 'rising-three',
    'off-route': 'alarm-all',
    arrive: 'swell-arm',
  }),
  preset('insoles-only', 'Insoles only (function first)', {
    start: 'long-R',
    continue: 'tick-L',
    'slight-left': 'tick-L',
    'slight-right': 'tick-R',
    'turn-left': 'double-L',
    'turn-right': 'double-R',
    'u-turn': 'alternate-feet',
    'off-route': 'alarm-all',
    arrive: 'long-L',
  }),
  preset('echo', 'Echo (comfort layered on function)', {
    ...DEFAULT_ASSIGNMENTS,
    'turn-left': 'echo-L',
    'turn-right': 'echo-R',
  }),
]);

// PRESETS is a non-empty literal above.
export const DEFAULT_VOCABULARY: Vocabulary = PRESETS[0] as Vocabulary;

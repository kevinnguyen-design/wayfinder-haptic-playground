import { describe, expect, it } from 'vitest';
import { DEFAULT_VOCABULARY, PRESETS } from './vocabularies';
import { PATTERN_LIBRARY } from './patterns';
import { validateVocabulary } from '../validate';
import type { CueId } from '../types';

describe('preset vocabularies', () => {
  it('ships the four presets from the brief, in order', () => {
    expect(PRESETS.map((v) => v.name)).toEqual([
      'Wayfinder Default',
      'Armband only (quiet)',
      'Insoles only (function first)',
      'Echo (comfort layered on function)',
    ]);
  });

  it('has unique ids', () => {
    expect(new Set(PRESETS.map((v) => v.id)).size).toBe(PRESETS.length);
  });

  it('uses Wayfinder Default as the default', () => {
    expect(DEFAULT_VOCABULARY).toBe(PRESETS[0]);
  });

  it('maps the default cues exactly as brief 5.2', () => {
    expect(DEFAULT_VOCABULARY.assignments).toEqual({
      start: 'soft-double-arm',
      continue: 'tick-soft',
      'slight-left': 'tick-L',
      'slight-right': 'tick-R',
      'turn-left': 'double-L',
      'turn-right': 'double-R',
      'u-turn': 'alternate-feet',
      'off-route': 'alarm-all',
      arrive: 'rising-three',
    } satisfies Record<CueId, string>);
  });

  it('Echo swaps only the turns', () => {
    const echo = PRESETS[3];
    expect(echo?.assignments).toEqual({
      ...DEFAULT_VOCABULARY.assignments,
      'turn-left': 'echo-L',
      'turn-right': 'echo-R',
    });
  });

  it('Armband only uses no insole channel', () => {
    const v = PRESETS[1];
    if (!v) throw new Error('missing preset');
    for (const id of Object.values(v.assignments)) {
      const channels = v.patterns[id]?.events.map((e) => e.channel) ?? [];
      // off-route keeps the all-device alarm per brief 5.3.
      if (id === 'alarm-all') continue;
      expect(channels.every((c) => c === 'armband')).toBe(true);
    }
  });

  it('Insoles only puts turns on the matching foot', () => {
    const v = PRESETS[2];
    expect(v?.assignments['turn-left']).toBe('double-L');
    expect(v?.assignments['turn-right']).toBe('double-R');
  });

  it('includes the full pattern library in every preset', () => {
    for (const v of PRESETS) {
      expect(Object.keys(v.patterns)).toEqual(PATTERN_LIBRARY.map((p) => p.id));
    }
  });

  it.each(PRESETS.map((v) => [v.name, v] as const))('%s validates with no issues', (_n, v) => {
    expect(validateVocabulary(v)).toEqual([]);
  });
});

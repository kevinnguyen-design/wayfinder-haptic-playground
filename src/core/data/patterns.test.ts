import { describe, expect, it } from 'vitest';
import { PATTERNS, PATTERN_LIBRARY } from './patterns';
import { validatePattern } from '../validate';

// Brief 5.1 table, notation `channel@start+duration Iintensity [shape]`.
const TABLE: Record<string, string[]> = {
  'tick-soft': ['armband@0+40 I0.3'],
  'tick-L': ['insole-l@0+60 I0.5'],
  'tick-R': ['insole-r@0+60 I0.5'],
  'double-L': ['insole-l@0+90 I0.9', 'insole-l@180+90 I0.9'],
  'double-R': ['insole-r@0+90 I0.9', 'insole-r@180+90 I0.9'],
  'long-L': ['insole-l@0+350 I0.8'],
  'long-R': ['insole-r@0+350 I0.8'],
  'alternate-feet': [
    'insole-l@0+200 I0.8',
    'insole-r@260+200 I0.8',
    'insole-l@520+200 I0.8',
    'insole-r@780+200 I0.8',
  ],
  'rising-three': ['armband@0+110 I0.4', 'armband@200+110 I0.6', 'armband@400+240 I0.9'],
  'soft-double-arm': ['armband@0+70 I0.35', 'armband@160+70 I0.35'],
  'alarm-all': ['insole-l@0+500 I0.9', 'insole-r@0+500 I0.9', 'armband@0+500 I0.9'],
  'swell-arm': ['armband@0+450 I0.7 rampUp'],
  'short-long-arm': ['armband@0+60 I0.5', 'armband@160+300 I0.5'],
  'long-short-arm': ['armband@0+300 I0.5', 'armband@400+60 I0.5'],
  'echo-L': ['insole-l@0+90 I0.9', 'armband@200+70 I0.35'],
  'echo-R': ['insole-r@0+90 I0.9', 'armband@200+70 I0.35'],
};

const notate = (e: (typeof PATTERN_LIBRARY)[number]['events'][number]) =>
  `${e.channel}@${e.startMs}+${e.durationMs} I${e.intensity}` +
  (e.shape && e.shape !== 'flat' ? ` ${e.shape}` : '');

describe('pattern library', () => {
  it('contains exactly the 16 patterns from the brief, in order', () => {
    expect(PATTERN_LIBRARY.map((p) => p.id)).toEqual(Object.keys(TABLE));
  });

  it.each(Object.entries(TABLE))('%s matches the brief events', (id, events) => {
    expect(PATTERNS[id]?.events.map(notate)).toEqual(events);
  });

  it('marks every pattern built-in with a name and description', () => {
    for (const p of PATTERN_LIBRARY) {
      expect(p.builtin).toBe(true);
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
    }
  });

  it('uses the brief caption wording', () => {
    expect(PATTERNS['double-L']?.description).toBe('two firm pulses on the left foot');
    expect(PATTERNS['echo-R']?.name).toBe('Right foot with armband echo');
  });

  it.each(PATTERN_LIBRARY.map((p) => [p.id, p] as const))('%s passes validation', (_id, p) => {
    expect(validatePattern(p)).toEqual([]);
  });

  it('is frozen so built-ins stay read-only', () => {
    expect(Object.isFrozen(PATTERNS['tick-soft'])).toBe(true);
    expect(Object.isFrozen(PATTERNS['tick-soft']?.events)).toBe(true);
  });
});

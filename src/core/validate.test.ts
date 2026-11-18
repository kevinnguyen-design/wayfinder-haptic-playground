import { describe, expect, it } from 'vitest';
import type { HapticEvent, Pattern, Vocabulary } from './types';
import { validatePattern, validateVocabulary } from './validate';

const ev = (overrides: Partial<HapticEvent> = {}): HapticEvent => ({
  channel: 'armband',
  startMs: 0,
  durationMs: 80,
  intensity: 0.5,
  ...overrides,
});

const pat = (events: HapticEvent[]): Pattern => ({
  id: 'p',
  name: 'P',
  description: 'test',
  events,
  builtin: false,
});

const errors = (p: Pattern) => validatePattern(p).filter((i) => i.severity === 'error');

describe('validatePattern', () => {
  it('accepts a simple valid pattern', () => {
    expect(validatePattern(pat([ev()]))).toEqual([]);
  });

  it('rejects a pattern with no events', () => {
    expect(errors(pat([]))).toHaveLength(1);
  });

  it('rejects total length over 1500 ms', () => {
    expect(errors(pat([ev({ startMs: 1450, durationMs: 60 })]))).toHaveLength(1);
  });

  it('accepts total length of exactly 1500 ms', () => {
    expect(errors(pat([ev({ startMs: 1400, durationMs: 100 })]))).toEqual([]);
  });

  it('rejects more than 8 events', () => {
    const events = Array.from({ length: 9 }, (_, i) => ev({ startMs: i * 150 }));
    expect(errors(pat(events)).some((i) => /8 events/.test(i.message))).toBe(true);
  });

  it('accepts exactly 8 events', () => {
    const events = Array.from({ length: 8 }, (_, i) => ev({ startMs: i * 150 }));
    expect(errors(pat(events))).toEqual([]);
  });

  it.each([19, 601])('rejects duration %i ms', (durationMs) => {
    expect(errors(pat([ev({ durationMs })]))).toHaveLength(1);
  });

  it.each([20, 600])('accepts duration %i ms', (durationMs) => {
    expect(errors(pat([ev({ durationMs })]))).toEqual([]);
  });

  it.each([0.09, 1.01])('rejects intensity %f', (intensity) => {
    expect(errors(pat([ev({ intensity })]))).toHaveLength(1);
  });

  it.each([0.1, 1])('accepts intensity %f', (intensity) => {
    expect(errors(pat([ev({ intensity })]))).toEqual([]);
  });

  it('rejects negative start', () => {
    expect(errors(pat([ev({ startMs: -10 })]))).toHaveLength(1);
  });

  it('rejects an unknown channel', () => {
    const bad = ev({ channel: 'nose' as HapticEvent['channel'] });
    expect(errors(pat([bad]))).toHaveLength(1);
  });

  it('rejects non-finite numbers', () => {
    expect(errors(pat([ev({ durationMs: Number.NaN })])).length).toBeGreaterThan(0);
  });

  it('rejects a gap under 60 ms on the same channel', () => {
    const p = pat([ev({ startMs: 0, durationMs: 80 }), ev({ startMs: 130, durationMs: 80 })]);
    expect(errors(p).some((i) => /60 ms/.test(i.message))).toBe(true);
  });

  it('rejects overlapping events on the same channel', () => {
    const p = pat([ev({ startMs: 0, durationMs: 80 }), ev({ startMs: 40, durationMs: 80 })]);
    expect(errors(p).length).toBeGreaterThan(0);
  });

  it('accepts a gap of exactly 60 ms on the same channel', () => {
    const p = pat([ev({ startMs: 0, durationMs: 80 }), ev({ startMs: 140, durationMs: 80 })]);
    expect(errors(p)).toEqual([]);
  });

  it('checks gaps regardless of event order in the array', () => {
    const p = pat([ev({ startMs: 130, durationMs: 80 }), ev({ startMs: 0, durationMs: 80 })]);
    expect(errors(p).length).toBeGreaterThan(0);
  });

  it('allows simultaneous events on different channels', () => {
    const p = pat([ev({ channel: 'insole-l' }), ev({ channel: 'insole-r' })]);
    expect(errors(p)).toEqual([]);
  });

  it('returns plain-language messages', () => {
    const [issue] = validatePattern(pat([]));
    expect(issue?.message).toMatch(/at least one/i);
  });
});

describe('validateVocabulary', () => {
  const p = pat([ev()]);
  const vocab = (assign: Partial<Vocabulary['assignments']> = {}): Vocabulary => ({
    version: 1,
    id: 'v',
    name: 'V',
    patterns: { p },
    assignments: {
      start: 'p',
      continue: 'p',
      'slight-left': 'p',
      'slight-right': 'p',
      'turn-left': 'p',
      'turn-right': 'p',
      'u-turn': 'p',
      'off-route': 'p',
      arrive: 'p',
      ...assign,
    },
  });

  it('accepts a vocabulary whose cues all reference existing patterns', () => {
    expect(validateVocabulary(vocab()).filter((i) => i.severity === 'error')).toEqual([]);
  });

  it('rejects a cue pointing at a missing pattern', () => {
    const issues = validateVocabulary(vocab({ arrive: 'ghost' }));
    expect(issues.some((i) => i.severity === 'error' && /arrive/.test(i.message))).toBe(true);
  });

  it('rejects a missing cue assignment', () => {
    const v = vocab();
    delete (v.assignments as Partial<Vocabulary['assignments']>).arrive;
    expect(validateVocabulary(v).some((i) => i.severity === 'error')).toBe(true);
  });

  it('surfaces pattern errors for assigned patterns', () => {
    const v = vocab();
    v.patterns.p = pat([]);
    expect(validateVocabulary(v).some((i) => i.severity === 'error')).toBe(true);
  });
});

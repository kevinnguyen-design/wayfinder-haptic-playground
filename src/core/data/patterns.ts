import type { ChannelId, HapticEvent, Pattern, Shape } from '../types';

// Brief 5.1. Punctuation, not prose: short, distinct, learnable marks.
// Insoles carry direction and urgency; the armband carries state and reassurance.

const e = (
  channel: ChannelId,
  startMs: number,
  durationMs: number,
  intensity: number,
  shape?: Shape,
): HapticEvent =>
  shape
    ? { channel, startMs, durationMs, intensity, shape }
    : { channel, startMs, durationMs, intensity };

const def = (id: string, name: string, description: string, events: HapticEvent[]): Pattern =>
  Object.freeze({
    id,
    name,
    description,
    events: Object.freeze(events.map((ev) => Object.freeze(ev))) as HapticEvent[],
    builtin: true,
  });

export const PATTERN_LIBRARY: readonly Pattern[] = Object.freeze([
  def('tick-soft', 'Soft tick', 'one soft tap', [e('armband', 0, 40, 0.3)]),
  def('tick-L', 'Light tap, left foot', 'a light tap on the left foot', [
    e('insole-l', 0, 60, 0.5),
  ]),
  def('tick-R', 'Light tap, right foot', 'a light tap on the right foot', [
    e('insole-r', 0, 60, 0.5),
  ]),
  def('double-L', 'Firm double, left foot', 'two firm pulses on the left foot', [
    e('insole-l', 0, 90, 0.9),
    e('insole-l', 180, 90, 0.9),
  ]),
  def('double-R', 'Firm double, right foot', 'two firm pulses on the right foot', [
    e('insole-r', 0, 90, 0.9),
    e('insole-r', 180, 90, 0.9),
  ]),
  def('long-L', 'Long press, left foot', 'one long pulse on the left foot', [
    e('insole-l', 0, 350, 0.8),
  ]),
  def('long-R', 'Long press, right foot', 'one long pulse on the right foot', [
    e('insole-r', 0, 350, 0.8),
  ]),
  def('alternate-feet', 'Alternate feet', 'left then right foot, twice', [
    e('insole-l', 0, 200, 0.8),
    e('insole-r', 260, 200, 0.8),
    e('insole-l', 520, 200, 0.8),
    e('insole-r', 780, 200, 0.8),
  ]),
  def('rising-three', 'Rising three', 'three armband pulses that grow stronger', [
    e('armband', 0, 110, 0.4),
    e('armband', 200, 110, 0.6),
    e('armband', 400, 240, 0.9),
  ]),
  def('soft-double-arm', 'Soft double, armband', 'two gentle armband pulses', [
    e('armband', 0, 70, 0.35),
    e('armband', 160, 70, 0.35),
  ]),
  def('alarm-all', 'All-device buzz', 'every device buzzes together', [
    e('insole-l', 0, 500, 0.9),
    e('insole-r', 0, 500, 0.9),
    e('armband', 0, 500, 0.9),
  ]),
  def('swell-arm', 'Armband swell', 'one armband pulse that fades in', [
    e('armband', 0, 450, 0.7, 'rampUp'),
  ]),
  def('short-long-arm', 'Short then long, armband', 'a short pulse then a long one', [
    e('armband', 0, 60, 0.5),
    e('armband', 160, 300, 0.5),
  ]),
  def('long-short-arm', 'Long then short, armband', 'a long pulse then a short one', [
    e('armband', 0, 300, 0.5),
    e('armband', 400, 60, 0.5),
  ]),
  def('echo-L', 'Left foot with armband echo', 'a firm left pulse, then a soft armband echo', [
    e('insole-l', 0, 90, 0.9),
    e('armband', 200, 70, 0.35),
  ]),
  def('echo-R', 'Right foot with armband echo', 'a firm right pulse, then a soft armband echo', [
    e('insole-r', 0, 90, 0.9),
    e('armband', 200, 70, 0.35),
  ]),
]);

export const PATTERNS: Readonly<Record<string, Pattern>> = Object.freeze(
  Object.fromEntries(PATTERN_LIBRARY.map((p) => [p.id, p])),
);

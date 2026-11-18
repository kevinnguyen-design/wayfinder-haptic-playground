export type ChannelId = 'insole-l' | 'insole-r' | 'armband';

export interface Channel {
  id: ChannelId;
  label: string;
  device: 'insole' | 'armband';
  side: 'left' | 'right' | 'none';
}

export type CueId =
  | 'start'
  | 'continue'
  | 'slight-left'
  | 'slight-right'
  | 'turn-left'
  | 'turn-right'
  | 'u-turn'
  | 'off-route'
  | 'arrive';

export const CUE_IDS: readonly CueId[] = [
  'start',
  'continue',
  'slight-left',
  'slight-right',
  'turn-left',
  'turn-right',
  'u-turn',
  'off-route',
  'arrive',
];

export type Shape = 'flat' | 'rampUp' | 'rampDown';

export interface HapticEvent {
  channel: ChannelId;
  startMs: number;
  durationMs: number;
  intensity: number;
  shape?: Shape;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  events: HapticEvent[];
  builtin: boolean;
}

export interface Vocabulary {
  version: 1;
  id: string;
  name: string;
  patterns: Record<string, Pattern>;
  assignments: Record<CueId, string>;
}

export interface Issue {
  severity: 'error' | 'warning';
  message: string;
}

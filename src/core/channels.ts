import type { Channel, ChannelId } from './types';

// Assumption (brief 4.1): two insole units plus one armband. If the real hardware
// differs, change this list and the body diagram only.
export const CHANNELS: readonly Channel[] = [
  { id: 'insole-l', label: 'Left insole', device: 'insole', side: 'left' },
  { id: 'insole-r', label: 'Right insole', device: 'insole', side: 'right' },
  { id: 'armband', label: 'Armband', device: 'armband', side: 'none' },
];

export function isChannelId(value: unknown): value is ChannelId {
  return CHANNELS.some((c) => c.id === value);
}

export function getChannel(id: ChannelId): Channel {
  const channel = CHANNELS.find((c) => c.id === id);
  if (!channel) throw new Error(`Unknown channel: ${id}`);
  return channel;
}

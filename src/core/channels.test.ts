import { describe, expect, it } from 'vitest';
import { CHANNELS, getChannel, isChannelId } from './channels';

describe('channels', () => {
  it('defines left insole, right insole and armband in that order', () => {
    expect(CHANNELS.map((c) => c.id)).toEqual(['insole-l', 'insole-r', 'armband']);
  });

  it('marks devices and sides', () => {
    expect(getChannel('insole-l')).toMatchObject({ device: 'insole', side: 'left' });
    expect(getChannel('insole-r')).toMatchObject({ device: 'insole', side: 'right' });
    expect(getChannel('armband')).toMatchObject({ device: 'armband', side: 'none' });
  });

  it('gives each channel a human label', () => {
    expect(getChannel('insole-l').label).toBe('Left insole');
  });

  it('recognises valid channel ids only', () => {
    expect(isChannelId('armband')).toBe(true);
    expect(isChannelId('insole-x')).toBe(false);
    expect(isChannelId(42)).toBe(false);
  });
});

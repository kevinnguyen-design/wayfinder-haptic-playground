import { isChannelId } from './channels';
import { CUE_IDS, type Issue, type Pattern, type Vocabulary } from './types';

// Design heuristics from brief 4.3, not research findings.
// Short cues stay glanceable; same-channel gaps under 60 ms blur into one pulse.
export const LIMITS = {
  maxTotalMs: 1500,
  maxEvents: 8,
  minDurationMs: 20,
  maxDurationMs: 600,
  minIntensity: 0.1,
  maxIntensity: 1,
  minGapMs: 60,
} as const;

const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

export function validatePattern(p: Pattern): Issue[] {
  const issues: Issue[] = [];
  const error = (message: string) => issues.push({ severity: 'error', message });

  if (p.events.length === 0) {
    error('Add at least one event.');
    return issues;
  }
  if (p.events.length > LIMITS.maxEvents) {
    error(`Use at most ${LIMITS.maxEvents} events. This has ${p.events.length}.`);
  }

  p.events.forEach((e, idx) => {
    const n = idx + 1;
    if (!isChannelId(e.channel)) error(`Event ${n} uses an unknown channel.`);
    if (!isNum(e.startMs) || e.startMs < 0) error(`Event ${n} must start at 0 ms or later.`);
    if (
      !isNum(e.durationMs) ||
      e.durationMs < LIMITS.minDurationMs ||
      e.durationMs > LIMITS.maxDurationMs
    ) {
      error(`Event ${n} must last ${LIMITS.minDurationMs} to ${LIMITS.maxDurationMs} ms.`);
    }
    if (
      !isNum(e.intensity) ||
      e.intensity < LIMITS.minIntensity ||
      e.intensity > LIMITS.maxIntensity
    ) {
      error(`Event ${n} intensity must be ${LIMITS.minIntensity} to ${LIMITS.maxIntensity}.`);
    }
  });

  const end = Math.max(...p.events.map((e) => e.startMs + e.durationMs));
  if (isNum(end) && end > LIMITS.maxTotalMs) {
    error(`Keep the whole pattern under ${LIMITS.maxTotalMs} ms. This runs ${end} ms.`);
  }

  const byChannel = new Map<string, Pattern['events']>();
  for (const e of p.events) {
    const list = byChannel.get(e.channel) ?? [];
    list.push(e);
    byChannel.set(e.channel, list);
  }
  for (const list of byChannel.values()) {
    const sorted = [...list].sort((a, b) => a.startMs - b.startMs);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (!prev || !cur) continue;
      const gap = cur.startMs - (prev.startMs + prev.durationMs);
      if (gap < LIMITS.minGapMs) {
        error(
          `Leave at least ${LIMITS.minGapMs} ms between events on the same device, or they blur into one.`,
        );
      }
    }
  }

  return issues;
}

export function validateVocabulary(v: Vocabulary): Issue[] {
  const issues: Issue[] = [];
  const checked = new Set<string>();

  for (const cue of CUE_IDS) {
    const id = v.assignments[cue];
    if (typeof id !== 'string') {
      issues.push({ severity: 'error', message: `Cue "${cue}" has no pattern assigned.` });
      continue;
    }
    const pattern = v.patterns[id];
    if (!pattern) {
      issues.push({
        severity: 'error',
        message: `Cue "${cue}" points to a pattern that does not exist ("${id}").`,
      });
      continue;
    }
    if (checked.has(id)) continue;
    checked.add(id);
    for (const issue of validatePattern(pattern)) {
      issues.push({ ...issue, message: `${pattern.name}: ${issue.message}` });
    }
  }

  return issues;
}

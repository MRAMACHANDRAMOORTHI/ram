import type { CSSProperties } from 'react';
import type { Tone } from '../content/types';

/** CSS reference for a domain tone token. */
export const toneVar = (tone: Tone) => `var(--${tone})`;

/** Sets the contextual `--tone` that `text-tone`, `bg-tone/…`, spotlights and ambience inherit. */
export const toneStyle = (tone: Tone): CSSProperties => ({ ['--tone' as string]: toneVar(tone) });

export const toneLabel: Record<Tone, string> = {
  systems: 'Backend & systems',
  interface: 'Frontend & interface',
  data: 'Data',
  automation: 'Automation & workflows',
  signal: 'Responses & health',
  human: 'People',
};

/* Static class maps — Tailwind only generates classes it can see written out in full. */
export const toneText: Record<Tone, string> = {
  systems: 'text-systems',
  interface: 'text-interface',
  data: 'text-data',
  automation: 'text-automation',
  signal: 'text-signal',
  human: 'text-human',
};

export const toneBg: Record<Tone, string> = {
  systems: 'bg-systems',
  interface: 'bg-interface',
  data: 'bg-data',
  automation: 'bg-automation',
  signal: 'bg-signal',
  human: 'bg-human',
};

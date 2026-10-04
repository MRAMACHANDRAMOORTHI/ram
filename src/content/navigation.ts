import type { Tone } from './types';

export interface NavSection {
  id: string;
  label: string;
  index: string;
  tone: Tone;
}

/** Each section carries a tone: profile & career are about people, work is systems, and so on. */
export const sections: NavSection[] = [
  { id: 'profile', label: 'Profile', index: '01', tone: 'human' },
  { id: 'work', label: 'Work', index: '02', tone: 'systems' },
  { id: 'career', label: 'Career', index: '03', tone: 'human' },
  { id: 'approach', label: 'Approach', index: '04', tone: 'automation' },
  { id: 'stack', label: 'Stack', index: '05', tone: 'interface' },
  { id: 'contact', label: 'Contact', index: '06', tone: 'systems' },
];

export const sectionTone = (id: string): Tone => sections.find((s) => s.id === id)?.tone ?? 'systems';

export const sectionIds = sections.map((s) => s.id);

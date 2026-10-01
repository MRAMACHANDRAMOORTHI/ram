export interface NavSection {
  id: string;
  label: string;
  index: string;
}

export const sections: NavSection[] = [
  { id: 'profile', label: 'Profile', index: '01' },
  { id: 'work', label: 'Work', index: '02' },
  { id: 'career', label: 'Career', index: '03' },
  { id: 'approach', label: 'Approach', index: '04' },
  { id: 'stack', label: 'Stack', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
];

export const sectionIds = sections.map((s) => s.id);

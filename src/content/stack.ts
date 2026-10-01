import type { ContextId, StackGroup, Tech } from './types';

export const stackGroups: StackGroup[] = ['Languages', 'Backend', 'Frontend', 'Data', 'Practice'];

export const contextLabels: Record<ContextId, { label: string; kind: 'role' | 'project' }> = {
  helpdesk: { label: 'Helpdesk · Ardhika', kind: 'project' },
  cict: { label: 'E-Learning · CICT', kind: 'project' },
  retech: { label: 'APIs · RETECH', kind: 'role' },
  healthchain: { label: 'HealthChain', kind: 'project' },
  scholorsphere: { label: 'Scholorsphere', kind: 'project' },
};

export const stack: Tech[] = [
  // Languages
  { id: 'elixir', name: 'Elixir', group: 'Languages', core: true, usedIn: ['helpdesk'], note: 'My core backend language. Functional programming on the BEAM, with OTP for fault-tolerant workflow engines.' },
  { id: 'typescript', name: 'TypeScript', group: 'Languages', usedIn: ['cict'], note: 'Type safety across React clients and Node.js services — used throughout the CICT platform.' },
  { id: 'javascript', name: 'JavaScript', group: 'Languages', usedIn: ['helpdesk', 'cict', 'scholorsphere', 'healthchain'], note: 'Modern ES across Vue, React and framework-free front ends.' },
  { id: 'java', name: 'Java', group: 'Languages', usedIn: ['retech', 'healthchain'], note: 'Enterprise backend logic and REST APIs; Java 17 for HealthChain.' },
  { id: 'solidity', name: 'Solidity', group: 'Languages', usedIn: ['healthchain'], note: 'Wrote the MedicalRecord smart contract for HealthChain.' },

  // Backend
  { id: 'phoenix', name: 'Phoenix', group: 'Backend', core: true, usedIn: ['helpdesk'], note: 'High-performance web layer for the Helpdesk — ticket lifecycles, SLA timers and background jobs.' },
  { id: 'spring', name: 'Spring Boot', group: 'Backend', usedIn: ['retech', 'healthchain'], note: 'RESTful APIs and performance work at RETECH; Security, JPA and Mail in HealthChain.' },
  { id: 'node', name: 'Node.js', group: 'Backend', usedIn: ['cict'], note: 'TypeScript services behind the CICT learning platform.' },
  { id: 'rest', name: 'REST APIs', group: 'Backend', usedIn: ['retech', 'helpdesk'], note: 'Designing and consuming APIs for clean client–server contracts in both Elixir and Java.' },
  { id: 'web3j', name: 'Web3j', group: 'Backend', usedIn: ['healthchain'], note: 'Generated Java bindings for HealthChain’s Solidity contract.' },

  // Frontend
  { id: 'vue', name: 'Vue 3', group: 'Frontend', core: true, usedIn: ['helpdesk'], note: 'Composition API dashboards and interactive ticket views for the Helpdesk.' },
  { id: 'react', name: 'React', group: 'Frontend', usedIn: ['cict'], note: 'Hooks and Context API on the CICT portal, wired to Firebase for real-time data.' },
  { id: 'tailwind', name: 'Tailwind CSS', group: 'Frontend', usedIn: ['cict'], note: 'Responsive, consistent UI built from utilities.' },
  { id: 'thymeleaf', name: 'Thymeleaf', group: 'Frontend', usedIn: ['healthchain'], note: 'Server-rendered, role-based dashboards behind Spring Security.' },
  { id: 'html-css', name: 'HTML & CSS', group: 'Frontend', usedIn: ['scholorsphere', 'healthchain'], note: 'Semantic, hand-written markup and styles — no framework required.' },

  // Data
  { id: 'postgres', name: 'PostgreSQL', group: 'Data', core: true, usedIn: ['helpdesk'], note: 'Schema design and aggregation queries that power real-time analytics and reporting.' },
  { id: 'ecto', name: 'Ecto', group: 'Data', usedIn: ['helpdesk'], note: 'Elixir’s data layer — composable queries and in-database aggregations.' },
  { id: 'mysql', name: 'MySQL', group: 'Data', usedIn: ['retech', 'healthchain'], note: 'Query tuning and indexing strategies — 25% faster data retrieval at RETECH.' },
  { id: 'firebase', name: 'Firebase', group: 'Data', usedIn: ['cict'], note: 'Authentication and the Realtime Database for live course and learner data.' },

  // Practice
  { id: 'system-design', name: 'System design', group: 'Practice', usedIn: ['helpdesk'], note: 'Round-robin assignment, SLA escalation and scalable data structures for the Helpdesk.' },
  { id: 'agile', name: 'Agile delivery', group: 'Practice', usedIn: ['retech', 'helpdesk'], note: 'Sprint planning and delivery with cross-functional, distributed teams.' },
  { id: 'ux', name: 'UI/UX collaboration', group: 'Practice', usedIn: ['cict'], note: 'Shaping user flows and readability alongside domain experts.' },
  { id: 'git', name: 'Git & GitHub', group: 'Practice', usedIn: [], note: 'Daily version control, branching and collaboration across every project.' },
];

/** Also in the toolkit, without a featured project to point to. */
export const toolkit = ['Python', 'AWS', 'Bootstrap', 'Data structures', 'Security best practices'];

export const techById = (id: string) => stack.find((t) => t.id === id);

/** Technologies that share at least one context with `id`. */
export function connectedTech(id: string): Set<string> {
  const source = techById(id);
  const out = new Set<string>();
  if (!source) return out;
  for (const t of stack) {
    if (t.id === id) continue;
    if (t.usedIn.some((c) => source.usedIn.includes(c))) out.add(t.id);
  }
  return out;
}

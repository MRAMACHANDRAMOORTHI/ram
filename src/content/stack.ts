import type { ContextId, StackGroup, Tech, Tone } from './types';

export const stackGroups: StackGroup[] = ['Languages', 'Backend', 'Frontend', 'Data', 'Practice'];

export const groupTone: Record<StackGroup, Tone> = {
  Languages: 'human',
  Backend: 'systems',
  Frontend: 'interface',
  Data: 'data',
  Practice: 'automation',
};

export const contextLabels: Record<ContextId, { label: string; kind: 'role' | 'project'; tone: Tone }> = {
  helpdesk: { label: 'Helpdesk · Ardhika', kind: 'project', tone: 'systems' },
  lms: { label: 'ekVana LMS · Ardhika', kind: 'project', tone: 'human' },
  aims: { label: 'AIMS · Ardhika', kind: 'project', tone: 'data' },
  cict: { label: 'E-Learning · CICT', kind: 'project', tone: 'automation' },
  retech: { label: 'APIs · RETECH', kind: 'role', tone: 'data' },
  healthchain: { label: 'HealthChain', kind: 'project', tone: 'signal' },
  scholorsphere: { label: 'Scholorsphere', kind: 'project', tone: 'interface' },
};

export const stack: Tech[] = [
  // Languages
  { id: 'elixir', name: 'Elixir', group: 'Languages', core: true, usedIn: ['helpdesk', 'lms', 'aims'], note: 'My core backend language. Functional programming on the BEAM behind every platform I build at Ardhika.' },
  { id: 'typescript', name: 'TypeScript', group: 'Languages', usedIn: ['cict', 'aims'], note: 'Type safety across React clients and Node.js services — the CICT platform and the AIMS console.' },
  { id: 'javascript', name: 'JavaScript', group: 'Languages', usedIn: ['helpdesk', 'lms', 'cict', 'scholorsphere', 'healthchain'], note: 'Modern ES across Vue, React and framework-free front ends.' },
  { id: 'java', name: 'Java', group: 'Languages', usedIn: ['retech', 'healthchain'], note: 'Enterprise backend logic and REST APIs; Java 17 for HealthChain.' },
  { id: 'solidity', name: 'Solidity', group: 'Languages', usedIn: ['healthchain'], note: 'Wrote the MedicalRecord smart contract for HealthChain.' },

  // Backend
  { id: 'phoenix', name: 'Phoenix', group: 'Backend', core: true, usedIn: ['helpdesk', 'lms', 'aims'], note: 'JSON APIs for the Helpdesk, ekVana LMS and AIMS — plugs for tenancy, auth and permissions.' },
  { id: 'oban', name: 'Oban', group: 'Backend', usedIn: ['lms'], note: 'PostgreSQL-backed jobs for Google Drive imports, video processing and AI pipelines — tenant-aware and resumable.' },
  { id: 'spring', name: 'Spring Boot', group: 'Backend', usedIn: ['retech', 'healthchain'], note: 'RESTful APIs and performance work at RETECH; Security, JPA and Mail in HealthChain.' },
  { id: 'node', name: 'Node.js', group: 'Backend', usedIn: ['cict'], note: 'TypeScript services behind the CICT learning platform.' },
  { id: 'rest', name: 'REST APIs', group: 'Backend', usedIn: ['helpdesk', 'lms', 'aims', 'retech'], note: 'Versioned JSON APIs with deliberate, distinct error codes — in Elixir and Java.' },
  { id: 'web3j', name: 'Web3j', group: 'Backend', usedIn: ['healthchain'], note: 'Generated Java bindings for HealthChain’s Solidity contract.' },

  // Frontend
  { id: 'vue', name: 'Vue 3', group: 'Frontend', core: true, usedIn: ['helpdesk', 'lms'], note: 'Helpdesk dashboards and student portal; the LMS system console, admin and learner portals.' },
  { id: 'react', name: 'React', group: 'Frontend', usedIn: ['cict', 'aims'], note: 'The CICT learning portal and the AIMS tenant-management console (React 19).' },
  { id: 'tailwind', name: 'Tailwind CSS', group: 'Frontend', usedIn: ['cict', 'lms', 'aims'], note: 'Responsive, consistent UI built from utilities.' },
  { id: 'thymeleaf', name: 'Thymeleaf', group: 'Frontend', usedIn: ['healthchain'], note: 'Server-rendered, role-based dashboards behind Spring Security.' },
  { id: 'html-css', name: 'HTML & CSS', group: 'Frontend', usedIn: ['scholorsphere', 'healthchain'], note: 'Semantic, hand-written markup and styles — no framework required.' },

  // Data
  { id: 'postgres', name: 'PostgreSQL', group: 'Data', core: true, usedIn: ['helpdesk', 'lms', 'aims'], note: 'Schema-per-tenant isolation, and the aggregation queries behind real-time analytics.' },
  { id: 'triplex', name: 'Triplex', group: 'Data', usedIn: ['lms', 'aims'], note: 'Schema-per-tenant multi-tenancy on PostgreSQL — the isolation layer in ekVana LMS and AIMS.' },
  { id: 'ecto', name: 'Ecto', group: 'Data', usedIn: ['helpdesk', 'lms', 'aims'], note: 'Composable queries, prefix-scoped tenant access and in-database aggregations.' },
  { id: 'mysql', name: 'MySQL', group: 'Data', usedIn: ['retech', 'healthchain'], note: 'Query tuning and indexing strategies — 25% faster data retrieval at RETECH.' },
  { id: 'firebase', name: 'Firebase', group: 'Data', usedIn: ['cict'], note: 'Authentication and the Realtime Database for live course and learner data.' },
  { id: 's3', name: 'S3 / Spaces', group: 'Data', usedIn: ['lms'], note: 'Object storage with tenant-prefixed keys and short-lived signed URLs.' },

  // Practice
  { id: 'multitenancy', name: 'Multi-tenancy', group: 'Practice', usedIn: ['lms', 'aims'], note: 'Tenant resolution, tenant-bound tokens and per-tenant migrations — one deployment, many isolated institutions.' },
  { id: 'system-design', name: 'System design', group: 'Practice', usedIn: ['helpdesk', 'lms', 'aims'], note: 'Round-robin assignment, business-hours deadlines, provisioning sagas and data isolation.' },
  { id: 'testing', name: 'Testing (ExUnit)', group: 'Practice', usedIn: ['lms', 'aims'], note: 'Isolation, provisioning, migration and plug tests; most of the LMS backend suite.' },
  { id: 'llm', name: 'LLM integration', group: 'Practice', usedIn: ['lms'], note: 'Groq and Gemini behind one gateway for grounded question generation, with human review (feature branch).' },
  { id: 'agile', name: 'Agile delivery', group: 'Practice', usedIn: ['retech', 'helpdesk', 'lms'], note: 'Sprint planning and delivery with cross-functional, distributed teams.' },
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

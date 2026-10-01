import type { ContextId } from './types';

export interface Concern {
  id: string;
  label: string;
  title: string;
  body: string;
  where: ContextId;
  whereLabel: string;
}

/** Engineering concerns, each tied to the work where it was actually exercised. */
export const concerns: Concern[] = [
  {
    id: 'workflow',
    label: 'Workflow modelling',
    title: 'Lifecycles as explicit states',
    body: 'Tickets move through open, assigned, overdue, resolved, closed and reopened — defined transitions, not ad-hoc flags.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'jobs',
    label: 'Background jobs',
    title: 'SLAs that escalate themselves',
    body: 'Deadline tracking runs as background work, so breaches escalate on time without anyone watching.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'assignment',
    label: 'Algorithms',
    title: 'Round-robin assignment',
    body: 'Incoming tickets are spread evenly across executives — every ticket gets an owner the moment it arrives.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'analytics',
    label: 'Analytical SQL',
    title: 'Aggregate where the data lives',
    body: 'Status distribution, TAT tiers and median / mean / mode resolution times computed with Ecto aggregations in PostgreSQL.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'performance',
    label: 'Query performance',
    title: '25% faster data retrieval',
    body: 'Tuned MySQL queries and introduced indexing strategies under Spring Boot REST APIs.',
    where: 'retech',
    whereLabel: 'RETECH Solutions',
  },
  {
    id: 'api',
    label: 'API design',
    title: 'Clean client–server contracts',
    body: 'RESTful APIs designed and consumed across Java and Elixir — Spring Boot controllers and Phoenix endpoints.',
    where: 'retech',
    whereLabel: 'RETECH · Ardhika',
  },
  {
    id: 'realtime',
    label: 'Auth & real-time',
    title: 'Identity and live data, managed',
    body: 'Firebase Authentication and the Realtime Database behind a React + TypeScript learning platform.',
    where: 'cict',
    whereLabel: 'E-Learning · CICT',
  },
  {
    id: 'integrity',
    label: 'Security & integrity',
    title: 'Guarded routes, auditable writes',
    body: 'Spring Security on every route, plus a Solidity contract that emits an event for each record write.',
    where: 'healthchain',
    whereLabel: 'HealthChain',
  },
];

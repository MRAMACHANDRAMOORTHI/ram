import type { ContextId, Tone } from './types';

export interface Concern {
  id: string;
  label: string;
  title: string;
  body: string;
  where: ContextId;
  whereLabel: string;
  tone: Tone;
}

/** Engineering concerns, each tied to the work where it was actually exercised. */
export const concerns: Concern[] = [
  {
    id: 'tenancy',
    tone: 'data',
    label: 'Multi-tenancy',
    title: 'One schema per institution',
    body: 'Every tenant gets its own PostgreSQL schema through Triplex, and every token carries its tenant — checked before a single row loads.',
    where: 'lms',
    whereLabel: 'ekVana LMS · AIMS',
  },
  {
    id: 'saga',
    tone: 'systems',
    label: 'Failure states',
    title: 'Provisioning that can’t half-succeed',
    body: 'Creating an institution is a saga — registry row, then schema, then ACTIVE. Failures are visible, retryable and never served.',
    where: 'aims',
    whereLabel: 'AIMS',
  },
  {
    id: 'workflow',
    tone: 'automation',
    label: 'Workflow modelling',
    title: 'Lifecycles as explicit states',
    body: 'Tickets move through open, assigned, overdue, resolved, closed and reopened — defined transitions with an audit trail, not ad-hoc flags.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'deadlines',
    tone: 'systems',
    label: 'Time & SLAs',
    title: 'Deadlines in working hours',
    body: 'Turnaround time is counted in each institution’s business hours — carried across days, honouring special hours and time zones.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'jobs',
    tone: 'automation',
    label: 'Background jobs',
    title: 'Slow work leaves the request',
    body: 'Google Drive imports and video remuxing run on Oban — tenant-aware, resumable, with live progress.',
    where: 'lms',
    whereLabel: 'ekVana LMS',
  },
  {
    id: 'ai',
    tone: 'human',
    label: 'AI integration',
    title: 'One gateway, humans in the loop',
    body: 'Model calls go through a single gateway with cost and latency logged; generated questions stay drafts until a teacher publishes them.',
    where: 'lms',
    whereLabel: 'ekVana LMS · feature branch',
  },
  {
    id: 'assignment',
    tone: 'automation',
    label: 'Algorithms',
    title: 'Round-robin assignment',
    body: 'A cursor stored per institution rotates tickets across executives — every ticket gets an owner, and the rotation survives restarts.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'analytics',
    tone: 'data',
    label: 'Analytical SQL',
    title: 'Aggregate where the data lives',
    body: 'Status distribution, TAT compliance and median / mean / mode resolution times computed with Ecto aggregations in PostgreSQL.',
    where: 'helpdesk',
    whereLabel: 'Helpdesk · Ardhika',
  },
  {
    id: 'performance',
    tone: 'data',
    label: 'Query performance',
    title: '25% faster data retrieval',
    body: 'Tuned MySQL queries and introduced indexing strategies under Spring Boot REST APIs.',
    where: 'retech',
    whereLabel: 'RETECH Solutions',
  },
];

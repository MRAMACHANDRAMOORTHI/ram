import { shots } from './media';
import type { ContextId, Project } from './types';

export const projects: Project[] = [
  {
    slug: 'helpdesk',
    tone: 'systems',
    title: 'Helpdesk Platform',
    tagline:
      'Support ticketing for the Sastra Online Learning Platform — round-robin routing, business-hours SLAs and live analytics.',
    year: '2025',
    context: 'Ardhika Software Technologies',
    category: 'EdTech · Support operations',
    role: 'Architect · primary backend engineer',
    stack: ['Elixir', 'Phoenix', 'Vue 3', 'PostgreSQL', 'Ecto', 'Chart.js'],
    links: [
      { label: 'Source', unavailable: 'Private repository' },
      { label: 'Student portal', href: 'https://github.com/MRAMACHANDRAMOORTHI/Helpdesk_Student' },
    ],
    cover: shots.helpdesk[0],
    gallery: shots.helpdesk,
    problem:
      'Admission and fee questions reach the Sastra Online Learning Platform in high volume. The support team needed one place where every query becomes a ticket with an owner and a deadline — and where administrators can see, at a glance, what is open, what is late and who is carrying the load.',
    solution:
      'A Helpdesk on Elixir and Phoenix with Vue 3 front ends for staff and students. Every ticket moves through an explicit lifecycle — open, assigned, overdue, resolved, closed, reopened. A round-robin assigner gives each new ticket an owner, deadlines are counted in each institution’s working hours, and PostgreSQL aggregations feed the analytics dashboard.',
    contribution: [
      'Architected the module and wrote most of the Phoenix backend — data model, ticket lifecycle and APIs.',
      'Built the SLA deadline engine: turnaround time counted in working hours, carried across days, with special hours and time zones.',
      'Implemented round-robin assignment with a persisted cursor per institution.',
      'Built the Vue 3 dashboards and the Ecto aggregations behind them.',
    ],
    capabilities: [
      'Institution and date-range filters across every view',
      'Live counters for total, open, assigned, unassigned, overdue, resolved, closed and reopened tickets',
      'Turnaround-time (TAT) category breakdown and TAT compliance rate',
      'Executive performance — assigned, resolved and pending per person',
      'Month-wise resolution performance by median, mean and mode',
      'Reassignment that recalculates the deadline and writes an audit trail',
      'Reopen policy with configurable time limits',
      'Student portal to raise tickets by category and sub-category, with attachments',
    ],
    architecture: {
      caption: 'Simplified view of the Helpdesk.',
      layers: [
        {
          tone: 'interface',
          label: 'Client',
          nodes: [
            { id: 'vue', label: 'Staff dashboard', detail: 'Vue 3 · Chart.js' },
            { id: 'student', label: 'Student portal', detail: 'Vue 3 · Zod forms' },
          ],
        },
        { tone: 'systems', label: 'Application', nodes: [{ id: 'phoenix', label: 'Phoenix', detail: 'Ticket & reporting APIs' }] },
        {
          label: 'Domain',
          tone: 'automation',
          nodes: [
            { id: 'rr', label: 'Round-robin assigner', detail: 'Cursor per institution' },
            { id: 'fsm', label: 'Ticket lifecycle', detail: 'Explicit states & audit' },
            { id: 'sla', label: 'Deadline engine', detail: 'Working hours · TAT' },
          ],
        },
        {
          label: 'Data',
          tone: 'data',
          nodes: [
            { id: 'ecto', label: 'Ecto', detail: 'Queries & aggregations' },
            { id: 'pg', label: 'PostgreSQL' },
          ],
        },
      ],
      edges: [
        ['vue', 'phoenix'],
        ['student', 'phoenix'],
        ['phoenix', 'fsm'],
        ['phoenix', 'rr'],
        ['phoenix', 'sla'],
        ['fsm', 'ecto'],
        ['rr', 'ecto'],
        ['sla', 'ecto'],
        ['ecto', 'pg'],
      ],
    },
    decisions: [
      {
        title: 'The ticket is a state machine',
        body: 'Open, assigned, overdue, resolved, closed and reopened are explicit states with defined transitions and an audit trail. Counters and reports key off the same lifecycle the workflow uses, so the dashboard and the process never disagree.',
      },
      {
        title: 'Deadlines run on the institution’s clock',
        body: 'Turnaround time is counted in working hours. The deadline engine walks forward through each institution’s schedule — special hours before regular ones, closed days skipped — in that institution’s time zone.',
      },
      {
        title: 'Assignment is automatic and fair',
        body: 'A cursor stored per institution remembers the last executive assigned, so the rotation is even, survives restarts and needs no manual triage queue.',
      },
      {
        title: 'Analytics are computed in PostgreSQL',
        body: 'Status distribution, TAT breakdowns, executive performance and median / mean / mode resolution times are Ecto aggregations — the database does the maths.',
      },
    ],
    outcome: {
      body: 'Streamlined the support workflow and significantly reduced response times for thousands of students.',
    },
  },
  {
    slug: 'lms',
    tone: 'human',
    title: 'ekVana LMS',
    tagline:
      'A multi-tenant learning platform — one Phoenix API, three Vue portals, and every institution in its own PostgreSQL schema.',
    year: '2026',
    context: 'Ardhika Software Technologies',
    category: 'EdTech · Multi-tenant SaaS',
    role: 'Primary backend engineer · Full stack',
    stack: ['Elixir', 'Phoenix', 'PostgreSQL', 'Triplex', 'Oban', 'Vue 3', 'Pinia', 'Tailwind CSS', 'S3 / Spaces'],
    links: [
      { label: 'Source', unavailable: 'Private repository' },
      { label: 'Live', unavailable: 'Institution sign-in only' },
    ],
    visual: 'lms',
    gallery: [],
    problem:
      'Institutions need their own learning platform — courses, assessments, assignments, forums and their own branding — without running a separate deployment for each. And one institution’s learners, marks and files must never be reachable from another.',
    solution:
      'ekVana runs every institution as a tenant of one deployment. A Phoenix JSON API serves three Vue 3 portals: a system console that provisions tenants, an admin portal for staff and faculty, and a learner portal. Each tenant gets its own PostgreSQL schema through Triplex, every token carries the tenant it was issued for, uploaded media lives under tenant-prefixed keys, and slow work — Google Drive imports, video processing — runs on Oban. The Sastra Online Learning Platform is its default tenant.',
    contribution: [
      'Wrote most of the Phoenix backend — tenancy, auth, RBAC, enrolment, content, CIA assessments, assignments, analytics and file handling.',
      'Wrote most of the tenant migrations and the backend test suite.',
      'Built the Google Drive bulk course importer: scan, plan, admin review, then a resumable per-file import on Oban.',
      'Built the system console and contributed across the admin and learner portals.',
      'Built an AI question-generation subsystem — on a feature branch, not yet in production.',
    ],
    capabilities: [
      'Tenant provisioning with per-tenant branding, mail sender and optional SSO',
      'Admin portal: programmes, batches, courses and packs, learners, roles, question banks, CIAs, assignments, forums, announcements',
      'Learner portal: courses, video lessons, documents, quizzes, CIA exams and results, assignments, forums',
      'Permission catalogue (resource × action) enforced per controller; faculty scoped to their courses',
      'Google Drive bulk import with a preview and live progress',
      'Video remuxing for streaming, served through short-lived signed URLs',
      'Password reset by OTP; SSO delegated to the institution’s own ERP',
    ],
    architecture: {
      caption: 'Simplified view of the platform. The AI subsystem is not shown.',
      layers: [
        {
          tone: 'interface',
          label: 'Portals',
          nodes: [
            { id: 'sys', label: 'System console', detail: 'Platform operators' },
            { id: 'admin', label: 'Admin portal', detail: 'Staff & faculty' },
            { id: 'learn', label: 'Learner portal', detail: 'Learners' },
          ],
        },
        { tone: 'systems', label: 'API', nodes: [{ id: 'api', label: 'Phoenix JSON API', detail: 'Tenant-bound JWT · RBAC plugs' }] },
        {
          tone: 'automation',
          label: 'Workers',
          nodes: [
            { id: 'oban', label: 'Oban workers', detail: 'Drive import · video remux' },
            { id: 'mail', label: 'Mail', detail: 'Per-tenant sender' },
          ],
        },
        {
          tone: 'data',
          label: 'Data',
          nodes: [
            { id: 'public', label: 'public schema', detail: 'Tenant directory · jobs' },
            { id: 'tenants', label: 'Tenant schemas', detail: 'One per institution' },
            { id: 'spaces', label: 'Object storage', detail: 'Tenant-prefixed keys' },
          ],
        },
      ],
      edges: [
        ['sys', 'api'],
        ['admin', 'api'],
        ['learn', 'api'],
        ['api', 'oban'],
        ['api', 'mail'],
        ['api', 'public'],
        ['api', 'tenants'],
        ['oban', 'spaces'],
        ['oban', 'tenants'],
      ],
    },
    decisions: [
      {
        title: 'The schema is the tenant boundary',
        body: 'Each institution has its own PostgreSQL schema and every query runs with that prefix — reading another tenant’s rows isn’t filtered out, it’s structurally impossible.',
      },
      {
        title: 'Tokens are bound to a tenant',
        body: 'Every JWT carries the tenant it was issued for, checked against the tenant resolved from the request before any row loads. A token for one institution is useless at another, even with matching IDs.',
      },
      {
        title: 'Permissions live on the controller',
        body: 'RBAC is a resource × action catalogue enforced by controller-level plugs, so read, write and delete can differ on the same path. Faculty are further scoped to the courses they teach.',
      },
      {
        title: 'Slow work leaves the request',
        body: 'Drive imports and video remuxing run as Oban jobs that carry their tenant in the job arguments — resumable, with live progress, and nowhere near the request path.',
      },
      {
        title: 'Media keys carry the tenant',
        body: 'Every object key starts with its tenant. The file plug derives the tenant from the key itself, private files are served by short-lived signed URLs, and deleting a record purges its objects.',
      },
      {
        title: 'AI behind one gateway, humans in the loop',
        body: 'On a feature branch: every model call goes through one gateway (Groq or Gemini, swappable by config) with tokens, latency and cost logged. Generated questions stay drafts until a teacher reviews and publishes them.',
      },
    ],
  },
  {
    slug: 'aims',
    tone: 'data',
    title: 'AIMS',
    tagline:
      'An academic ERP for Indian colleges, built for NAAC accreditation reporting — each institution in its own isolated schema.',
    year: '2026',
    context: 'Ardhika Software Technologies',
    category: 'Higher education · Accreditation',
    role: 'Backend engineer · tenancy & API',
    status: 'In development',
    stack: ['Elixir', 'Phoenix', 'PostgreSQL', 'Ecto', 'Triplex', 'ExUnit', 'React 19', 'TypeScript', 'Tailwind CSS'],
    links: [
      { label: 'API source', href: 'https://github.com/MRAMACHANDRAMOORTHI/AIMS' },
      { label: 'Console source', href: 'https://github.com/MRAMACHANDRAMOORTHI/AIMS_FE' },
    ],
    visual: 'aims',
    gallery: [],
    problem:
      'Colleges preparing for NAAC accreditation must report Criterion 1 — curricular aspects — from real academic data: programmes, courses, curricula and outcomes. Each college’s records must stay isolated, and colleges differ: engineering or arts & science, affiliated or autonomous.',
    solution:
      'A multi-tenant ERP on Phoenix and PostgreSQL. Platform administrators register institutions; each one is provisioned with its own schema. Inside it, the institution manages academics, curriculum and outcome-based-education mapping — CO to PO and PSO, PEO to PO. Two flags, institution type and autonomy, are resolved once into named features, so nothing deeper in the code branches on them.',
    contribution: [
      'Main contributor to the Phoenix API, working with the team.',
      'Designed the tenancy layer — one schema per institution, a separate admin side and tenant side, tenant-resolving plugs.',
      'Built provisioning as a saga with explicit failure states: a half-created institution can never serve a request.',
      'Wrote isolation, provisioning and tenant-resolution tests in ExUnit, plus Postman collections.',
      'Built the first tenant-management console in React 19 and TypeScript.',
    ],
    capabilities: [
      'Register institutions, each provisioned with its own PostgreSQL schema',
      'Institution lifecycle — active, suspended, archived — with retry or discard for failed provisioning',
      'Per-request tenant resolution with distinct errors for missing, unknown and inactive institutions',
      'Academics: departments, programmes, courses, academic years and CSV bulk import',
      'Curriculum: credit components (L, T, P, J), syllabus, learning resources, curriculum versions, electives and streams',
      'Outcome-based education: PO, PSO, CO and PEO lists with CO→PO/PSO and PEO→PO mapping',
      'Health check that names any institution lagging behind on migrations',
    ],
    architecture: {
      caption: 'Simplified view of AIMS.',
      layers: [
        {
          tone: 'interface',
          label: 'Clients',
          nodes: [
            { id: 'console', label: 'Admin console', detail: 'React 19 · TypeScript' },
            { id: 'inst', label: 'Institution app', detail: 'Tenant users' },
          ],
        },
        {
          tone: 'systems',
          label: 'API',
          nodes: [
            { id: 'adminapi', label: '/api/v1/admin', detail: 'Platform administrators' },
            { id: 'tenantapi', label: '/api/v1/tenant', detail: 'x-tenant · user token' },
          ],
        },
        {
          tone: 'automation',
          label: 'Platform',
          nodes: [
            { id: 'saga', label: 'Provisioning saga', detail: 'Explicit failure states' },
            { id: 'profile', label: 'Tenant profile', detail: 'Type × autonomy → features' },
            { id: 'migrator', label: 'Tenant migrator', detail: 'Rollout · lag check' },
          ],
        },
        {
          tone: 'data',
          label: 'Data',
          nodes: [
            { id: 'public', label: 'public schema', detail: 'Institutions · master data' },
            { id: 'schemas', label: 'Institution schemas', detail: 'Academics · curriculum · OBE' },
          ],
        },
      ],
      edges: [
        ['console', 'adminapi'],
        ['inst', 'tenantapi'],
        ['adminapi', 'saga'],
        ['tenantapi', 'profile'],
        ['saga', 'schemas'],
        ['migrator', 'schemas'],
        ['adminapi', 'public'],
        ['profile', 'schemas'],
      ],
    },
    decisions: [
      {
        title: 'Isolation is the schema boundary',
        body: 'Tenant tables carry no tenant_id column — each college has its own schema. Foreign keys never cross that boundary, so every college can be dumped and restored on its own.',
      },
      {
        title: 'Provisioning is a saga, not a transaction',
        body: 'The registry row is committed first, then the schema and migrations, then ACTIVE. Any failure drops the schema and lands in PROVISION_FAILED — visible, retryable, and never served.',
      },
      {
        title: 'Two flags, resolved once',
        body: 'Institution type and autonomy status become a profile of named features at the edge of each request. Code asks “does this tenant do OBE mapping?”, never “is this an engineering college?”.',
      },
      {
        title: 'The tenant slug is a security boundary',
        body: 'Schema names are interpolated into DDL where parameters can’t be bound, so the slug is derived server-side and its grammar is enforced three times: in code, in the changeset and by a database CHECK constraint.',
      },
    ],
    outcome: {
      body: 'Platform layer complete: an institution can be provisioned, resolved and operated on with no path to another institution’s data.',
    },
  },
  {
    slug: 'cict',
    tone: 'automation',
    title: 'Classical Tamil E-Learning',
    tagline:
      'A digital learning platform for the Central Institute of Classical Tamil — courses, assessments and an admin console.',
    year: '2025',
    context: 'Central Institute of Classical Tamil',
    category: 'EdTech · Public institute',
    role: 'Full-stack developer (intern)',
    stack: ['React', 'TypeScript', 'Node.js', 'Firebase', 'Tailwind CSS'],
    links: [
      { label: 'Source', unavailable: 'Private repository (CICT)' },
      { label: 'Live', unavailable: 'Demo offline' },
    ],
    cover: shots.cict[1],
    gallery: [shots.cict[1], shots.cict[2], shots.cict[0]],
    problem:
      'CICT exists to preserve and promote classical Tamil. Its learning resources needed a home online — course registration, video lectures and assessments in one place — plus tooling for staff to run courses, examinations, payments and certificates.',
    solution:
      'A React and TypeScript platform styled with Tailwind CSS, backed by Firebase Authentication and the Realtime Database, with Node.js services in TypeScript. Learners get structured courses; administrators get a console for students, courses, examinations, payment monitoring, certificates and analytics.',
    contribution: [
      'Engineered the front end in React and Tailwind CSS, responsive across devices.',
      'Integrated Firebase Authentication and the Realtime Database.',
      'Worked directly with researchers to shape user flows and readability.',
    ],
    capabilities: [
      'Course registration, video lectures and interactive assessments',
      'Admin modules for students, courses, examinations, payments, certificates and settings',
      'Analytics on enrolment trends, learner professions and course demand',
      'Course-wise and batch-wise payment reporting',
    ],
    architecture: {
      caption: 'Simplified view of the learning platform.',
      layers: [
        {
          label: 'Client',
          tone: 'interface',
          nodes: [{ id: 'react', label: 'React + TypeScript', detail: 'Learner portal & admin console' }],
        },
        { tone: 'systems', label: 'Services', nodes: [{ id: 'node', label: 'Node.js services', detail: 'TypeScript' }] },
        {
          label: 'Firebase',
          tone: 'data',
          nodes: [
            { id: 'auth', label: 'Authentication' },
            { id: 'rtdb', label: 'Realtime Database', detail: 'Live course & learner data' },
          ],
        },
      ],
      edges: [
        ['react', 'auth'],
        ['react', 'node'],
        ['react', 'rtdb'],
        ['node', 'rtdb'],
      ],
    },
    decisions: [
      {
        title: 'Managed identity and live data',
        body: 'Firebase Authentication and the Realtime Database handle sign-in and real-time sync, so the effort goes into the learning experience instead of infrastructure.',
      },
      {
        title: 'TypeScript end to end',
        body: 'One language and one set of types from the React client to the Node.js services.',
      },
      {
        title: 'Readability is a feature',
        body: 'Classical Tamil material is dense. Layouts and flows were shaped with researchers for long-form reading on every screen size.',
      },
    ],
    outcome: {
      metric: '30%',
      label: 'more engagement',
      body: 'Opened up classical Tamil learning material online, with user engagement up by over 30%.',
    },
  },
  {
    slug: 'healthchain',
    tone: 'signal',
    title: 'HealthChain',
    tagline:
      'A medical-records platform with role-based access for patients, doctors and admins — and a Solidity contract layer via Web3j.',
    year: '2025',
    context: 'Open source',
    category: 'HealthTech · Blockchain',
    role: 'Design & full-stack build',
    stack: ['Java 17', 'Spring Boot', 'Spring Security', 'MySQL', 'Solidity', 'Web3j', 'Thymeleaf'],
    links: [
      { label: 'Source', href: 'https://github.com/MRAMACHANDRAMOORTHI/HealthChain_MCA' },
      { label: 'UI preview', href: 'https://mramachandramoorthi.github.io/Healthchain/' },
    ],
    cover: shots.healthchain[0],
    gallery: shots.healthchain,
    problem:
      'Medical records have to move between patients and providers without losing track of who can see them or whether they have changed. The aim: give patients control of their history while doctors get the access they need, with the right permissions.',
    solution:
      'A Spring Boot application on Java 17 with Spring Security and role-specific Thymeleaf dashboards for administrators, doctors and patients. Users, appointments, doctor–patient relationships and records live in MySQL through Spring Data JPA, scoped to each patient and treating doctor. A Solidity MedicalRecord contract — one entry per patient, an event on every write — is bound to Java with Web3j and targets the Sepolia testnet.',
    contribution: [
      'Modelled the domain: users, patients, doctors, appointments, records and doctor–patient relationships.',
      'Wrote the MedicalRecord Solidity contract and generated its Web3j bindings.',
      'Built role-based Thymeleaf dashboards behind Spring Security.',
      'Added appointment booking with email confirmation through Spring Mail.',
    ],
    capabilities: [
      'Sign-up and login with role-based dashboards for admins, doctors and patients',
      'Medical record upload and per-patient, per-doctor record views',
      'Appointment booking with email confirmation',
      'Prescription management',
      'Blockchain explorer view',
    ],
    architecture: {
      caption: 'Simplified view. The contract layer is wired for the Sepolia testnet.',
      layers: [
        { tone: 'interface', label: 'Views', nodes: [{ id: 'views', label: 'Thymeleaf', detail: 'Admin · doctor · patient' }] },
        {
          label: 'Application',
          tone: 'systems',
          nodes: [
            { id: 'security', label: 'Spring Security' },
            { id: 'spring', label: 'Spring Boot', detail: 'Controllers & services' },
            { id: 'mail', label: 'Spring Mail' },
          ],
        },
        {
          label: 'Integration',
          tone: 'automation',
          nodes: [
            { id: 'jpa', label: 'Spring Data JPA' },
            { id: 'web3j', label: 'Web3j bindings' },
          ],
        },
        {
          label: 'Storage',
          tone: 'data',
          nodes: [
            { id: 'mysql', label: 'MySQL' },
            { id: 'contract', label: 'MedicalRecord.sol', detail: 'Per-patient payload · events' },
          ],
        },
      ],
      edges: [
        ['views', 'security'],
        ['security', 'spring'],
        ['spring', 'mail'],
        ['spring', 'jpa'],
        ['spring', 'web3j'],
        ['jpa', 'mysql'],
        ['web3j', 'contract'],
      ],
    },
    decisions: [
      {
        title: 'Relational data stays relational',
        body: 'Users, appointments, relationships and records are JPA entities in MySQL, queried per patient and per treating doctor.',
      },
      {
        title: 'An integrity layer on-chain',
        body: 'The contract keeps one payload per patient ID and emits a RecordStored event on each write — an append-only trail of every change.',
      },
      {
        title: 'Secure by default',
        body: 'Spring Security guards every route except login and sign-up. Authorization lives on the server, next to the views it protects.',
      },
      {
        title: 'Typed contract bindings',
        body: 'Web3j generates a Java wrapper for the Solidity contract, so blockchain calls are ordinary, type-checked method calls.',
      },
    ],
  },
  {
    slug: 'scholorsphere',
    tone: 'interface',
    title: 'Scholorsphere',
    tagline:
      'An academic portal for SRM’s Faculty of Science & Humanities — departments, campus, faculty and alumni in one place.',
    year: '2024',
    context: 'Open source',
    category: 'Education · Web',
    role: 'Design & front-end build',
    stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    links: [
      { label: 'Source', href: 'https://github.com/MRAMACHANDRAMOORTHI/Scholorsphere' },
      { label: 'Live', href: 'https://mramachandramoorthi.github.io/Scholorsphere/' },
    ],
    cover: shots.scholorsphere[0],
    gallery: shots.scholorsphere,
    problem:
      'Students, faculty and researchers needed a shared front door to the Faculty of Science & Humanities — somewhere to find departments, campus facilities, faculty and alumni without hunting across pages.',
    solution:
      'A fast, dependency-free static site in semantic HTML, CSS and vanilla JavaScript, deployed on GitHub Pages. Department pages for Computer Applications and Computer Science sit alongside campus, faculty and alumni sections.',
    contribution: [
      'Designed the information architecture and page layouts.',
      'Built every page in hand-written HTML, CSS and JavaScript.',
      'Deployed and hosted it on GitHub Pages.',
    ],
    capabilities: [
      'Department pages for Computer Applications and Computer Science',
      'Campus tour — Tech Park, library, hostels, auditorium, hospital, School of Architecture',
      'Faculty and alumni showcases',
      'Contact and sign-up call to action',
    ],
    architecture: {
      caption: 'A static site needs no more than this.',
      layers: [
        {
          label: 'Pages',
          tone: 'interface',
          nodes: [
            { id: 'home', label: 'Home' },
            { id: 'ca', label: 'Computer Applications' },
            { id: 'cs', label: 'Computer Science' },
          ],
        },
        {
          label: 'Assets',
          tone: 'interface',
          nodes: [
            { id: 'css', label: 'CSS' },
            { id: 'js', label: 'Vanilla JS' },
          ],
        },
        { tone: 'systems', label: 'Hosting', nodes: [{ id: 'gh', label: 'GitHub Pages', detail: 'Static CDN' }] },
      ],
      edges: [
        ['home', 'css'],
        ['ca', 'css'],
        ['cs', 'css'],
        ['home', 'js'],
        ['css', 'gh'],
        ['js', 'gh'],
      ],
    },
    decisions: [
      {
        title: 'No framework required',
        body: 'A handful of content pages doesn’t need a single-page app. Static HTML loads instantly and stays easy to maintain.',
      },
      {
        title: 'Zero-ops hosting',
        body: 'GitHub Pages serves the site from a CDN with nothing to run, patch or pay for.',
      },
    ],
  },
];

export const projectBySlug = (slug: string): Project | undefined => projects.find((p) => p.slug === slug);

export const isProjectSlug = (value: string | null): value is ContextId =>
  value !== null && projects.some((p) => p.slug === value);

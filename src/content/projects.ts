import { shots } from './media';
import type { ContextId, Project } from './types';

export const projects: Project[] = [
  {
    slug: 'helpdesk',
    title: 'Helpdesk Platform',
    tagline:
      'Support ticketing for the Sastra Online Learning Platform — SLA automation, round-robin routing and live analytics.',
    year: '2025',
    context: 'Ardhika Software Technologies',
    category: 'EdTech · Support operations',
    role: 'Sole architect · Full stack',
    stack: ['Elixir', 'Phoenix', 'Vue 3', 'PostgreSQL', 'Ecto'],
    links: [
      { label: 'Source', unavailable: 'Private repository' },
      { label: 'Live', unavailable: 'No public demo' },
    ],
    cover: shots.helpdesk[0],
    gallery: shots.helpdesk,
    problem:
      'Admission and fee questions reach the Sastra Online Learning Platform in high volume. The support team needed one place where every query becomes a ticket with an owner and a deadline — and where administrators can see, at a glance, what is open, what is late and who is carrying the load.',
    solution:
      'A Helpdesk module on Elixir and Phoenix with a Vue 3 front end. Every ticket moves through an explicit lifecycle — open, assigned, overdue, resolved, closed, reopened. A round-robin assigner gives each new ticket an owner, an SLA engine escalates breaches through background jobs, and PostgreSQL aggregations feed the analytics dashboard in real time.',
    contribution: [
      'Architected the module end to end — data model, ticket lifecycle and service boundaries.',
      'Built the automated SLA tracking engine with background-job escalation.',
      'Implemented round-robin ticket assignment across support executives.',
      'Built the Vue 3 dashboards and the Ecto aggregations behind them.',
    ],
    capabilities: [
      'Institution and date-range filters across every view',
      'Live counters for total, open, assigned, unassigned, overdue, resolved, closed and reopened tickets',
      'Status distribution and daily ticket activity',
      'Turnaround-time (TAT) category breakdown',
      'Executive performance — assigned, resolved and pending per person',
      'Month-wise resolution performance by median, mean and mode',
      'Feedback Hub',
    ],
    architecture: {
      caption: 'Simplified view of the Helpdesk module.',
      layers: [
        { label: 'Client', nodes: [{ id: 'vue', label: 'Vue 3 SPA', detail: 'Dashboards & ticket views' }] },
        { label: 'Application', nodes: [{ id: 'phoenix', label: 'Phoenix', detail: 'Ticket & reporting APIs' }] },
        {
          label: 'Domain',
          nodes: [
            { id: 'rr', label: 'Round-robin assigner', detail: 'Owner for every ticket' },
            { id: 'fsm', label: 'Ticket lifecycle', detail: 'Explicit states & transitions' },
            { id: 'sla', label: 'SLA engine', detail: 'Background jobs · escalation' },
          ],
        },
        {
          label: 'Data',
          nodes: [
            { id: 'ecto', label: 'Ecto', detail: 'Queries & aggregations' },
            { id: 'pg', label: 'PostgreSQL' },
          ],
        },
      ],
      edges: [
        ['vue', 'phoenix'],
        ['phoenix', 'fsm'],
        ['phoenix', 'rr'],
        ['sla', 'fsm'],
        ['fsm', 'ecto'],
        ['rr', 'ecto'],
        ['sla', 'ecto'],
        ['ecto', 'pg'],
      ],
    },
    decisions: [
      {
        title: 'The ticket is a state machine',
        body: 'Open, assigned, overdue, resolved, closed and reopened are explicit states with defined transitions. Counters and reports key off the same lifecycle the workflow uses, so the dashboard and the process never disagree.',
      },
      {
        title: 'Deadlines run in the background',
        body: 'SLA tracking lives in background jobs, not request handlers — a breach escalates on time even when nobody has the ticket open.',
      },
      {
        title: 'Assignment is automatic and even',
        body: 'A round-robin assigner spreads incoming tickets across executives. No manual triage queue, no ticket without an owner.',
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
    slug: 'cict',
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
          nodes: [{ id: 'react', label: 'React + TypeScript', detail: 'Learner portal & admin console' }],
        },
        { label: 'Services', nodes: [{ id: 'node', label: 'Node.js services', detail: 'TypeScript' }] },
        {
          label: 'Firebase',
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
        { label: 'Views', nodes: [{ id: 'views', label: 'Thymeleaf', detail: 'Admin · doctor · patient' }] },
        {
          label: 'Application',
          nodes: [
            { id: 'security', label: 'Spring Security' },
            { id: 'spring', label: 'Spring Boot', detail: 'Controllers & services' },
            { id: 'mail', label: 'Spring Mail' },
          ],
        },
        {
          label: 'Integration',
          nodes: [
            { id: 'jpa', label: 'Spring Data JPA' },
            { id: 'web3j', label: 'Web3j bindings' },
          ],
        },
        {
          label: 'Storage',
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
          nodes: [
            { id: 'home', label: 'Home' },
            { id: 'ca', label: 'Computer Applications' },
            { id: 'cs', label: 'Computer Science' },
          ],
        },
        {
          label: 'Assets',
          nodes: [
            { id: 'css', label: 'CSS' },
            { id: 'js', label: 'Vanilla JS' },
          ],
        },
        { label: 'Hosting', nodes: [{ id: 'gh', label: 'GitHub Pages', detail: 'Static CDN' }] },
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

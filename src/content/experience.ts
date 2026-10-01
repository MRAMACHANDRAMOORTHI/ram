import ardhika from '../assets/logos/ardhika.webp';
import cict from '../assets/logos/cict.webp';
import retech from '../assets/logos/retech.webp';
import type { Education, Role } from './types';

export const roles: Role[] = [
  {
    id: 'helpdesk',
    company: 'Ardhika Software Technologies',
    companyShort: 'Ardhika',
    logo: ardhika,
    title: 'Software Engineer',
    start: '2025-08',
    summary:
      'Leading development of the Helpdesk module for the Sastra Online Learning Platform — a full-scale support ticketing system for high-volume admission and fee queries, built on Elixir and Phoenix.',
    highlights: [
      'Architected the ticketing system end to end on Elixir and the Phoenix Framework.',
      'Engineered an automated SLA tracking engine with background-job escalation.',
      'Implemented round-robin automatic ticket assignment across support executives.',
      'Built real-time analytics dashboards with Vue 3 and PostgreSQL (Ecto) aggregations.',
      'Streamlined the support workflow, significantly reducing response times for thousands of students.',
    ],
    stack: ['Elixir', 'Phoenix', 'Vue 3', 'PostgreSQL', 'System design'],
    project: 'helpdesk',
  },
  {
    id: 'cict',
    company: 'Central Institute of Classical Tamil',
    companyShort: 'CICT',
    url: 'https://www.cict.in',
    logo: cict,
    title: 'Full Stack Developer',
    kind: 'Internship',
    location: 'Chennai',
    start: '2025-03',
    end: '2025-08',
    summary:
      'Built a digital learning platform that makes classical Tamil resources accessible online, working closely with the institute’s researchers.',
    highlights: [
      'Engineered a responsive front end with React and Tailwind CSS.',
      'Integrated Firebase Authentication and the Realtime Database.',
      'Collaborated with researchers on user flows and readability.',
    ],
    impact: [{ value: 30, suffix: '%', label: 'increase in engagement' }],
    stack: ['React', 'Tailwind CSS', 'Firebase', 'Node.js', 'UI/UX'],
    project: 'cict',
  },
  {
    id: 'retech',
    company: 'RETECH Solutions Pvt Ltd',
    companyShort: 'RETECH',
    url: 'https://www.retechsolutions.com',
    logo: retech,
    title: 'Full Stack Java Developer',
    kind: 'Internship',
    location: 'Chennai',
    start: '2024-05',
    end: '2025-02',
    summary:
      'Worked on enterprise applications — designing and optimising RESTful APIs in Spring Boot and tuning the MySQL layer underneath them.',
    highlights: [
      'Developed and optimised RESTful APIs with Spring Boot.',
      'Tuned MySQL queries and introduced indexing strategies.',
      'Delivered features in Agile sprints with cross-functional teams.',
    ],
    impact: [{ value: 25, suffix: '%', label: 'faster data retrieval' }],
    stack: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'Agile'],
  },
];

export const education: Education[] = [
  {
    degree: 'Master of Computer Applications',
    school: 'SRM Institute of Science and Technology',
    url: 'https://www.srmist.edu.in/',
    place: 'Chennai',
    period: '2023 — 2025',
    score: 9.4,
    scoreLabel: 'CGPA',
  },
  {
    degree: 'B.Sc. Computer Science',
    school: 'GTN Arts and Science College',
    url: 'https://gtnarts.org/',
    place: 'Dindigul',
    period: '2020 — 2023',
    score: 8.5,
    scoreLabel: 'CGPA',
  },
];

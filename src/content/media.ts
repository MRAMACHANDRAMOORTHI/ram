import type { Shot } from './types';

import helpdesk1lg from '../assets/work/helpdesk-1-1600.webp';
import helpdesk1sm from '../assets/work/helpdesk-1-800.webp';
import helpdesk2lg from '../assets/work/helpdesk-2-1600.webp';
import helpdesk2sm from '../assets/work/helpdesk-2-800.webp';
import helpdesk3lg from '../assets/work/helpdesk-3-1600.webp';
import helpdesk3sm from '../assets/work/helpdesk-3-800.webp';
import cict1lg from '../assets/work/cict-1-1600.webp';
import cict1sm from '../assets/work/cict-1-800.webp';
import cict2lg from '../assets/work/cict-2-1600.webp';
import cict2sm from '../assets/work/cict-2-800.webp';
import cict3lg from '../assets/work/cict-3-1600.webp';
import cict3sm from '../assets/work/cict-3-800.webp';
import scholor1lg from '../assets/work/scholorsphere-1-1600.webp';
import scholor1sm from '../assets/work/scholorsphere-1-800.webp';
import scholor2lg from '../assets/work/scholorsphere-2-1600.webp';
import scholor2sm from '../assets/work/scholorsphere-2-800.webp';
import scholor3lg from '../assets/work/scholorsphere-3-1600.webp';
import scholor3sm from '../assets/work/scholorsphere-3-800.webp';
import health1lg from '../assets/work/healthchain-1-1600.webp';
import health1sm from '../assets/work/healthchain-1-800.webp';
import health2lg from '../assets/work/healthchain-2-1600.webp';
import health2sm from '../assets/work/healthchain-2-800.webp';
import health3lg from '../assets/work/healthchain-3-1600.webp';
import health3sm from '../assets/work/healthchain-3-800.webp';

/** Build a responsive image from the two generated sizes and the source dimensions. */
function shot(lg: string, sm: string, sourceWidth: number, sourceHeight: number, alt: string): Shot {
  const width = Math.min(1600, sourceWidth);
  const smWidth = Math.min(800, sourceWidth);
  return {
    src: lg,
    srcSet: `${sm} ${smWidth}w, ${lg} ${width}w`,
    width,
    height: Math.round((sourceHeight * width) / sourceWidth),
    alt,
  };
}

export const shots = {
  helpdesk: [
    shot(helpdesk1lg, helpdesk1sm, 1908, 958, 'Helpdesk dashboard with institution and date filters and ticket counters for total, open, resolved, closed, assigned, unassigned, overdue and reopened tickets'),
    shot(helpdesk2lg, helpdesk2sm, 1893, 949, 'Month-wise resolution performance radar chart plotting median, mean and mode resolution time'),
    shot(helpdesk3lg, helpdesk3sm, 1868, 952, 'Top TAT categories table and executive performance table with assigned, resolved and pending counts'),
  ],
  cict: [
    shot(cict1lg, cict1sm, 1905, 855, 'CICT learning portal landing page with a parchment-styled introduction in Tamil'),
    shot(cict2lg, cict2sm, 1917, 941, 'CICT admin dashboard with student, course and instructor counts, enrolment trend, learner professions and course demand'),
    shot(cict3lg, cict3sm, 1902, 913, 'CICT payment monitoring view with total revenue and course-wise, batch-wise payment chart'),
  ],
  scholorsphere: [
    shot(scholor1lg, scholor1sm, 1873, 948, 'Scholorsphere home page for the SRM Faculty of Science and Humanities, Department of Computer Applications and Computer Science'),
    shot(scholor2lg, scholor2sm, 1867, 931, 'Scholorsphere campus page with cards for Tech Park, University Library, hostels, auditorium, hospital and School of Architecture'),
    shot(scholor3lg, scholor3sm, 1831, 920, 'Scholorsphere alumni showcase and contact section'),
  ],
  healthchain: [
    shot(health1lg, health1sm, 954, 911, 'HealthChain landing page: revolutionising healthcare with blockchain, with login, sign up and appointment actions'),
    shot(health2lg, health2sm, 934, 936, 'HealthChain “why choose us” section listing decentralised security, immutable records and patient-controlled access'),
    shot(health3lg, health3sm, 926, 927, 'HealthChain appointment booking form with email confirmation note'),
  ],
} satisfies Record<string, Shot[]>;

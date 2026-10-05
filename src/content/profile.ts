export const profile = {
  name: 'Ramachandramoorthi M',
  fullName: 'Ramachandramoorthi Muniyappan',
  monogram: 'MSR',
  role: 'Software Engineer',
  company: 'Ardhika Software Technologies',
  degree: 'MCA',
  region: 'India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'mrcmoorthi@gmail.com',
  phone: { label: '+91 80723 65616', href: 'tel:+918072365616' },
  resume: `${import.meta.env.BASE_URL}Ramachandramoorthi_.pdf`,
  core: ['Elixir', 'Phoenix', 'Vue 3', 'PostgreSQL'],
  /** The profile statement, as a pull-quote lead and its body. *asterisks* mark the accent words. */
  statement: {
    lead: 'I like the part of a product most people never see — the workflow rules, the timers and the queries that keep a dashboard *honest.*',
    body: 'Today I build in Elixir and Phoenix with Vue 3 and PostgreSQL. Before that: React and Firebase for a classical-Tamil learning platform at CICT, and Spring Boot APIs on MySQL at RETECH. The constant is the same — software that *keeps working* when the volume shows up.',
  },
} as const;

export interface Channel {
  id: 'email' | 'linkedin' | 'github' | 'whatsapp' | 'phone' | 'instagram';
  label: string;
  handle: string;
  href: string;
  external: boolean;
}

export const channels: Channel[] = [
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/ramachandramoorthi', href: 'https://linkedin.com/in/ramachandramoorthi', external: true },
  { id: 'github', label: 'GitHub', handle: '@MRAMACHANDRAMOORTHI', href: 'https://github.com/MRAMACHANDRAMOORTHI', external: true },
  { id: 'whatsapp', label: 'WhatsApp', handle: 'Chat on WhatsApp', href: 'https://wa.me/918072365616', external: true },
  { id: 'phone', label: 'Phone', handle: profile.phone.label, href: profile.phone.href, external: false },
  { id: 'instagram', label: 'Instagram', handle: '@ramachandramoorthi_m', href: 'https://www.instagram.com/ramachandramoorthi_m', external: true },
];

export const principles = [
  {
    title: 'Model the workflow first',
    body: 'States and transitions before screens. If the lifecycle is explicit, the UI and the reports fall out of it.',
  },
  {
    title: 'Automate the follow-up',
    body: 'Assignment, escalation and deadlines run as background work — nobody should have to remember to chase a ticket.',
  },
  {
    title: 'Let the database do the maths',
    body: 'Aggregate where the data lives. Indexes and well-shaped queries beat clever code in the request path.',
  },
  {
    title: 'Design with the people who use it',
    body: 'Researchers, support executives, students — the workflow is theirs. I build it with them, not just for them.',
  },
] as const;

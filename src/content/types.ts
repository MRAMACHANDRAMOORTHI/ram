/**
 * Domain tones (see styles/index.css). Visual identity only — never carries facts.
 * systems = backend · interface = frontend · data · automation = jobs & workflows
 * · signal = responses & healthy state · human = people, profile, career.
 */
export type Tone = 'systems' | 'interface' | 'data' | 'automation' | 'signal' | 'human';

/** Where a skill or decision was exercised. Keys map to roles and projects. */
export type ContextId = 'helpdesk' | 'lms' | 'aims' | 'cict' | 'retech' | 'healthchain' | 'scholorsphere';

/** Projects without public screenshots are shown with an illustration rebuilt from their documentation. */
export type VisualId = 'lms' | 'aims';

export interface Shot {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
}

export interface ProjectLink {
  label: string;
  href?: string;
  /** Shown instead of a link when the resource is not publicly reachable. */
  unavailable?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  detail?: string;
}

export interface ArchitectureLayer {
  label: string;
  tone: Tone;
  nodes: ArchitectureNode[];
}

export interface ArchitectureSpec {
  layers: ArchitectureLayer[];
  edges: Array<[string, string]>;
  caption: string;
}

export interface Project {
  slug: ContextId;
  tone: Tone;
  title: string;
  tagline: string;
  year: string;
  context: string;
  category: string;
  role: string;
  status?: string;
  stack: string[];
  links: ProjectLink[];
  /** A real screenshot, or — when none can be shown — an illustration (`visual`). */
  cover?: Shot;
  visual?: VisualId;
  gallery: Shot[];
  problem: string;
  solution: string;
  contribution: string[];
  capabilities: string[];
  architecture: ArchitectureSpec;
  decisions: Array<{ title: string; body: string }>;
  outcome?: { metric?: string; label?: string; body: string };
}

export interface Impact {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
}

export interface Role {
  id: ContextId;
  tone: Tone;
  company: string;
  companyShort: string;
  url?: string;
  logo: string;
  title: string;
  kind?: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, undefined = present
  summary: string;
  highlights: string[];
  impact?: Impact[];
  stack: string[];
  projects?: ContextId[];
}

export interface Education {
  degree: string;
  school: string;
  url: string;
  place: string;
  period: string;
  score: number;
  scoreLabel: string;
}

export type StackGroup = 'Languages' | 'Backend' | 'Frontend' | 'Data' | 'Practice';

export interface Tech {
  id: string;
  name: string;
  group: StackGroup;
  note: string;
  usedIn: ContextId[];
  core?: boolean;
}

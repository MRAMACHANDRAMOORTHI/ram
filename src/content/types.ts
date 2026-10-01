/** Where a skill or decision was exercised. Keys map to roles and projects. */
export type ContextId = 'helpdesk' | 'cict' | 'retech' | 'healthchain' | 'scholorsphere';

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
  nodes: ArchitectureNode[];
}

export interface ArchitectureSpec {
  layers: ArchitectureLayer[];
  edges: Array<[string, string]>;
  caption: string;
}

export interface Project {
  slug: ContextId;
  title: string;
  tagline: string;
  year: string;
  context: string;
  category: string;
  role: string;
  status?: string;
  stack: string[];
  links: ProjectLink[];
  cover: Shot;
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
  project?: ContextId;
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

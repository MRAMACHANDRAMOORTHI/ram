import type { ProjectLink } from '../../../content/types';
import { Button } from '../../primitives/Button';

export function ProjectLinks({ links }: { links: ProjectLink[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link, i) =>
        link.href ? (
          <Button key={link.label} href={link.href} external variant={i === 0 ? 'primary' : 'secondary'} icon="arrow-up-right">
            {link.label}
          </Button>
        ) : (
          <span
            key={link.label}
            className="text-label inline-flex h-12 items-center gap-2 rounded-full border border-dashed border-line-strong px-5 text-faint"
          >
            <span className="text-muted">{link.label}</span>
            <span aria-hidden="true">·</span>
            {link.unavailable}
          </span>
        ),
      )}
    </div>
  );
}

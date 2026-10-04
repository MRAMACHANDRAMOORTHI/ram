import type { Project } from '../../content/types';
import { cn } from '../../lib/utils';
import { AimsVisual } from './AimsVisual';
import { LmsVisual } from './LmsVisual';

interface ProjectVisualProps {
  project: Project;
  sizes?: string;
  className?: string;
  /** Alt text for the screenshot; decorative ("") by default because a caption or label names the project. */
  alt?: string;
  eager?: boolean;
}

/** A project's cover: its real screenshot when one exists, otherwise its illustration. */
export function ProjectVisual({ project, sizes = '100vw', className, alt = '', eager = false }: ProjectVisualProps) {
  if (project.cover) {
    const c = project.cover;
    return (
      <img
        src={c.src}
        srcSet={c.srcSet}
        sizes={sizes}
        width={c.width}
        height={c.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={cn('size-full object-cover object-top', className)}
      />
    );
  }
  return <div className={cn('size-full', className)}>{project.visual === 'aims' ? <AimsVisual /> : <LmsVisual />}</div>;
}

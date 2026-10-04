import type { ComponentPropsWithoutRef } from 'react';
import { sectionTone } from '../../content/navigation';
import { toneStyle } from '../../lib/tones';
import { cn } from '../../lib/utils';

interface ToneSectionProps extends ComponentPropsWithoutRef<'section'> {
  id: string;
  /** Show the soft pool of tone light at the top of the section. */
  ambient?: boolean;
}

/**
 * A page section that carries its domain tone (from navigation.ts). Children
 * inherit it through `--tone` — section index, accent words, spotlights, chips.
 */
export function ToneSection({ id, ambient = true, className, style, children, ...rest }: ToneSectionProps) {
  return (
    <section id={id} className={cn('relative isolate', className)} style={{ ...toneStyle(sectionTone(id)), ...style }} {...rest}>
      {ambient && <div aria-hidden="true" className="tone-ambient pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] opacity-80" />}
      {children}
    </section>
  );
}

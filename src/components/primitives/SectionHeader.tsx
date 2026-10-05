import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { Reveal } from './Reveal';
import { SplitReveal } from './SplitReveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  intro?: ReactNode;
  id?: string;
}

export function SectionHeader({ index, label, title, intro, id }: SectionHeaderProps) {
  return (
    <header className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <div className="text-meta flex items-center gap-3 text-faint">
          <span className="text-tone">{index}</span>
          <m.span
            aria-hidden="true"
            className="h-px w-14 origin-left bg-gradient-to-r from-tone to-line-strong"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
          />
          <span>{label}</span>
        </div>
        <SplitReveal as="h2" id={id} text={title} className="text-title mt-6 text-balance outline-none [&_.serif-em]:text-accent" />
      </div>
      {intro && (
        <Reveal className="text-lead text-muted lg:col-span-4 lg:pb-2" delay={0.15}>
          {intro}
        </Reveal>
      )}
    </header>
  );
}

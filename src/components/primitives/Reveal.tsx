import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../lib/motion';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.3 : 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </m.div>
  );
}

interface GroupProps {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'ol';
}

/** Parent that staggers its RevealItem children. */
export function RevealGroup({ children, className, step = 0.08, delay = 0, as = 'div' }: GroupProps) {
  const Comp = as === 'ul' ? m.ul : as === 'ol' ? m.ol : m.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: step, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduced = useReducedMotion();
  const Comp = as === 'li' ? m.li : m.div;
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 24 },
        visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.3 : 0.85, ease: EASE_OUT_EXPO } },
      }}
    >
      {children}
    </Comp>
  );
}

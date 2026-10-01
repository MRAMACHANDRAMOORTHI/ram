import { m, useSpring } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Pulls its child toward the cursor while hovered. Inert on touch and with reduced motion. */
export function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const spring = { stiffness: 240, damping: 18, mass: 0.35 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}

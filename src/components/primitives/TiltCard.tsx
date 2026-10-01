import { m, useSpring } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}

/** Perspective tilt toward the cursor with a moving specular highlight. */
export function TiltCard({ children, className, max = 9, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const spring = { stiffness: 160, damping: 16, mass: 0.6 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set(-(py - 0.5) * 2 * max);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="[perspective:1200px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('group/tilt relative', className)}
      >
        {children}
        {glare && enabled && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgb(255 255 255 / 0.28), transparent 45%)',
              mixBlendMode: 'soft-light',
            }}
          />
        )}
      </m.div>
    </div>
  );
}

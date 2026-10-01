import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/utils';

type Mode = 'idle' | 'link' | 'view' | 'hidden';

/** A soft ring that trails the (still visible) native cursor and labels rich targets. */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  if (!fine || reduced) return null;
  return <CursorRing />;
}

function CursorRing() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = { stiffness: 420, damping: 36, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const target = (e.target as Element).closest('[data-cursor], a, button, label, [role="option"], canvas, input, textarea, select');
      if (!target) return setMode('idle');
      if (target.matches('input, textarea, select, canvas')) return setMode('hidden');
      const text = target.getAttribute('data-cursor');
      if (text) {
        setLabel(text);
        setMode('view');
      } else setMode('link');
    };
    const onLeave = () => setMode('hidden');
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  const scale = { idle: 0.36, link: 0.62, view: 1, hidden: 0 }[mode];

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[95] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <div
        className={cn(
          'grid size-20 place-items-center rounded-full border border-white transition-[transform,background-color,opacity] duration-500 ease-out-expo',
          mode === 'view' ? 'bg-white' : 'bg-transparent',
          mode === 'hidden' && 'opacity-0',
        )}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <span
          className={cn(
            'text-[0.625rem] font-semibold tracking-[0.14em] text-black uppercase transition-opacity duration-300',
            mode === 'view' ? 'opacity-100' : 'opacity-0',
          )}
        >
          {label}
        </span>
      </div>
    </m.div>
  );
}

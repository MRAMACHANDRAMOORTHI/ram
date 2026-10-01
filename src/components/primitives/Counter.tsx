import { useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useMediaQuery';

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts up once when visible. Screen readers get the final value only. */
export function Counter({ value, decimals = 0, prefix = '', suffix = '', className, duration = 1.8 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    const render = (v: number) => {
      el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
    };
    if (reduced) {
      render(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      render(value * easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, decimals, prefix, suffix, duration]);

  return (
    <span className={className}>
      <span aria-hidden="true" ref={ref} className="tabular-nums">
        {format(0)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}

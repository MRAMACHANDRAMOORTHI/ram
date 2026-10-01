import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { cn } from '../../../lib/utils';

interface Token {
  text: string;
  em: boolean;
}

function tokenize(text: string): Token[] {
  const out: Token[] = [];
  text.split('*').forEach((chunk, i) => {
    chunk
      .split(' ')
      .filter(Boolean)
      .forEach((w) => out.push({ text: w, em: i % 2 === 1 }));
  });
  return out;
}

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <m.span style={{ opacity }} className={cn(token.em && 'serif-em text-accent')}>
      {token.text}
    </m.span>
  );
}

/** A paragraph that brightens word by word as it scrolls through the viewport. */
export function ScrollStatement({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const tokens = useMemo(() => tokenize(text), [text]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.5'] });

  if (reduced) {
    return (
      <p className={className}>
        {tokens.map((t, i) => (
          <span key={i}>
            <span className={cn(t.em && 'serif-em text-accent')}>{t.text}</span>{' '}
          </span>
        ))}
      </p>
    );
  }

  const n = tokens.length;
  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => (
        <span key={i}>
          <Word token={t} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 1.5) / n)]} />{' '}
        </span>
      ))}
    </p>
  );
}

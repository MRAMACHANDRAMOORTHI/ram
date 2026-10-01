import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Chip({ children, className, tone = 'default' }: { children: ReactNode; className?: string; tone?: 'default' | 'accent' | 'signal' }) {
  return (
    <span
      className={cn(
        'text-label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 leading-none whitespace-nowrap',
        tone === 'default' && 'border-line text-muted',
        tone === 'accent' && 'border-accent/30 bg-accent-soft text-accent',
        tone === 'signal' && 'border-signal/30 bg-signal-soft text-signal',
        className,
      )}
    >
      {children}
    </span>
  );
}

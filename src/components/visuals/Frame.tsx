import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * A fixed-proportion "screen" that scales with its container: 1em = 2% of the
 * container width, so every measurement inside is written in em.
 */
export function Frame({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div role="img" aria-label={label} className={cn('@container size-full', className)}>
      <div
        aria-hidden="true"
        className="relative flex size-full overflow-hidden bg-[#f5f6f9] font-sans leading-[1.35] text-[#0f172a] select-none"
        style={{ fontSize: '2cqw' }}
      >
        {children}
      </div>
    </div>
  );
}

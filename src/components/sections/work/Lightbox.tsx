import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Shot } from '../../../content/types';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { Icon } from '../../primitives/Icon';

interface LightboxProps {
  shots: Shot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

export function Lightbox({ shots, index, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = shots.length;
  const shot = shots[index];
  useFocusTrap(ref);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % n);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, n, onClose, onIndex]);

  const navButton =
    'grid size-12 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg';

  return (
    <m.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
      className="fixed inset-0 z-[75] flex flex-col bg-bg/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between">
        <span className="text-meta text-faint tabular-nums">
          <span className="text-ink">{index + 1}</span> / {n}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} className={navButton} aria-label="Close viewer">
          <Icon name="close" />
        </button>
      </div>
      <div className="relative grid min-h-0 flex-1 place-items-center px-4 sm:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <m.img
            key={shot.src}
            src={shot.src}
            srcSet={shot.srcSet}
            sizes="95vw"
            alt={shot.alt}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="max-h-full max-w-full rounded-xl border border-line object-contain shadow-lg"
          />
        </AnimatePresence>
      </div>
      <div className="shell flex shrink-0 items-center justify-between gap-6 py-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <button type="button" className={navButton} onClick={() => onIndex((index - 1 + n) % n)} aria-label="Previous screenshot">
          <Icon name="arrow-left" />
        </button>
        <p className="text-label line-clamp-2 max-w-2xl text-center text-muted">{shot.alt}</p>
        <button type="button" className={navButton} onClick={() => onIndex((index + 1) % n)} aria-label="Next screenshot">
          <Icon name="arrow-right" />
        </button>
      </div>
    </m.div>
  );
}

import { AnimatePresence, m } from 'framer-motion';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { useUI } from '../../providers/UIProvider';
import { Icon } from '../primitives/Icon';

export function Toasts() {
  const { toasts } = useUI();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--dock-space)+1rem)] z-[80] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="glass flex items-center gap-2.5 rounded-full py-2.5 pr-5 pl-3 text-sm text-ink shadow-lg"
          >
            <span className="grid size-6 place-items-center rounded-full bg-signal-soft text-signal">
              <Icon name="check" size={14} strokeWidth={2} />
            </span>
            {t.message}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

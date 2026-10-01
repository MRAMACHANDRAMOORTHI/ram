import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { sections } from '../../content/navigation';
import { channels, profile } from '../../content/profile';
import { projects } from '../../content/projects';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { lockScroll, scrollToSection, unlockScroll } from '../../lib/scroll';
import { cn, copyText } from '../../lib/utils';
import { useTheme } from '../../providers/ThemeProvider';
import { useUI } from '../../providers/UIProvider';
import { Icon, type IconName } from '../primitives/Icon';

interface Command {
  id: string;
  group: 'Go to' | 'Case studies' | 'Actions' | 'Elsewhere';
  label: string;
  hint?: string;
  icon: IconName;
  run: () => void;
}

const sectionIcons: Record<string, IconName> = {
  profile: 'user',
  work: 'grid',
  career: 'route',
  approach: 'flow',
  stack: 'layers',
  contact: 'mail',
};

/** Lazy-loaded; mounts after the first open and animates itself in and out. */
export default function CommandPaletteLayer() {
  const { paletteOpen } = useUI();
  // Lock while open; release the moment it closes so navigation isn't held up by the exit animation.
  useEffect(() => {
    if (!paletteOpen) return;
    lockScroll();
    return unlockScroll;
  }, [paletteOpen]);
  return <AnimatePresence>{paletteOpen && <CommandPalette key="palette" />}</AnimatePresence>;
}

function CommandPalette() {
  const { closePalette, openCase, notify } = useUI();
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        group: 'Go to' as const,
        label: s.label,
        hint: s.index,
        icon: sectionIcons[s.id],
        run: () => scrollToSection(s.id),
      })),
      { id: 'go-top', group: 'Go to', label: 'Back to top', icon: 'arrow-up', run: () => scrollToSection('top') },
      ...projects.map((p) => ({
        id: `case-${p.slug}`,
        group: 'Case studies' as const,
        label: p.title,
        hint: p.year,
        icon: 'expand' as IconName,
        run: () => openCase(p.slug),
      })),
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        icon: 'copy',
        run: () => {
          void copyText(profile.email).then((ok) => notify(ok ? 'Email address copied' : profile.email));
        },
      },
      {
        id: 'resume',
        group: 'Actions',
        label: 'Download résumé',
        hint: 'PDF',
        icon: 'download',
        run: () => {
          const a = document.createElement('a');
          a.href = profile.resume;
          a.download = '';
          a.click();
        },
      },
      {
        id: 'theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: theme === 'dark' ? 'sun' : 'moon',
        run: () => toggle(),
      },
      { id: 'email', group: 'Elsewhere', label: 'Write an email', hint: profile.email, icon: 'mail', run: () => (location.href = `mailto:${profile.email}`) },
      ...channels
        .filter((c) => c.external)
        .map((c) => ({
          id: `link-${c.id}`,
          group: 'Elsewhere' as const,
          label: c.label,
          hint: c.handle,
          icon: (c.id === 'whatsapp' ? 'chat' : c.id) as IconName,
          run: () => window.open(c.href, '_blank', 'noopener,noreferrer'),
        })),
    ],
    [openCase, notify, theme, toggle],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      // Only hand focus back if a command didn't already move it somewhere meaningful.
      const current = document.activeElement;
      const orphaned = !current || current === document.body;
      if (orphaned && previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const execute = (command: Command | undefined) => {
    if (!command) return;
    closePalette();
    // Let the dialog unmount (and release the scroll lock) before navigating.
    window.setTimeout(command.run, command.group === 'Go to' ? 60 : 0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      execute(results[cursor]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  let lastGroup = '';

  return (
    <m.div
      className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[12vh] sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" aria-label="Close command menu" tabIndex={-1} className="absolute inset-0 cursor-default bg-bg/60 backdrop-blur-sm" onClick={closePalette} />
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="glass relative w-full max-w-xl overflow-hidden rounded-3xl shadow-lg"
        initial={{ opacity: 0, y: reduced ? 0 : -16, scale: reduced ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.98 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Icon name="search" className="shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, case study or action…"
            className="h-16 w-full bg-transparent text-base text-ink outline-none placeholder:text-faint"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[cursor] ? `cmd-${results[cursor].id}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-faint sm:block">Esc</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" aria-label="Commands" className="no-scrollbar max-h-[min(60vh,28rem)] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <li className="px-4 py-10 text-center text-sm text-faint">No matches for “{query}”.</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header && <div className="text-meta px-3 pt-3 pb-1.5 text-faint">{c.group}</div>}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  data-index={i}
                  onPointerMove={() => setCursor(i)}
                  onClick={() => execute(c)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] transition-colors',
                    i === cursor ? 'bg-ink/8 text-ink' : 'text-muted',
                  )}
                >
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg border', i === cursor ? 'border-accent/40 text-accent' : 'border-line text-faint')}>
                    <Icon name={c.icon} size={16} />
                  </span>
                  <span className="flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="text-label truncate text-faint">{c.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="text-label flex items-center gap-4 border-t border-line px-5 py-3 text-faint">
          <span>
            <kbd className="font-mono">↑↓</kbd> move
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> select
          </span>
          <span className="ml-auto">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </m.div>
    </m.div>
  );
}

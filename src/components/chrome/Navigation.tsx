import { m, useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { profile } from '../../content/profile';
import { sectionIds, sections, sectionTone } from '../../content/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { scrollToSection } from '../../lib/scroll';
import { toneStyle, toneText } from '../../lib/tones';
import { cn, isMac } from '../../lib/utils';
import { useUI } from '../../providers/UIProvider';
import { Button } from '../primitives/Button';
import { Icon, type IconName } from '../primitives/Icon';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const dockIcons: Record<string, IconName> = {
  profile: 'user',
  work: 'grid',
  career: 'route',
  approach: 'flow',
  stack: 'layers',
  contact: 'mail',
};

function go(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToSection(id);
}

export function Navigation({ sectionsReady }: { sectionsReady: boolean }) {
  const active = useActiveSection(sectionIds, sectionsReady);
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  return (
    <>
      <DesktopNav active={active} scrolled={scrolled} progress={scrollYProgress} />
      <MobileBar scrolled={scrolled} progress={scrollYProgress} />
      <Dock active={active} />
    </>
  );
}

type Progress = ReturnType<typeof useScroll>['scrollYProgress'];

function DesktopNav({ active, scrolled, progress }: { active: string | null; scrolled: boolean; progress: Progress }) {
  const { openPalette } = useUI();
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const link = active ? list?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    setIndicator(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
  }, [active]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden lg:block">
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--nav-h)+2.5rem)] bg-gradient-to-b from-bg from-55% to-transparent transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="shell relative flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Logo />
        <nav
          aria-label="Sections"
          style={toneStyle(active ? sectionTone(active) : 'systems')}
          className={cn(
            'relative rounded-full border p-1 transition-[background-color,border-color,box-shadow] duration-500',
            scrolled ? 'glass shadow-md' : 'border-transparent',
          )}
        >
          <ul ref={listRef} className="relative flex items-center">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 rounded-full bg-[color-mix(in_oklab,var(--tone)_16%,transparent)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tone)_28%,transparent)] transition-[transform,width,opacity,background-color] duration-500 ease-out-expo"
              style={{
                transform: `translateX(${indicator?.x ?? 0}px)`,
                width: indicator?.w ?? 0,
                opacity: indicator ? 1 : 0,
              }}
            />
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-id={s.id}
                  onClick={(e) => go(e, s.id)}
                  aria-current={active === s.id ? 'location' : undefined}
                  className="relative z-10 block rounded-full px-4 py-2 text-[0.875rem] text-muted transition-colors duration-300 hover:text-ink aria-[current]:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <m.span
            aria-hidden="true"
            className="absolute inset-x-5 -bottom-px h-px origin-left bg-accent"
            style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
          />
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="text-label flex h-10 items-center gap-2 rounded-full px-3 text-muted transition-colors hover:bg-ink/6 hover:text-ink"
            aria-label="Open command menu"
            aria-keyshortcuts={isMac() ? 'Meta+K' : 'Control+K'}
          >
            <Icon name="search" size={16} />
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-faint">
              {isMac() ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>
          <ThemeToggle />
          <Button href={profile.resume} variant="secondary" size="sm" icon="download" download className="ml-1.5">
            Résumé
          </Button>
        </div>
      </div>
    </header>
  );
}

function MobileBar({ scrolled, progress }: { scrolled: boolean; progress: Progress }) {
  const { openPalette } = useUI();
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 lg:hidden',
        scrolled ? 'glass border-x-0 border-t-0' : 'border-b border-transparent',
      )}
    >
      <div className="flex h-[var(--nav-h)] items-center justify-between px-[var(--gutter)]">
        <Logo showName={false} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open menu"
            className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <Icon name="menu" size={20} />
          </button>
          <ThemeToggle className="size-11" />
        </div>
      </div>
      <m.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ scaleX: progress }}
      />
    </header>
  );
}

function Dock({ active }: { active: string | null }) {
  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.625rem)] lg:hidden"
    >
      <ul className="glass pointer-events-auto mx-auto flex max-w-[28rem] rounded-[1.375rem] p-1.5 shadow-lg">
        {sections.map((s) => {
          const current = active === s.id;
          return (
            <li key={s.id} className="flex-1">
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[0.625rem] font-medium tracking-wide transition-colors duration-300',
                  current ? 'bg-ink/8 text-ink' : 'text-faint',
                )}
              >
                <Icon name={dockIcons[s.id]} size={19} className={cn('transition-colors', current && toneText[s.tone])} />
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

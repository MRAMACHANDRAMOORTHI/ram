import { AnimatePresence, m, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { roles } from '../../../content/experience';
import { projectBySlug } from '../../../content/projects';
import type { Role } from '../../../content/types';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { scrollToElement } from '../../../lib/scroll';
import { cn, formatMonth, formatSpan } from '../../../lib/utils';
import { useUI } from '../../../providers/UIProvider';
import { Chip } from '../../primitives/Chip';
import { Counter } from '../../primitives/Counter';
import { Icon } from '../../primitives/Icon';
import { Reveal } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';

export function Career() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.6', 'end 0.6'] });

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-role-index]');
    if (!items?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.roleIndex));
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToRole = (i: number) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-role-index="${i}"]`);
    if (el) scrollToElement(el);
  };

  return (
    <section id="career" aria-labelledby="career-title" className="section-pad relative border-t border-line">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Career"
          id="career-title"
          title={'Three teams.\nOne *through-line.*'}
          intro="From Spring Boot APIs to a classical-Tamil learning platform to a Phoenix-powered support system — each role pushed further into workflows, data and reliability."
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block" aria-hidden="true">
            <StickyPanel active={active} progress={scrollYProgress} onSelect={scrollToRole} />
          </aside>

          <ol ref={listRef} className="relative lg:col-span-8 lg:pl-10">
            {/* Mobile rail */}
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line lg:hidden" />
            <m.span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent lg:hidden"
              style={{ scaleY: scrollYProgress }}
            />
            {roles.map((role, i) => (
              <RoleEntry key={role.id} role={role} index={i} active={active === i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StickyPanel({
  active,
  progress,
  onSelect,
}: {
  active: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  onSelect: (i: number) => void;
}) {
  const reduced = useReducedMotion();
  const role = roles[active];
  return (
    <div className="sticky top-[calc(var(--nav-h)+3rem)]">
      <p className="text-meta text-faint">Now reading</p>
      <div className="relative mt-4 h-[clamp(3.75rem,2.6rem+3vw,5.75rem)] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.p
            key={role.id}
            initial={{ y: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: reduced ? 0 : '-100%', opacity: reduced ? 0 : 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="absolute inset-0 text-[clamp(3.25rem,2.2rem+3vw,5.25rem)] leading-none font-medium tracking-[-0.05em] whitespace-nowrap"
          >
            {role.companyShort}
            <span className="text-accent">.</span>
          </m.p>
        </AnimatePresence>
      </div>
      <p className="text-meta mt-4 text-muted">
        {formatMonth(role.start)} — {formatMonth(role.end)}
        <span className="text-faint"> · {formatSpan(role.start, role.end)}</span>
      </p>

      <ol className="relative mt-12">
        <span className="absolute top-0 bottom-0 left-[5px] w-px bg-line" />
        <m.span className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-accent" style={{ scaleY: progress }} />
        {roles.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(i)}
              className="group relative flex w-full items-start gap-5 py-4 text-left"
            >
              <span
                className={cn(
                  'relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full border transition-[background-color,border-color,scale] duration-500',
                  i === active ? 'scale-125 border-accent bg-accent' : 'border-line-strong bg-bg',
                )}
              />
              <span>
                <span
                  className={cn(
                    'block text-[0.9375rem] transition-colors duration-300',
                    i === active ? 'text-ink' : 'text-muted group-hover:text-ink',
                  )}
                >
                  {r.companyShort} · {r.title}
                </span>
                <span className="text-meta mt-1 block text-faint">
                  {formatMonth(r.start)} — {formatMonth(r.end)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RoleEntry({ role, index, active }: { role: Role; index: number; active: boolean }) {
  const { openCase } = useUI();
  const project = role.project ? projectBySlug(role.project) : undefined;

  return (
    <li data-role-index={index} className="relative pb-16 pl-8 last:pb-0 lg:pb-24 lg:pl-0">
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-2 left-0 size-[11px] rounded-full border transition-colors duration-500 lg:hidden',
          active ? 'border-accent bg-accent' : 'border-line-strong bg-bg',
        )}
      />
      <Reveal>
        <article className={cn('transition-opacity duration-700 lg:opacity-45', active && 'lg:opacity-100')}>
          <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-white p-1.5">
                <img src={role.logo} alt="" width={56} height={56} loading="lazy" className="size-full object-contain" />
              </span>
              <div>
                <h3 className="text-heading">{role.title}</h3>
                <p className="mt-1 text-[0.9375rem]">
                  {role.url ? (
                    <a href={role.url} target="_blank" rel="noopener noreferrer" className="link-sweep inline-flex items-center gap-1 text-ink">
                      {role.company}
                      <Icon name="arrow-up-right" size={13} />
                    </a>
                  ) : (
                    <span className="text-ink">{role.company}</span>
                  )}
                </p>
                {(role.kind || role.location) && (
                  <p className="text-meta mt-1.5 text-faint">{[role.kind, role.location].filter(Boolean).join(' · ')}</p>
                )}
              </div>
            </div>
            <p className="text-meta text-faint sm:text-right">
              {formatMonth(role.start)} — {formatMonth(role.end)}
              <span className="mt-1 block text-muted normal-case">
                {formatSpan(role.start, role.end)}
                {!role.end && (
                  <span className="ml-2 inline-flex items-center gap-1.5 text-signal">
                    <span className="status-dot" /> current
                  </span>
                )}
              </span>
            </p>
          </header>

          <p className="text-lead mt-8 max-w-2xl text-pretty">{role.summary}</p>

          {role.impact && (
            <div className="mt-8 flex flex-wrap gap-10">
              {role.impact.map((i) => (
                <p key={i.label}>
                  <Counter
                    value={i.value}
                    suffix={i.suffix}
                    className="block text-[clamp(3rem,2rem+3vw,4.5rem)] leading-none font-medium tracking-[-0.05em] text-accent"
                  />
                  <span className="text-meta mt-2 block text-faint">{i.label}</span>
                </p>
              ))}
            </div>
          )}

          <ul className="mt-8 max-w-2xl">
            {role.highlights.map((h) => (
              <li key={h} className="flex gap-4 border-t border-line py-3.5 text-[0.9375rem] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {role.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          {project && (
            <button
              type="button"
              onClick={(e) => openCase(project.slug, e.currentTarget.getBoundingClientRect())}
              className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem] text-ink"
              aria-haspopup="dialog"
            >
              <span className="link-sweep pb-0.5">Read the {project.title} case study</span>
              <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                <Icon name="arrow-right" size={14} />
              </span>
            </button>
          )}
        </article>
      </Reveal>
    </li>
  );
}

import { m } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { projectBySlug } from '../../../content/projects';
import { connectedTech, contextLabels, stack, stackGroups, techById, toolkit } from '../../../content/stack';
import type { ContextId } from '../../../content/types';
import { useConnectors } from '../../../hooks/useConnectors';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { scrollToSection } from '../../../lib/scroll';
import { cn } from '../../../lib/utils';
import { useUI } from '../../../providers/UIProvider';
import { Icon } from '../../primitives/Icon';
import { Reveal } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';

export function Stack() {
  const [active, setActive] = useState('elixir');
  const mapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const connected = useMemo(() => connectedTech(active), [active]);
  const pairs = useMemo(() => [...connected].map((id) => [active, id] as const), [active, connected]);
  const { paths } = useConnectors(mapRef, pairs, 'centers');
  const tech = techById(active)!;

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-pad relative border-t border-line">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Stack"
          id="stack-title"
          title={'Every tool, tied to\n*real work.*'}
          intro="Pick a technology to see what it ran alongside and where. The connections come from shipped projects — not a wish list."
        />

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-8">
            <div ref={mapRef} className="relative">
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden size-full overflow-visible sm:block">
                {paths.map((p) => (
                  <m.path
                    key={p.key}
                    d={p.d}
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={1}
                    initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OUT_EXPO }}
                  />
                ))}
              </svg>
              <div className="relative grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {stackGroups.map((group) => (
                  <div key={group}>
                    <h3 className="text-meta flex items-center gap-3 text-faint">
                      {group}
                      <span className="h-px flex-1 bg-line" aria-hidden="true" />
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {stack
                        .filter((t) => t.group === group)
                        .map((t) => {
                          const isActive = t.id === active;
                          const isLinked = connected.has(t.id);
                          return (
                            <li key={t.id}>
                              <button
                                type="button"
                                data-node={t.id}
                                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(t.id)}
                                onFocus={() => setActive(t.id)}
                                onClick={() => setActive(t.id)}
                                aria-pressed={isActive}
                                className={cn(
                                  'relative z-10 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-[background-color,border-color,color] duration-300',
                                  isActive && 'border-accent bg-accent text-accent-ink',
                                  !isActive && isLinked && 'border-accent/50 bg-bg text-ink',
                                  !isActive && !isLinked && 'border-line bg-bg text-muted hover:border-line-strong hover:text-ink',
                                )}
                              >
                                {t.name}
                                {t.core && (
                                  <>
                                    <span
                                      aria-hidden="true"
                                      className={cn('size-1.5 rounded-full', isActive ? 'bg-accent-ink' : 'bg-accent')}
                                    />
                                    <span className="sr-only">(core)</span>
                                  </>
                                )}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-label mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-faint">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-accent" /> core stack
              </span>
              <span aria-hidden="true">·</span>
              <span>Also in the toolkit: {toolkit.join(', ')}</span>
            </p>
          </Reveal>

          <aside className="order-1 lg:order-2 lg:col-span-4">
            <div className="rounded-3xl border border-line bg-bg-raised p-6 sm:p-8 lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <div aria-live="polite">
                <p className="text-meta text-faint">
                  {tech.group}
                  {tech.core && <span className="text-accent"> · core</span>}
                </p>
                <h3 className="text-heading mt-3">{tech.name}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{tech.note}</p>
              </div>

              <h4 className="text-meta mt-8 text-faint">Where</h4>
              {tech.usedIn.length ? (
                <ul className="mt-3 border-t border-line">
                  {tech.usedIn.map((c) => (
                    <ContextLink key={c} context={c} />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink">Every project on this page.</p>
              )}

              {connected.size > 0 && (
                <>
                  <h4 className="text-meta mt-8 text-faint">Ran alongside</h4>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    {[...connected].map((id) => techById(id)?.name).join(' · ')}
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ContextLink({ context }: { context: ContextId }) {
  const { openCase } = useUI();
  const info = contextLabels[context];
  const project = info.kind === 'project' ? projectBySlug(context) : undefined;
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={(e) => (project ? openCase(project.slug, e.currentTarget.getBoundingClientRect()) : scrollToSection('career'))}
        className="group flex w-full items-center justify-between gap-4 py-3 text-left text-sm text-ink"
        aria-haspopup={project ? 'dialog' : undefined}
      >
        {info.label}
        <Icon
          name={project ? 'arrow-up-right' : 'arrow-down'}
          size={14}
          className="text-faint transition-[color,translate] duration-500 group-hover:text-accent"
        />
      </button>
    </li>
  );
}

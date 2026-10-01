import { lazy, Suspense, useEffect, type PointerEvent } from 'react';
import { concerns, type Concern } from '../../../content/approach';
import { contextLabels } from '../../../content/stack';
import { scrollToSection } from '../../../lib/scroll';
import { useUI } from '../../../providers/UIProvider';
import { Icon } from '../../primitives/Icon';
import { Reveal, RevealGroup, RevealItem } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';
import { loadSimulator } from './loadSimulator';

const LifecycleSimulator = lazy(loadSimulator);

export function Approach() {
  // Warm the simulator chunk while the visitor is still reading the top of the page.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => void loadSimulator());
  }, []);

  return (
    <section id="approach" aria-labelledby="approach-title" className="section-pad relative border-t border-line">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Approach"
          id="approach-title"
          title={'Workflows first,\n*screens second.*'}
          intro="Most of what I build is a process with rules — who owns this, how long can it wait, what happens when it does. Below is a working model of the Helpdesk ticket lifecycle, then the concerns I handle day to day."
        />

        <Reveal className="mt-16 lg:mt-24" y={40}>
          <Suspense
            fallback={
              // Matches the rendered simulator per breakpoint so nothing below it shifts when it loads.
              <div className="h-[86rem] animate-pulse rounded-[1.75rem] border border-line bg-bg-raised md:h-[77rem] lg:h-[62rem] xl:h-[57rem]" />
            }
          >
            <LifecycleSimulator />
          </Suspense>
          <p className="text-label mt-4 max-w-3xl text-faint">
            Interactive model — a simplified, in-browser illustration of the Helpdesk workflow I built at Ardhika.
            Tickets, executives and timings are simulated; this is not production code or data. Try switching a
            background job off and watch what happens to the queue.
          </p>
        </Reveal>

        <div className="mt-24 flex items-end justify-between gap-6 lg:mt-32">
          <h3 className="text-heading max-w-xl">The engineering notebook</h3>
          <p className="text-label hidden text-faint sm:block">Each entry links to where it happened</p>
        </div>

        <RevealGroup
          className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4"
          step={0.06}
        >
          {concerns.map((c, i) => (
            <RevealItem key={c.id} className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
              <ConcernCard concern={c} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ConcernCard({ concern, index }: { concern: Concern; index: number }) {
  const { openCase } = useUI();
  const isProject = contextLabels[concern.where].kind === 'project';

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <article
      onPointerMove={onMove}
      className="spotlight flex h-full min-h-[17rem] flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised p-6 transition-colors duration-500 hover:border-line-strong"
    >
      <div className="text-meta flex items-center justify-between text-faint">
        <span className="text-accent">{concern.label}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h4 className="text-subheading mt-10 text-balance">{concern.title}</h4>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{concern.body}</p>
      <button
        type="button"
        onClick={(e) =>
          isProject ? openCase(concern.where, e.currentTarget.closest('article')?.getBoundingClientRect()) : scrollToSection('career')
        }
        className="text-label group mt-6 inline-flex items-center gap-2 self-start text-ink"
        aria-haspopup={isProject ? 'dialog' : undefined}
      >
        <span className="link-sweep pb-0.5">{concern.whereLabel}</span>
        <Icon
          name={isProject ? 'arrow-up-right' : 'arrow-down'}
          size={14}
          className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </article>
  );
}

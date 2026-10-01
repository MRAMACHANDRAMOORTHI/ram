import { AnimatePresence, m, useScroll } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { projectBySlug, projects } from '../../../content/projects';
import type { ContextId, Project } from '../../../content/types';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from '../../../lib/motion';
import { lockScroll, unlockScroll } from '../../../lib/scroll';
import { keepHyphens } from '../../../lib/utils';
import { useUI } from '../../../providers/UIProvider';
import { Icon } from '../../primitives/Icon';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { Lightbox } from './Lightbox';
import { ProjectLinks } from './ProjectLinks';

/** Lazy-loaded layer: mounts once, then animates case studies in and out. */
export default function CaseStudyLayer() {
  const { caseSlug, caseOrigin, closeCase, switchCase } = useUI();
  const project = caseSlug ? projectBySlug(caseSlug) : undefined;
  return (
    <AnimatePresence>
      {project && (
        <CaseStudy key="case-study" project={project} origin={caseOrigin} onClose={closeCase} onSwitch={switchCase} />
      )}
    </AnimatePresence>
  );
}

interface CaseStudyProps {
  project: Project;
  origin: DOMRect | null;
  onClose: () => void;
  onSwitch: (slug: ContextId) => void;
}

function CaseStudy({ project, origin, onClose, onSwitch }: CaseStudyProps) {
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  useFocusTrap(dialogRef);

  useEffect(() => {
    lockScroll();
    return unlockScroll;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
    setLightbox(null);
  }, [project.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox === null) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox, onClose]);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const from = origin
    ? `inset(${origin.top}px ${vw - origin.right}px ${vh - origin.bottom}px ${origin.left}px round 18px)`
    : `inset(${vh * 0.12}px ${vw * 0.1}px ${vh * 0.12}px ${vw * 0.1}px round 28px)`;

  const blocks: Array<{ label: string; content: ReactNode }> = [
    { label: 'Problem', content: <p className="text-heading text-pretty">{project.problem}</p> },
    {
      label: 'Approach',
      content: (
        <>
          <p className="text-lead text-pretty text-muted">{project.solution}</p>
          <h3 className="text-meta mt-10 text-faint">What it does</h3>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {project.capabilities.map((c) => (
              <li key={c} className="flex gap-3 border-b border-line py-3.5 text-[0.9375rem] leading-snug">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-signal" />
                {c}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      label: 'My role',
      content: (
        <>
          <p className="text-meta text-faint">{project.role}</p>
          <ol className="mt-4">
            {project.contribution.map((c, i) => (
              <li key={c} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4 text-lead">
                <span className="text-meta pt-1.5 text-accent">0{i + 1}</span>
                {c}
              </li>
            ))}
          </ol>
        </>
      ),
    },
    { label: 'Architecture', content: <ArchitectureDiagram spec={project.architecture} /> },
    {
      label: 'Key decisions',
      content: (
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {project.decisions.map((d, i) => (
            <div key={d.title} className="bg-bg-raised p-6 sm:p-8">
              <span className="text-meta text-faint">Decision 0{i + 1}</span>
              <h3 className="text-subheading mt-4">{d.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{d.body}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  if (project.outcome) {
    const { metric, label, body } = project.outcome;
    blocks.push({
      label: 'Outcome',
      content: (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
          {metric && (
            <p className="shrink-0">
              <span className="block text-[clamp(4rem,2.5rem+6vw,7.5rem)] leading-[0.85] font-medium tracking-[-0.05em] text-accent">
                {metric}
              </span>
              <span className="text-meta mt-3 block text-faint">{label}</span>
            </p>
          )}
          <p className="text-heading max-w-2xl text-pretty">{body}</p>
        </div>
      ),
    });
  }

  blocks.push({
    label: 'Screens',
    content: (
      <ul className="grid gap-4 sm:grid-cols-2">
        {project.gallery.map((shot, i) => (
          <li key={shot.src} className={i === 0 ? 'sm:col-span-2' : undefined}>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              data-cursor="Expand"
              className="group block w-full overflow-hidden rounded-2xl border border-line bg-surface"
              aria-label={`Expand screenshot: ${shot.alt}`}
            >
              <img
                src={shot.src}
                srcSet={shot.srcSet}
                sizes={i === 0 ? '(min-width: 1024px) 70vw, 100vw' : '(min-width: 640px) 35vw, 100vw'}
                width={shot.width}
                height={shot.height}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
    ),
  });

  return (
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      className="fixed inset-0 z-[70] bg-bg"
      initial={reduced ? { opacity: 0 } : { clipPath: from }}
      animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0px 0px 0px 0px round 0px)' }}
      exit={reduced ? { opacity: 0 } : { clipPath: `inset(${vh}px 0px 0px 0px round 0px)` }}
      transition={{ duration: reduced ? 0.2 : 0.9, ease: EASE_IN_OUT_QUART }}
    >
      <div
        ref={scrollRef}
        data-lenis-prevent
        inert={lightbox !== null}
        className="h-full overflow-y-auto overscroll-contain"
      >
        <div className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur-xl">
          <div className="shell flex h-16 items-center justify-between gap-4">
            <span className="text-meta text-faint tabular-nums">
              Case study <span className="text-ink">{String(index + 1).padStart(2, '0')}</span> / 0{projects.length}
            </span>
            <span className="hidden truncate text-sm text-muted md:block">{project.title}</span>
            <button
              type="button"
              onClick={onClose}
              className="text-meta flex h-10 items-center gap-2 rounded-full border border-line-strong pr-2 pl-4 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
              aria-label="Close case study"
            >
              <span className="hidden sm:inline">Close</span>
              <kbd className="hidden rounded border border-current/30 px-1 font-mono text-[0.625rem] opacity-70 sm:inline">Esc</kbd>
              <span className="grid size-7 place-items-center">
                <Icon name="close" size={16} />
              </span>
            </button>
          </div>
          <m.span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </div>

        <m.article
          key={project.slug}
          initial={{ opacity: 0, y: reduced ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: origin && !reduced ? 0.4 : 0.1 }}
          className="shell pb-[calc(var(--dock-space)+6rem)]"
        >
          <header className="pt-14 lg:pt-24">
            <p className="text-meta text-faint">
              <span className="text-accent">{project.category}</span> · {project.year}
            </p>
            <h1 id="case-title" ref={titleRef} tabIndex={-1} className="text-display mt-6 max-w-[16ch] text-balance outline-none">
              {keepHyphens(project.title)}
            </h1>
            <p className="text-lead mt-8 max-w-3xl text-pretty text-muted">{project.tagline}</p>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:grid-cols-4">
              {[
                ['Role', project.role],
                ['Context', project.context],
                ['Year', project.year],
                ['Stack', project.stack.join(', ')],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-meta text-faint">{k}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <ProjectLinks links={project.links} />
            </div>
          </header>

          <figure className="mt-14 overflow-hidden rounded-3xl border border-line bg-surface shadow-lg lg:mt-20">
            <img
              src={project.cover.src}
              srcSet={project.cover.srcSet}
              sizes="(min-width: 1360px) 1300px, 100vw"
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              decoding="async"
              className="max-h-[78vh] w-full object-cover object-top"
            />
          </figure>

          <div className="mt-24 space-y-24 lg:mt-32 lg:space-y-32">
            {blocks.map((b, i) => (
              <section key={b.label} aria-labelledby={`case-${i}`} className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                <h2 id={`case-${i}`} className="text-meta text-faint lg:col-span-3">
                  <span className="lg:sticky lg:top-24">
                    <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> {b.label}
                  </span>
                </h2>
                <div className="min-w-0 lg:col-span-9">{b.content}</div>
              </section>
            ))}
          </div>

          <div className="mt-32 border-t border-line pt-10">
            <p className="text-meta text-faint">Next case study</p>
            <button
              type="button"
              onClick={() => onSwitch(next.slug)}
              data-cursor="Next"
              className="group mt-6 flex w-full items-center justify-between gap-6 text-left"
            >
              <span className="text-title transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                {keepHyphens(next.title)}
              </span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-strong transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                <Icon name="arrow-right" />
              </span>
            </button>
          </div>
        </m.article>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox shots={project.gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </m.div>
  );
}

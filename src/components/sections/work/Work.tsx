import { m, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useState } from 'react';
import { channels } from '../../../content/profile';
import { projects } from '../../../content/projects';
import type { Project } from '../../../content/types';
import { useDesktop, useFinePointer, useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { cn, keepHyphens } from '../../../lib/utils';
import { useUI } from '../../../providers/UIProvider';
import { Icon } from '../../primitives/Icon';
import { Reveal, RevealGroup, RevealItem } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';

const github = channels.find((c) => c.id === 'github')!;

export function Work() {
  const { openCase } = useUI();
  const desktop = useDesktop();
  const fine = useFinePointer();
  const showPreview = desktop && fine;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="work" aria-labelledby="work-title" className="section-pad relative">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Selected work"
          id="work-title"
          title={'Production software,\n*end to end.*'}
          intro="Four builds across EdTech, healthcare and education — SLA engines, analytics, real-time learning and smart contracts. Open any of them for the full case study."
        />

        <RevealGroup as="ol" className="mt-16 border-t border-line lg:mt-24" step={0.1}>
          {projects.map((p, i) => (
            <RevealItem as="li" key={p.slug}>
              <ProjectRow
                project={p}
                index={i}
                dimmed={hovered !== null && hovered !== i}
                onHover={() => setHovered(i)}
                onLeave={() => setHovered(null)}
                onOpen={(rect) => openCase(p.slug, rect)}
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">Smaller experiments and coursework live on GitHub.</p>
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-sweep inline-flex items-center gap-2 pb-0.5 text-sm text-ink"
          >
            <Icon name="github" size={16} /> {github.handle}
            <Icon name="arrow-up-right" size={14} />
          </a>
        </Reveal>
      </div>
      {showPreview && <HoverPreview active={hovered} />}
    </section>
  );
}

interface RowProps {
  project: Project;
  index: number;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpen: (rect: DOMRect) => void;
}

function ProjectRow({ project, index, dimmed, onHover, onLeave, onOpen }: RowProps) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      data-cursor="Open"
      aria-haspopup="dialog"
      aria-label={`${project.title} — open case study`}
      className={cn(
        'group relative block w-full border-b border-line py-8 text-left transition-opacity duration-500 lg:grid lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-11',
        dimmed && 'lg:opacity-35',
      )}
    >
      {/* Touch / small screens: inline cover */}
      <span className="mb-6 block overflow-hidden rounded-2xl border border-line bg-surface lg:hidden">
        <img
          src={project.cover.src}
          srcSet={project.cover.srcSet}
          sizes="(min-width: 768px) 90vw, 100vw"
          width={project.cover.width}
          height={project.cover.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover object-top"
        />
      </span>

      <span className="text-meta flex items-center justify-between text-faint lg:col-span-1 lg:block">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="lg:hidden">
          {project.year} · {project.category}
        </span>
      </span>

      <span className="mt-3 block lg:col-span-6 lg:mt-0">
        <span className="block text-[clamp(2rem,1.2rem+3.2vw,4.25rem)] leading-[0.95] font-medium tracking-[-0.045em] transition-transform duration-700 ease-out-expo lg:group-hover:translate-x-4 lg:group-focus-visible:translate-x-4">
          {keepHyphens(project.title)}
        </span>
        <span className="mt-4 block max-w-xl text-[0.9375rem] leading-relaxed text-muted">{project.tagline}</span>
      </span>

      <span className="text-label mt-5 hidden text-muted lg:col-span-3 lg:mt-0 lg:block">
        <span className="block text-ink">{project.category}</span>
        <span className="mt-1 block">{project.context}</span>
        <span className="mt-3 block text-faint">{project.stack.slice(0, 4).join(' · ')}</span>
      </span>

      <span className="text-meta hidden text-faint lg:col-span-1 lg:block">{project.year}</span>

      <span className="mt-6 flex items-center justify-between lg:col-span-1 lg:mt-0 lg:justify-end">
        <span className="text-label text-faint lg:hidden">{project.stack.slice(0, 3).join(' · ')}</span>
        <span className="grid size-12 place-items-center rounded-full border border-line-strong text-ink transition-[background-color,color,border-color,rotate] duration-500 ease-out-expo group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
          <Icon name="arrow-right" />
        </span>
      </span>
    </button>
  );
}

/** Cursor-following preview that slides between project covers and leans into motion. */
function HoverPreview({ active }: { active: number | null }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const spring = { stiffness: 180, damping: 24, mass: 0.6 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const velocity = useVelocity(sx);
  const rotate = useTransform(velocity, [-2400, 0, 2400], reduced ? [0, 0, 0] : [-9, 0, 9], { clamp: true });
  const n = projects.length;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40"
      style={{ x: sx, y: sy, rotate }}
    >
      <m.div
        className="aspect-[16/10] w-[min(30vw,27rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-lg"
        initial={false}
        animate={{ scale: active !== null ? 1 : 0.4, opacity: active !== null ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
      >
        <m.div
          className="flex h-full flex-col"
          initial={false}
          animate={{ y: `${-((active ?? 0) * 100) / n}%` }}
          transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT_EXPO }}
          style={{ height: `${n * 100}%` }}
        >
          {projects.map((p) => (
            <img
              key={p.slug}
              src={p.cover.srcSet.split(' ')[0]}
              alt=""
              decoding="async"
              className="w-full flex-1 object-cover object-top"
              style={{ height: `${100 / n}%` }}
            />
          ))}
        </m.div>
      </m.div>
    </m.div>
  );
}

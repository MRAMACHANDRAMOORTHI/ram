import { m, useScroll, useTransform } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import headUrl from '../../../assets/head.webp';
import { profile } from '../../../content/profile';
import type { Tone } from '../../../content/types';
import { useBootReady } from '../../../hooks/useBootReady';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { markBoot } from '../../../lib/boot';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { scrollToSection } from '../../../lib/scroll';
import { toneText } from '../../../lib/tones';
import { cn } from '../../../lib/utils';
import { Button } from '../../primitives/Button';
import { ErrorBoundary } from '../../primitives/ErrorBoundary';
import { SplitReveal } from '../../primitives/SplitReveal';
import { HeadPoster } from './bobble/HeadPoster';

const BobbleStage = lazy(() => import('./bobble/BobbleStage'));

/** A keyword in its domain tone — the same colours the rest of the site uses. */
function Key({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={cn('font-medium', toneText[tone])}>{children}</span>;
}


export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useBootReady();
  const reduced = useReducedMotion();
  const [load3d, setLoad3d] = useState(false);
  const [live3d, setLive3d] = useState(false);

  // The loader waits for the face (preloaded), never for WebGL.
  useEffect(() => {
    const img = new Image();
    img.src = headUrl;
    img
      .decode()
      .catch(() => undefined)
      .then(() => markBoot('scene'));
  }, []);

  // Fetch the 3D chunk once the first screen has painted and the main thread is idle.
  useEffect(() => {
    if (!ready || load3d) return;
    const schedule = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => setLoad3d(true), { timeout: 1200 });
    return () => cancel(id);
  }, [ready, load3d]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const stageOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, reduced ? 1 : 0]);

  const enter = (delay: number, fade = true) => ({
    initial: { opacity: fade ? 0 : 1, y: reduced ? 0 : 16 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_OUT_EXPO, delay: reduced ? 0 : delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Neon night: pools of the domain colours, static (no repaint cost). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            'radial-gradient(36% 46% at 70% 42%, color-mix(in oklab, var(--systems) var(--tone-glow-strength), transparent), transparent 72%)',
            'radial-gradient(30% 36% at 92% 78%, color-mix(in oklab, var(--interface) var(--tone-glow-strength), transparent), transparent 72%)',
            'radial-gradient(30% 34% at 48% 96%, color-mix(in oklab, var(--human) var(--tone-glow-strength), transparent), transparent 72%)',
            'radial-gradient(26% 30% at 4% 8%, color-mix(in oklab, var(--human) var(--tone-glow-strength), transparent), transparent 72%)',
          ].join(','),
        }}
      />
      {/* A perspective floor grid under the desk. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38%] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{
          background:
            'linear-gradient(transparent 0 calc(100% - 1px), color-mix(in oklab, var(--systems) 50%, transparent) 0) 0 0 / 100% 2.6rem, linear-gradient(90deg, transparent 0 calc(100% - 1px), color-mix(in oklab, var(--interface) 40%, transparent) 0) 0 0 / 4rem 100%',
          transform: 'perspective(500px) rotateX(58deg)',
          transformOrigin: 'bottom',
        }}
      />

      <div className="shell relative grid flex-1 grid-cols-1 items-center gap-y-2 lg:grid-cols-12 lg:gap-x-6">
        {/* The 3D me */}
        <m.div
          style={{ y: stageY, opacity: stageOpacity }}
          className="relative order-1 -mx-[var(--gutter)] h-[min(118vw,540px)] sm:h-[min(88vw,640px)] lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[min(calc(100svh-var(--nav-h)-2rem),800px)]"
        >
          <m.div
            className="relative size-full"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            {/* One poster for the whole load: it fades out once the first 3D frame lands. */}
            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 top-0 bottom-12 transition-opacity duration-700',
                live3d ? 'opacity-0' : 'opacity-100',
              )}
            >
              <HeadPoster />
            </div>
            {load3d && (
              // If the 3D scene ever fails, the poster above simply stays.
              <ErrorBoundary fallback={null} onError={() => setLive3d(false)}>
                <Suspense fallback={null}>
                  <BobbleStage ready={ready} onLive={() => setLive3d(true)} />
                </Suspense>
              </ErrorBoundary>
            )}
          </m.div>
        </m.div>

        <m.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 order-2 min-w-0 pb-12 lg:order-1 lg:col-span-5 lg:py-16">
          {/* 1 · Identity */}
          <m.div {...enter(0)}>
            <p className="flex items-center gap-3 text-[clamp(1.125rem,0.95rem+0.7vw,1.5rem)] font-medium tracking-[-0.02em] text-ink">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-human via-systems to-interface" />
              {profile.name}
            </p>
            <p className="text-meta mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-11 text-muted">
              <span className="status-dot" aria-hidden="true" />
              <span>{profile.role}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.company}</span>
            </p>
          </m.div>

          {/* 2 · Engineering statement */}
          <SplitReveal
            as="h1"
            id="hero-title"
            text={'I build systems\nthat keep *running.*'}
            play={ready}
            delay={0.12}
            stagger={0.08}
            className="mt-8 text-[clamp(2.9rem,1.2rem+5vw,4.4rem)] leading-[0.94] font-medium tracking-[-0.052em] outline-none lg:text-[min(5.15vw,4.6rem)] [&_.serif-em]:text-tone-gradient [&_.serif-em]:pr-[0.08em]"
          />
          <m.p {...enter(0.55)} className="serif-em mt-3 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] text-muted">
            (Even on Fridays. Mostly.)
          </m.p>

          {/* 3 · Supporting context */}
          <m.p {...enter(0.4, false)} className="text-lead mt-6 max-w-[33rem] text-muted">
            Platforms for higher education at Ardhika — a multi-tenant LMS, an accreditation ERP and a support desk —
            built on <Key tone="systems">Elixir and Phoenix</Key>, with <Key tone="interface">Vue and React</Key> in
            front and <Key tone="data">PostgreSQL</Key> underneath.
          </m.p>

          {/* 4 · Action */}
          <m.div {...enter(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              href="#work"
              icon="arrow-down"
              size="lg"
              magnetic
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('work');
              }}
            >
              See the work
            </Button>
            <Button href={profile.resume} variant="secondary" size="lg" icon="download" download>
              Résumé
            </Button>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

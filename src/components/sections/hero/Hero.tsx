import { m, useScroll, useTransform } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import personUrl from '../../../assets/person.webp';
import { profile } from '../../../content/profile';
import { useBootReady } from '../../../hooks/useBootReady';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { markBoot } from '../../../lib/boot';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { scrollToSection } from '../../../lib/scroll';
import { cn } from '../../../lib/utils';
import { Button } from '../../primitives/Button';
import { ErrorBoundary } from '../../primitives/ErrorBoundary';
import { SplitReveal } from '../../primitives/SplitReveal';
import { HeadPoster } from './bobble/HeadPoster';

const BobbleStage = lazy(() => import('./bobble/BobbleStage'));


export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useBootReady();
  const reduced = useReducedMotion();
  const [load3d, setLoad3d] = useState(false);
  const [live3d, setLive3d] = useState(false);

  // The loader waits for the face (preloaded), never for WebGL.
  useEffect(() => {
    const img = new Image();
    img.src = personUrl;
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
      className="relative isolate flex flex-col overflow-hidden pt-[var(--nav-h)] lg:h-[min(100svh,860px)] lg:min-h-[600px]"
    >
      {/* Studio lighting: one soft key pool behind the desk, falling off into a vignette. Static. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            'radial-gradient(38% 52% at 72% 46%, color-mix(in oklab, var(--ink) 7%, transparent), transparent 70%)',
            'radial-gradient(30% 40% at 72% 40%, color-mix(in oklab, var(--accent) var(--tone-glow-strength), transparent), transparent 72%)',
            'radial-gradient(120% 90% at 50% 40%, transparent 55%, color-mix(in oklab, var(--bg) 70%, black) 100%)',
          ].join(','),
        }}
      />

      <div className="shell relative grid flex-1 grid-cols-1 items-center gap-y-2 lg:grid-cols-12 lg:gap-x-6">
        {/* The 3D me */}
        <m.div
          style={{ y: stageY, opacity: stageOpacity }}
          className="relative order-1 -mx-[var(--gutter)] h-[min(96vw,420px)] sm:h-[min(70vw,520px)] lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[min(calc(100svh-var(--nav-h)-1.5rem),760px)]"
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

        <m.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 order-2 min-w-0 pb-14 lg:order-1 lg:col-span-5 lg:pb-0">
          {/* 1 · Identity */}
          <m.div {...enter(0)}>
            <p className="flex items-center gap-3 text-[clamp(1.125rem,0.95rem+0.7vw,1.5rem)] font-medium tracking-[-0.02em] text-ink">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-accent" />
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
            text={'I build the platforms\ncolleges *run on.*'}
            play={ready}
            delay={0.12}
            stagger={0.08}
            className="mt-7 font-serif text-[clamp(3rem,1.4rem+5vw,4.6rem)] leading-[0.98] font-normal tracking-[-0.015em] outline-none lg:text-[min(5.2vw,4.9rem)] [&_.serif-em]:pr-[0.06em] [&_.serif-em]:text-accent"
          />
          {/* 3 · Supporting context */}
          <m.p {...enter(0.4, false)} className="text-lead mt-6 max-w-[30rem] text-pretty text-muted">
            Helpdesk, learning and accreditation software for Indian higher education — built in Elixir, Phoenix and
            Vue.
          </m.p>

          {/* 4 · Action */}
          <m.div {...enter(0.6)} className="mt-8 flex flex-wrap items-center gap-3">
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

          <m.p {...enter(0.8)} className="text-label mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-faint">
            <span>
              Now at <span className="text-ink">Ardhika</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Previously CICT and RETECH</span>
          </m.p>
        </m.div>
      </div>
    </section>
  );
}

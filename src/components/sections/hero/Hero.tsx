import { m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { profile } from '../../../content/profile';
import { useBootReady } from '../../../hooks/useBootReady';
import { useLocalTime } from '../../../hooks/useLocalTime';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { scrollToSection } from '../../../lib/scroll';
import { Button } from '../../primitives/Button';
import { SplitReveal } from '../../primitives/SplitReveal';
import { StackFigure } from './StackFigure';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useBootReady();
  const reduced = useReducedMotion();
  const time = useLocalTime(profile.timeZone);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0]);
  const figureOpacity = useTransform(scrollYProgress, [0.25, 0.95], [1, reduced ? 1 : 0]);

  const enter = (delay: number, fade = true) => ({
    initial: { opacity: fade ? 0 : 1, y: reduced ? 0 : 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_OUT_EXPO, delay: reduced ? 0 : delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[calc(var(--nav-h)+1.5rem)] lg:pt-[var(--nav-h)]"
    >
      {/* Ambient light behind the stack */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 72% 48%, var(--glow-accent), transparent 70%), radial-gradient(40% 40% at 88% 80%, var(--glow-signal), transparent 70%)',
          opacity: 0.55,
        }}
      />

      <div className="shell relative grid flex-1 grid-cols-1 grid-rows-[auto_auto] items-center gap-y-4 lg:grid-cols-12 lg:grid-rows-1 lg:gap-x-8">
        <m.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 min-w-0 lg:col-span-6 lg:py-24">
          <m.p {...enter(0)} className="text-meta flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-ink">{profile.name}</span>
            <span aria-hidden="true" className="hidden h-px w-6 bg-line-strong sm:block" />
            <span>
              {profile.role} · {profile.degree}
            </span>
          </m.p>

          <SplitReveal
            as="h1"
            id="hero-title"
            text={'I build systems\nthat keep *running.*'}
            play={ready}
            delay={0.1}
            stagger={0.07}
            className="text-display mt-7"
          />

          <m.p {...enter(0.35, false)} className="text-lead mt-8 max-w-[38rem] text-muted">
            Software engineer working across the stack — <span className="text-ink">Elixir and Phoenix</span> on the
            server, <span className="text-ink">Vue 3 and React</span> in the browser,{' '}
            <span className="text-ink">PostgreSQL</span> underneath. Currently architecting the Helpdesk platform for
            the Sastra Online Learning Platform at {profile.company}.
          </m.p>

          <m.div {...enter(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
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

          <m.dl
            {...enter(0.85)}
            className="mt-14 hidden max-w-[40rem] grid-cols-3 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid"
          >
            <div>
              <dt className="text-meta text-faint">Now</dt>
              <dd className="mt-1.5 text-sm text-ink">Ardhika Software</dd>
            </div>
            <div>
              <dt className="text-meta text-faint">Core</dt>
              <dd className="mt-1.5 text-sm text-ink">{profile.core.join(' · ')}</dd>
            </div>
            <div>
              <dt className="text-meta text-faint">Local time</dt>
              <dd className="mt-1.5 text-sm text-ink tabular-nums">
                <time>{time}</time> {profile.timeZoneLabel} · {profile.region}
              </dd>
            </div>
          </m.dl>
        </m.div>

        <m.div
          style={{ opacity: figureOpacity }}
          className="relative -mx-[var(--gutter)] h-[min(100vw,440px)] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:h-auto lg:w-[56%] lg:py-[calc(var(--nav-h)+1rem)] lg:pr-[var(--gutter)]"
        >
          <m.div
            className="size-full"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
          >
            <StackFigure progress={scrollYProgress} ready={ready} className="size-full px-[var(--gutter)] lg:px-0" />
          </m.div>
        </m.div>
      </div>

      <div className="shell relative z-10 hidden pb-8 lg:block">
        <a
          href="#profile"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('profile');
          }}
          className="text-meta group inline-flex items-center gap-3 text-faint transition-colors hover:text-ink"
        >
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-0 bg-accent [animation:scroll-cue_2.4s_var(--ease-in-out-quart)_infinite]" />
          </span>
          Scroll to explore
        </a>
      </div>
    </section>
  );
}

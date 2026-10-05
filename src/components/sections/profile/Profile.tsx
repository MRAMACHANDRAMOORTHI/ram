import { m, useScroll } from 'framer-motion';
import { Fragment, useRef } from 'react';
import { education } from '../../../content/experience';
import { profile } from '../../../content/profile';
import type { Tone } from '../../../content/types';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { toneText } from '../../../lib/tones';
import { cn } from '../../../lib/utils';
import { Counter } from '../../primitives/Counter';
import { Icon } from '../../primitives/Icon';
import { Reveal, RevealGroup, RevealItem } from '../../primitives/Reveal';
import { SplitReveal } from '../../primitives/SplitReveal';
import { ToneSection } from '../../primitives/ToneSection';
import { IdentityCard } from './IdentityCard';
import { ScrollStatement } from './ScrollStatement';

const glance: Array<{ value: number; suffix: string; label: string; tone: Tone }> = [
  { value: 3, suffix: '', label: 'Engineering roles since May 2024', tone: 'systems' },
  { value: 30, suffix: '%', label: 'Engagement lift on CICT’s learning platform', tone: 'automation' },
  { value: 25, suffix: '%', label: 'Faster data retrieval after MySQL tuning at RETECH', tone: 'systems' },
];

/** Plain text with *asterisk* accents rendered as serif italics. */
function Accented({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) =>
        i % 2 ? (
          <em key={i} className="serif-em text-ink">
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** The statement as an editorial pull-quote: a scroll-lit serif lead, then a quieter body. */
function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });

  return (
    <figure ref={ref} className="relative mt-14 lg:mt-16">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-3 font-serif text-[8rem] leading-none text-accent/25 select-none sm:-left-6 sm:text-[10rem]"
      >
        “
      </span>
      <blockquote className="relative">
        <ScrollStatement
          text={profile.statement.lead}
          className="font-serif text-[clamp(1.85rem,1.1rem+2.1vw,3rem)] leading-[1.12] tracking-[-0.012em] text-pretty text-ink"
        />
        <div className="mt-8 grid grid-cols-[2px_1fr] gap-5 sm:gap-7">
          {/* Accent rule that fills as the quote is read. */}
          <span aria-hidden="true" className="relative overflow-hidden rounded-full bg-line">
            <m.span className="absolute inset-0 origin-top rounded-full bg-accent" style={{ scaleY: scrollYProgress }} />
          </span>
          <Reveal>
            <p className="text-lead max-w-[38rem] text-pretty text-muted">
              <Accented text={profile.statement.body} />
            </p>
          </Reveal>
        </div>
      </blockquote>
      <figcaption className="text-meta mt-8 flex items-center gap-3 pl-[calc(2px+1.25rem)] text-faint sm:pl-[calc(2px+1.75rem)]">
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        {profile.name} · {profile.role}
      </figcaption>
    </figure>
  );
}

export function Profile() {
  return (
    // Tight top padding: the Profile nav link lands with the whole ID card in view.
    <ToneSection id="profile" aria-labelledby="profile-title" className="pt-10 pb-[clamp(5.5rem,4rem+7vw,11rem)] lg:pt-14">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* The card leads on every screen size and stays pinned while the story scrolls. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
              <IdentityCard />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6 xl:pl-12">
            <header>
              <div className="text-meta flex items-center gap-3 text-faint">
                <span className="text-tone">01</span>
                <m.span
                  aria-hidden="true"
                  className="h-px w-14 origin-left bg-gradient-to-r from-tone to-line-strong"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
                />
                <span>Profile</span>
              </div>
              <SplitReveal
                as="h2"
                id="profile-title"
                text={'Most of my work is the part\nyou *don’t see.*'}
                className="mt-6 text-[clamp(2.25rem,1.3rem+2.9vw,4rem)] leading-[0.98] font-medium tracking-[-0.04em] text-balance outline-none [&_.serif-em]:text-tone"
              />
            </header>

            <Statement />

            <h3 className="text-meta mt-20 text-faint">At a glance</h3>
            <RevealGroup as="ul" className="mt-6 grid grid-cols-3 border-y border-line">
              {glance.map((g, i) => (
                <RevealItem
                  as="li"
                  key={g.label}
                  className={i === 0 ? 'py-6 pr-3 sm:pr-6' : 'border-l border-line py-6 pr-3 pl-3 sm:pr-6 sm:pl-6'}
                >
                  <Counter
                    value={g.value}
                    suffix={g.suffix}
                    className={cn('block text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-none font-medium tracking-[-0.04em]', toneText[g.tone])}
                  />
                  <span className="mt-3 block max-w-[14rem] text-[0.8125rem] leading-snug text-muted sm:text-sm">{g.label}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            <h3 className="text-meta mt-20 text-faint">Foundations</h3>
            <RevealGroup as="ul" className="mt-6 border-t border-line">
              {education.map((e) => (
                <RevealItem as="li" key={e.degree} className="border-b border-line">
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6"
                  >
                    <span>
                      <span className="text-subheading block">{e.degree}</span>
                      <span className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors group-hover:text-ink">
                        {e.school} · {e.place}
                        <Icon
                          name="arrow-up-right"
                          size={14}
                          className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </span>
                    <span className="text-right">
                      <Counter
                        value={e.score}
                        decimals={2}
                        className="block text-[1.75rem] leading-none font-medium tracking-[-0.03em] sm:text-[2rem]"
                      />
                      <span className="text-meta mt-1.5 block text-faint">
                        {e.scoreLabel} · {e.period}
                      </span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </ToneSection>
  );
}

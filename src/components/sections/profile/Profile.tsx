import { education } from '../../../content/experience';
import { profile } from '../../../content/profile';
import type { Tone } from '../../../content/types';
import { toneText } from '../../../lib/tones';
import { cn } from '../../../lib/utils';
import { Counter } from '../../primitives/Counter';
import { Icon } from '../../primitives/Icon';
import { RevealGroup, RevealItem } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';
import { ToneSection } from '../../primitives/ToneSection';
import { IdentityCard } from './IdentityCard';
import { ScrollStatement } from './ScrollStatement';

const glance: Array<{ value: number; suffix: string; label: string; tone: Tone }> = [
  { value: 3, suffix: '', label: 'Engineering roles since May 2024', tone: 'human' },
  { value: 30, suffix: '%', label: 'Engagement lift on CICT’s learning platform', tone: 'automation' },
  { value: 25, suffix: '%', label: 'Faster data retrieval after MySQL tuning at RETECH', tone: 'data' },
];

export function Profile() {
  return (
    <ToneSection id="profile" aria-labelledby="profile-title" className="section-pad">
      <div className="shell">
        <SectionHeader index="01" label="Profile" id="profile-title" title={'Most of my work is the part\nyou *don’t see.*'} />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
              <IdentityCard />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6 xl:pl-12">
            <ScrollStatement
              text={profile.statement}
              className="text-heading text-pretty"
            />

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

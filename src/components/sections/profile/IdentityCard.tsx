import { useState } from 'react';
import portrait from '../../../assets/portrait.webp';
import { principles, profile } from '../../../content/profile';
import { useLocalTime } from '../../../hooks/useLocalTime';
import { cn } from '../../../lib/utils';
import { Icon } from '../../primitives/Icon';
import { TiltCard } from '../../primitives/TiltCard';

const HANDLE = 'github.com/MRAMACHANDRAMOORTHI';

/** Decorative barcode derived from the GitHub handle. */
function Barcode() {
  let x = 0;
  const bars = [...HANDLE].map((ch, i) => {
    const w = 1 + (ch.charCodeAt(0) % 3);
    const bar = <rect key={i} x={x} y={0} width={w} height={28} />;
    x += w + 1 + (i % 2);
    return bar;
  });
  return (
    <svg viewBox={`0 0 ${x} 28`} className="h-7 w-auto" fill="currentColor" aria-hidden="true" preserveAspectRatio="none">
      {bars}
    </svg>
  );
}

export function IdentityCard() {
  const [flipped, setFlipped] = useState(false);
  const time = useLocalTime(profile.timeZone);

  const face =
    'absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] bg-paper p-5 text-paper-ink shadow-lg [backface-visibility:hidden] sm:p-6';

  return (
    <div className="mx-auto w-full max-w-[25rem]">
      <TiltCard className="rounded-[1.75rem]" max={7}>
        <div
          className="relative aspect-[5/7] w-full transition-transform duration-[1100ms] ease-out-expo [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
        >
          {/* Front */}
          <div className={face} aria-hidden={flipped} inert={flipped}>
            <div className="flex items-center justify-between">
              <span className="text-meta opacity-60">Profile · {profile.monogram}</span>
              <span aria-hidden="true" className="h-2 w-14 rounded-full bg-paper-ink/12" />
              <span className="text-meta tabular-nums opacity-60">
                {time} {profile.timeZoneLabel}
              </span>
            </div>

            <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl bg-paper-ink/5">
              <img
                src={portrait}
                alt={`Portrait of ${profile.name}`}
                width={720}
                height={720}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-[50%_20%] mix-blend-multiply [filter:grayscale(1)_contrast(1.08)_brightness(1.04)]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent"
              />
            </div>

            <div className="mt-4">
              <p className="text-[1.375rem] leading-tight font-medium tracking-[-0.02em] sm:text-2xl">{profile.name}</p>
              <p className="mt-1 text-sm opacity-65">
                {profile.role} · {profile.company}
              </p>
            </div>

            <dl className="text-label mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-paper-ink/12 pt-4">
              <dt className="opacity-50">Core</dt>
              <dd>{profile.core.join(' · ')}</dd>
              <dt className="opacity-50">Degree</dt>
              <dd>MCA · SRM IST · 9.40</dd>
            </dl>

            <div className="mt-4 flex items-end justify-between gap-4">
              <Barcode />
              <span className="text-meta truncate text-[0.625rem] opacity-50">{HANDLE.replace('github.com/', '@')}</span>
            </div>
          </div>

          {/* Back */}
          <div className={cn(face, '[transform:rotateY(180deg)]')} aria-hidden={!flipped} inert={!flipped}>
            <div className="flex items-center justify-between">
              <span className="text-meta opacity-60">How I work</span>
              <span aria-hidden="true" className="h-2 w-14 rounded-full bg-paper-ink/12" />
              <span className="text-meta opacity-60">04</span>
            </div>
            <ol className="mt-6 flex flex-1 flex-col justify-between gap-4">
              {principles.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-paper-ink/12 pt-3">
                  <span className="text-meta pt-1 opacity-45">0{i + 1}</span>
                  <span>
                    <span className="block text-[1.0625rem] leading-snug font-medium tracking-[-0.015em]">{p.title}</span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed opacity-65">{p.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </TiltCard>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="text-label mx-auto mt-5 flex h-10 items-center gap-2 rounded-full border border-line px-4 text-muted transition-colors duration-300 hover:border-line-strong hover:text-ink"
      >
        <Icon name="flip" size={15} />
        {flipped ? 'Show profile' : 'How I work'}
      </button>
    </div>
  );
}

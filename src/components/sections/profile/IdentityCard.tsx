import { m, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import portrait from '../../../assets/portrait.webp';
import { principles, profile } from '../../../content/profile';
import type { Tone } from '../../../content/types';
import { useLocalTime } from '../../../hooks/useLocalTime';
import { useFinePointer, useReducedMotion } from '../../../hooks/useMediaQuery';
import { toneBg } from '../../../lib/tones';
import { cn } from '../../../lib/utils';
import { Icon } from '../../primitives/Icon';

const HANDLE = 'github.com/MRAMACHANDRAMOORTHI';
const CORE_TONES: Tone[] = ['systems', 'systems', 'interface', 'data'];
const PRINCIPLE_TONES: Tone[] = ['automation', 'systems', 'data', 'human'];

/** Decorative barcode derived from the GitHub handle. */
function Barcode() {
  let x = 0;
  const bars = [...HANDLE].map((ch, i) => {
    const w = 1 + (ch.charCodeAt(0) % 3);
    const bar = <rect key={i} x={x} y={0} width={w} height={26} />;
    x += w + 1 + (i % 2);
    return bar;
  });
  return (
    <svg viewBox={`0 0 ${x} 26`} className="h-6 w-auto" fill="currentColor" aria-hidden="true" preserveAspectRatio="none">
      {bars}
    </svg>
  );
}

/**
 * Two-sided profile card: tilt toward the cursor, spring flip, and a conic
 * rim in the site's domain tones. The portrait stays in natural colour —
 * no filters or blend modes touch the photo itself.
 */
export function IdentityCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const time = useLocalTime(profile.timeZone);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;

  const tiltSpring = { stiffness: 170, damping: 18, mass: 0.6 };
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  // The flip is its own spring so it settles with a little weight instead of a linear swing.
  const flip = useSpring(0, { stiffness: 120, damping: 17, mass: 1 });

  useEffect(() => {
    if (reduced) flip.jump(flipped ? 180 : 0);
    else flip.set(flipped ? 180 : 0);
  }, [flipped, reduced, flip]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!interactive || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set(-(py - 0.5) * 12);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
    el.style.setProperty('--rim', `${Math.atan2(py - 0.5, px - 0.5) * (180 / Math.PI) + 90}deg`);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const face =
    'absolute inset-[1.5px] flex flex-col overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-paper p-4 text-paper-ink [backface-visibility:hidden] sm:p-5';

  return (
    <div className="mx-auto w-full max-w-[25rem]">
      <div className="[perspective:1400px]">
        <m.div
          ref={ref}
          onPointerMove={onMove}
          onPointerLeave={reset}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="group/card relative"
        >
          {/* Contact shadow on the "table" — grows as the card lifts. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[8%] -bottom-6 h-10 rounded-[50%] bg-black/35 blur-2xl transition-[opacity,scale] duration-700 group-hover/card:scale-x-110 group-hover/card:opacity-70 light:bg-[rgb(60_45_20/0.3)]"
            style={{ transform: 'translateZ(-40px)' }}
          />

          <m.div
            className="relative aspect-[5/7.2] w-full rounded-[1.75rem] shadow-lg [transform-style:preserve-3d]"
            style={{ rotateY: flip }}
          >
            {/* Rim: a hairline of every domain tone, brightest where the cursor is. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-[inherit] opacity-60 transition-opacity duration-500 group-hover/card:opacity-100"
              style={{
                background:
                  'conic-gradient(from var(--rim, 210deg), var(--accent), color-mix(in oklab, var(--accent) 25%, var(--line-strong)) 30%, var(--line-strong) 55%, color-mix(in oklab, var(--accent) 25%, var(--line-strong)) 80%, var(--accent))',
              }}
            />

            {/* Front */}
            <div className={face} aria-hidden={flipped} inert={flipped}>
              <div className="flex items-center justify-between">
                <span className="text-meta opacity-60">Profile · {profile.monogram}</span>
                <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-paper-ink/12" />
                <span className="text-meta tabular-nums opacity-60">
                  {time} {profile.timeZoneLabel}
                </span>
              </div>

              <div className="relative mt-3.5 min-h-0 flex-1">
                {/* Soft light spilling from behind the photo. */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[1.5rem] opacity-50 blur-xl transition-opacity duration-700 group-hover/card:opacity-80"
                  style={{
                    background:
                      'radial-gradient(60% 55% at 20% 10%, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)',
                  }}
                />
                <div className="relative size-full overflow-hidden rounded-[1.125rem] bg-[#c9ced6] shadow-[0_0_0_1px_rgb(23_21_15/0.12),0_12px_28px_-14px_rgb(23_21_15/0.55)]">
                  <img
                    src={portrait}
                    alt={`Portrait of ${profile.name}`}
                    width={720}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-[1.02] object-cover object-[50%_18%] transition-transform duration-[1200ms] ease-out-expo group-hover/card:scale-[1.06]"
                  />
                  {/* Specular sheen that follows the cursor (screen blend keeps skin tones natural). */}
                  {interactive && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover/card:opacity-100"
                      style={{
                        background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 30%), rgb(255 255 255 / 0.16), transparent 42%)',
                      }}
                    />
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-white uppercase backdrop-blur-md">
                    <span className="status-dot !size-1.5" aria-hidden="true" />
                    {profile.role}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[1.375rem] leading-tight font-medium tracking-[-0.02em] sm:text-[1.5rem]">{profile.name}</p>
                <p className="mt-1 text-sm opacity-70">{profile.company}</p>
              </div>

              <dl className="text-label mt-3.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-paper-ink/12 pt-3.5">
                <dt className="opacity-55">Core</dt>
                <dd className="flex flex-wrap gap-x-2.5">
                  {profile.core.map((c, i) => (
                    <span key={c} className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className={cn('size-1.5 rounded-full', toneBg[CORE_TONES[i]])} />
                      {c}
                    </span>
                  ))}
                </dd>
                <dt className="opacity-55">Degree</dt>
                <dd>MCA · SRM IST · 9.40</dd>
              </dl>

              <div className="mt-3.5 flex items-end justify-between gap-4">
                <Barcode />
                <span className="text-meta truncate text-[0.625rem] opacity-55">{HANDLE.replace('github.com/', '@')}</span>
              </div>
            </div>

            {/* Back — plain paper and ink, so the principles read first. */}
            <div className={cn(face, '[transform:rotateY(180deg)]')} aria-hidden={!flipped} inert={!flipped}>
              <div className="flex items-center justify-between">
                <span className="text-meta opacity-60">How I work</span>
                <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-paper-ink/12" />
                <span className="text-meta opacity-60">04</span>
              </div>
              <ol className="mt-6 flex flex-1 flex-col justify-between gap-4">
                {principles.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-paper-ink/12 pt-3">
                    <span className="text-meta flex items-center gap-1.5 self-start pt-1 opacity-55">
                      <span aria-hidden="true" className={cn('size-1.5 rounded-full', toneBg[PRINCIPLE_TONES[i]])} />
                      0{i + 1}
                    </span>
                    <span>
                      <span className="block text-[1.0625rem] leading-snug font-medium tracking-[-0.015em]">{p.title}</span>
                      <span className="mt-1 block text-[0.8125rem] leading-relaxed opacity-70">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </m.div>
        </m.div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="text-label mx-auto mt-8 flex h-10 items-center gap-2 rounded-full border border-line px-4 text-muted transition-colors duration-300 hover:border-human/50 hover:text-ink"
      >
        <Icon name="flip" size={15} />
        {flipped ? 'Show profile' : 'How I work'}
      </button>
    </div>
  );
}

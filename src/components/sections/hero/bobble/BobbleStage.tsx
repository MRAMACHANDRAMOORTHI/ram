import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import headUrl from '../../../../assets/head.webp';
import { profile } from '../../../../content/profile';
import { useInViewport } from '../../../../hooks/useInViewport';
import { useFinePointer, useReducedMotion } from '../../../../hooks/useMediaQuery';
import { cn } from '../../../../lib/utils';
import { useTheme } from '../../../../providers/ThemeProvider';
import { BobbleScene, type Anchor } from './BobbleScene';
import { GAGS, type GagId } from './gags';

type FxTone = 'pink' | 'amber' | 'lime' | 'cyan';
const FX_CLASS: Record<FxTone, string> = {
  pink: 'text-accent',
  amber: 'text-automation',
  lime: 'text-ink',
  cyan: 'text-accent',
};
const AUTO_ORDER: GagId[] = ['bug', 'coffee', 'duck', 'deploy'];
const AUTO_EVERY = 9500;
const IDLE_AFTER_INTERACTION = 12000;

/** Lazy-loaded hero centrepiece: the 3D bobblehead, its speech bubbles and the gag controls. */
export default function BobbleStage({ ready, onLive }: { ready: boolean; onLive?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meRef = useRef<HTMLDivElement>(null);
  const duckRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BobbleScene | null>(null);
  const lastInteraction = useRef(Number.NEGATIVE_INFINITY);
  const autoIndex = useRef(0);
  const onLiveRef = useRef(onLive);
  onLiveRef.current = onLive;

  const [me, setMe] = useState<string | null>(null);
  const [duck, setDuck] = useState<string | null>(null);
  const [fx, setFx] = useState<{ text: string; tone: FxTone; key: number } | null>(null);
  const [active, setActive] = useState<GagId | null>(null);
  const [failed, setFailed] = useState(false);
  const [live, setLive] = useState(false);
  const [hover, setHover] = useState(false);

  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const inView = useInViewport(wrapRef);

  // Create the scene once.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let scene: BobbleScene;
    try {
      scene = new BobbleScene(canvas, {
        onBubble: (who, text) => (who === 'me' ? setMe(text) : setDuck(text)),
        onFx: (text, tone = 'pink') => setFx(text ? { text, tone, key: performance.now() } : null),
        onGag: setActive,
        onFirstFrame: () => {
          setLive(true);
          onLiveRef.current?.();
        },
        onAnchors: (a, d, f) => {
          const width = wrap.clientWidth;
          place(meRef.current, a, width, 'start');
          place(duckRef.current, d, width, 'center');
          place(fxRef.current, f, width, 'center');
        },
      });
    } catch {
      setFailed(true);
      return;
    }
    sceneRef.current = scene;
    scene.prepare(headUrl).catch(() => setFailed(true));
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.setSize(width, height, Math.min(window.devicePixelRatio || 1, width < 600 ? 1.5 : 1.75));
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => sceneRef.current?.setTheme(theme === 'light'), [theme]);
  useEffect(() => sceneRef.current?.setReducedMotion(reduced), [reduced]);

  // Animate only while visible and the tab is active.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const sync = () => (inView && !document.hidden ? scene.start() : scene.stop());
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [inView]);

  // The head leans toward the cursor; the camera drifts a little with it.
  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: globalThis.PointerEvent) => {
      sceneRef.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, reduced]);

  // Auto-play the gags while the hero is on screen and nobody is playing with it.
  useEffect(() => {
    if (!ready || !inView || reduced || failed) return;
    const tick = () => {
      const scene = sceneRef.current;
      if (!scene || scene.busy || document.hidden) return;
      if (performance.now() - lastInteraction.current < IDLE_AFTER_INTERACTION) return;
      scene.play(AUTO_ORDER[autoIndex.current % AUTO_ORDER.length]);
      autoIndex.current += 1;
    };
    const first = window.setTimeout(tick, 1600);
    const every = window.setInterval(tick, AUTO_EVERY);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [ready, inView, reduced, failed]);

  const local = (e: PointerEvent<HTMLCanvasElement> | MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const trigger = (id: GagId) => {
    lastInteraction.current = performance.now();
    if (reduced || failed) {
      const g = GAGS.find((x) => x.id === id)!;
      setMe(g.punchline);
      window.setTimeout(() => setMe(null), 3200);
      return;
    }
    if (!sceneRef.current?.busy) sceneRef.current?.play(id);
  };

  return (
    <div className="relative flex size-full flex-col">
      <div
        ref={wrapRef}
        className="relative min-h-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent),linear-gradient(to_bottom,black_88%,transparent)] [mask-composite:intersect]"
      >
        {!failed && (
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`A 3D bobblehead of ${profile.name} typing at a laptop, with comedy moments: squashing a bug, a Friday deploy, too much coffee and rubber-duck debugging.`}
            className={cn(
              'absolute inset-0 size-full touch-pan-y transition-opacity duration-700',
              live ? 'opacity-100' : 'opacity-0',
              hover && 'cursor-pointer',
            )}
            onPointerMove={(e) => {
              if (e.pointerType !== 'mouse') return;
              setHover(!!sceneRef.current?.pick(...local(e)));
            }}
            onPointerLeave={() => setHover(false)}
            onClick={(e) => {
              lastInteraction.current = performance.now();
              sceneRef.current?.click(...local(e));
            }}
          />
        )}

        {/* Speech bubbles and comic FX follow 3D anchors (positioned by the scene, no re-render per frame). */}
        <div ref={meRef} className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform" aria-live="polite">
          {me && (
            <div key={me} className="bubble-pop relative w-max max-w-[min(17rem,62vw)] -translate-y-full rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-[0.8125rem] leading-snug font-semibold text-[#1a1433] shadow-lg sm:text-sm">
              {me}
            </div>
          )}
        </div>
        <div ref={duckRef} className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform" aria-live="polite">
          {duck && (
            <div key={duck} className="bubble-pop relative w-max max-w-[min(15rem,56vw)] -translate-x-1/2 -translate-y-full rounded-2xl bg-[#ffd23f] px-3.5 py-2 text-[0.8125rem] leading-snug font-bold text-[#2a1a00] shadow-lg sm:text-sm">
              {duck}
            </div>
          )}
        </div>
        <div ref={fxRef} className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform" aria-hidden="true">
          {fx && (
            <div
              key={fx.key}
              className={cn(
                'fx-pop -translate-x-1/2 -translate-y-1/2 -rotate-6 text-[clamp(1.6rem,1rem+2.2vw,3rem)] font-black tracking-[-0.03em] whitespace-nowrap [paint-order:stroke] [-webkit-text-stroke:7px_var(--bg)]',
                FX_CLASS[fx.tone],
              )}
            >
              {fx.text}
            </div>
          )}
        </div>
      </div>

      {/* Gag controls — keyboard and touch access to every joke. */}
      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Comedy moments">
        {GAGS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => trigger(g.id)}
            aria-pressed={active === g.id}
            className={cn(
              'text-label inline-flex h-10 items-center gap-2 rounded-full border px-3.5 backdrop-blur-md transition-[background-color,border-color,color,translate] duration-300 hover:-translate-y-0.5',
              active === g.id ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong bg-bg/50 text-muted hover:border-ink/40 hover:text-ink',
            )}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {g.emoji}
            </span>
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Moves an overlay to its 3D anchor, kept fully inside the stage. */
function place(el: HTMLElement | null, a: Anchor, stageWidth: number, align: 'start' | 'center') {
  if (!el) return;
  const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
  const pad = 10;
  const x =
    align === 'start'
      ? Math.max(pad, Math.min(a.x, stageWidth - w - pad))
      : Math.max(w / 2 + pad, Math.min(a.x, stageWidth - w / 2 - pad));
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
  el.style.visibility = a.visible ? 'visible' : 'hidden';
}

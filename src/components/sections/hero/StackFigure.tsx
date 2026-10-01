import { useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useInViewport } from '../../../hooks/useInViewport';
import { useFinePointer, useReducedMotion } from '../../../hooks/useMediaQuery';
import { markBoot } from '../../../lib/boot';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../providers/ThemeProvider';
import { LAYERS, StackScene, type SceneFocus, type ScenePalette } from './stackScene';

function readPalette(): ScenePalette {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    mode: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
    bg: v('--bg'),
    surface: v('--surface'),
    ink: v('--ink'),
    muted: v('--muted'),
    accent: v('--accent'),
    signal: v('--signal'),
  };
}

interface StackFigureProps {
  progress: MotionValue<number>;
  ready: boolean;
  className?: string;
}

export function StackFigure({ progress, ready, className }: StackFigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<StackScene | null>(null);
  const touchTimer = useRef(0);
  const [focus, setFocus] = useState<SceneFocus | null>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const inView = useInViewport(wrapRef);

  // Create the scene once; size it from the container.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const scene = new StackScene(canvas, readPalette());
    scene.onFirstFrame = () => markBoot('scene');
    scene.onFocus = setFocus;
    scene.refreshFocus();
    sceneRef.current = scene;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.setSize(width, height, Math.min(window.devicePixelRatio || 1, width < 520 ? 1.75 : 2));
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reduced);
  }, [reduced]);

  useEffect(() => {
    sceneRef.current?.setPalette(readPalette());
  }, [theme]);

  useEffect(() => {
    if (ready) sceneRef.current?.playEntrance();
  }, [ready]);

  // Only animate while visible and the tab is active.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const sync = () => (inView && !document.hidden ? scene.start() : scene.stop());
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [inView]);

  useMotionValueEvent(progress, 'change', (v) => sceneRef.current?.setScroll(v));

  // Camera follows the cursor anywhere in the window.
  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: globalThis.PointerEvent) => {
      sceneRef.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, reduced]);

  const hitTest = (e: PointerEvent<HTMLCanvasElement>) => {
    const scene = sceneRef.current;
    if (!scene) return false;
    const r = e.currentTarget.getBoundingClientRect();
    return scene.hover(e.clientX - r.left, e.clientY - r.top);
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType !== 'mouse') return;
    e.currentTarget.style.cursor = hitTest(e) ? 'crosshair' : '';
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse') return;
    hitTest(e);
    window.clearTimeout(touchTimer.current);
    touchTimer.current = window.setTimeout(() => sceneRef.current?.hover(null, null), 4000);
  };

  return (
    <figure className={cn('relative flex flex-col lg:flex-col-reverse', className)}>
      <div ref={wrapRef} className="relative min-h-0 flex-1">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 size-full touch-pan-y"
          onPointerMove={onPointerMove}
          onPointerLeave={() => sceneRef.current?.hover(null, null)}
          onPointerDown={onPointerDown}
        />
      </div>
      <p className="sr-only">
        Diagram: four stacked architecture layers — {LAYERS.join(', ')} — showing how my projects flow through them.
        Helpdesk: Vue 3, Phoenix, a ticket state machine, SLA jobs and round-robin assignment, PostgreSQL. CICT
        e-learning: React, Node.js, Firebase. HealthChain: Thymeleaf, Spring Boot, MySQL, Web3j and a smart contract.
      </p>
      <figcaption
        aria-hidden="true"
        className="text-label pointer-events-none relative z-10 mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-1 lg:mt-6 lg:mb-0 lg:pl-[18%]"
      >
        <span className="min-w-0 max-w-md">
          <span className="text-faint">Fig. 01 — {focus?.source === 'hover' ? 'Node' : 'Tracing'}: </span>
          <span className="text-ink">{focus?.title}</span>
          <span className="mt-1 block truncate text-faint">{focus?.detail}</span>
        </span>
        <span className="flex items-center gap-4 text-faint">
          <span className="inline-flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-accent" /> request
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-signal" /> response
          </span>
          <span className="hidden sm:inline">{fine ? 'Hover a node' : 'Tap a node'}</span>
        </span>
      </figcaption>
    </figure>
  );
}

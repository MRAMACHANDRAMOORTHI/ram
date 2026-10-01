import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import { Cursor } from './components/chrome/Cursor';
import { Footer } from './components/chrome/Footer';
import { Navigation } from './components/chrome/Navigation';
import { Toasts } from './components/chrome/Toasts';
import { Approach } from './components/sections/approach/Approach';
import { loadSimulator } from './components/sections/approach/loadSimulator';
import { Career } from './components/sections/career/Career';
import { Contact } from './components/sections/contact/Contact';
import { Hero } from './components/sections/hero/Hero';
import { Profile } from './components/sections/profile/Profile';
import { Stack } from './components/sections/stack/Stack';
import { Work } from './components/sections/work/Work';
import { markBoot } from './lib/boot';
import { initSmoothScroll, scrollToSection } from './lib/scroll';
import { useUI } from './providers/UIProvider';

/** Below-the-fold sections, mounted one per idle slot after the hero has painted. */
const BELOW_FOLD = [Profile, Work, Career, Approach, Stack, Contact];

const CaseStudyLayer = lazy(() => import('./components/sections/work/CaseStudy'));
const CommandPaletteLayer = lazy(() => import('./components/chrome/CommandPalette'));

export default function App() {
  const { paletteOpen, caseSlug, openPalette, closePalette } = useUI();
  // Overlay layers load on first use and then stay mounted so they can animate out.
  const [paletteReady, setPaletteReady] = useState(paletteOpen);
  const [caseReady, setCaseReady] = useState(caseSlug !== null);
  // Paint the hero first, then mount the rest progressively so no single task blocks input.
  // Deep links (#section) need the full page immediately.
  const [mounted, setMounted] = useState(() => (location.hash.length > 1 ? BELOW_FOLD.length : 0));
  const complete = mounted >= BELOW_FOLD.length;

  useEffect(() => {
    if (complete) return;
    const schedule = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 16));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => startTransition(() => setMounted((n) => n + 1)), { timeout: 250 });
    return () => cancel(id);
  }, [mounted, complete]);

  useEffect(() => {
    if (paletteOpen) setPaletteReady(true);
  }, [paletteOpen]);

  useEffect(() => {
    if (caseSlug) setCaseReady(true);
  }, [caseSlug]);

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    markBoot('app');
    if (document.fonts) document.fonts.ready.then(() => markBoot('fonts'));
    else markBoot('fonts');
    // Deep links: wait for anything that changes layout above the target, then jump there.
    const id = location.hash.slice(1);
    if (id && document.getElementById(id)) {
      Promise.all([document.fonts?.ready, loadSimulator()]).then(() =>
        window.setTimeout(() => scrollToSection(id, { immediate: true }), 60),
      );
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, openPalette, closePalette]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink"
      >
        Skip to content
      </a>
      <Navigation sectionsReady={complete} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        {BELOW_FOLD.slice(0, mounted).map((Section, i) => (
          <Section key={i} />
        ))}
        {/* Keeps the document scrollable while sections mount — scroll trackers bind to the
            document only if it can scroll when they attach. Sits below the fold, so no layout shift. */}
        {!complete && <div aria-hidden="true" className="h-[150vh]" />}
      </main>
      {complete && <Footer />}
      <Cursor />
      <Toasts />
      <Suspense fallback={null}>
        {paletteReady && <CommandPaletteLayer />}
        {caseReady && <CaseStudyLayer />}
      </Suspense>
    </>
  );
}

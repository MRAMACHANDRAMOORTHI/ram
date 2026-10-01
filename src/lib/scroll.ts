import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId = 0;
let locks = 0;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth wheel scrolling on desktop. Touch keeps native momentum; reduced motion keeps native everything. */
export function initSmoothScroll() {
  if (lenis || reducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  const loop = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  };
}

function navOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return (parseFloat(value) || 4.5) * rem;
}

/** Scroll to a section id (or the very top) and move focus there for keyboard and screen-reader users. */
export function scrollToSection(id: string, { immediate = false }: { immediate?: boolean } = {}) {
  const target = id === 'top' ? document.body : document.getElementById(id);
  if (!target) return;
  const top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - navOffset() + 1;
  if (lenis) {
    lenis.scrollTo(top, immediate ? { immediate: true } : { duration: 1.3, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top, behavior: immediate || reducedMotion() ? 'auto' : 'smooth' });
  }
  if (id !== 'top') {
    const heading = target.querySelector<HTMLElement>('h2, h1') ?? target;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  history.replaceState(history.state, '', id === 'top' ? location.pathname + location.search : `#${id}`);
}

/** Smoothly scroll the page so `el` sits `ratio` of the way down the viewport. */
export function scrollToElement(el: HTMLElement, ratio = 0.3) {
  const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * ratio;
  if (lenis) lenis.scrollTo(top, { duration: 1.1 });
  else window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** Reference-counted page scroll lock for overlays. */
export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  lenis?.stop();
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`);
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${gap}px`;
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  lenis?.start();
}

/**
 * Boot sequence for the static loader in index.html. Steps are real events
 * (app mounted, fonts loaded, hero scene drew its first frame); the loader
 * leaves once all have reported or a safety timeout fires.
 */
export type BootStep = 'app' | 'fonts' | 'scene';

const REQUIRED: BootStep[] = ['app', 'fonts', 'scene'];
const SAFETY_TIMEOUT = 2600;

const done = new Set<BootStep>();
const listeners = new Set<() => void>();
let ready = false;

function fastBoot() {
  return (
    document.documentElement.dataset.boot === 'fast' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function finish() {
  if (ready) return;
  const minVisible = fastBoot() ? 0 : 650;
  const wait = Math.max(0, minVisible - performance.now());
  window.setTimeout(() => {
    if (ready) return;
    ready = true;
    try {
      sessionStorage.setItem('msr-booted', '1');
    } catch {
      /* storage unavailable: loader simply plays again next time */
    }
    const el = document.getElementById('boot');
    if (el) {
      el.classList.add('is-leaving');
      const remove = () => el.remove();
      el.addEventListener('transitionend', remove, { once: true });
      window.setTimeout(remove, 1200);
    }
    listeners.forEach((fn) => fn());
  }, wait);
}

export function markBoot(step: BootStep) {
  if (done.has(step)) return;
  done.add(step);
  document.querySelector(`#boot [data-step="${step}"]`)?.classList.add('is-done');
  const bar = document.querySelector<HTMLElement>('#boot .boot-bar b');
  bar?.style.setProperty('--p', String(done.size / REQUIRED.length));
  if (REQUIRED.every((s) => done.has(s))) finish();
}

export function isBooted() {
  return ready;
}

export function subscribeBoot(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

window.setTimeout(finish, SAFETY_TIMEOUT);

/** Shared dynamic import so the chunk can be warmed early (idle time, deep links) and lazily rendered. */
export const loadSimulator = () => import('./LifecycleSimulator');

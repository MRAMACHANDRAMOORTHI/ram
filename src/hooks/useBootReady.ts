import { useSyncExternalStore } from 'react';
import { isBooted, subscribeBoot } from '../lib/boot';

/** True once the loader has started to leave — the cue for entrance animations. */
export function useBootReady() {
  return useSyncExternalStore(subscribeBoot, isBooted, () => false);
}

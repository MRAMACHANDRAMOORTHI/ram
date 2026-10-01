import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { isProjectSlug } from '../content/projects';
import type { ContextId } from '../content/types';

interface Toast {
  id: number;
  message: string;
}

interface UIContextValue {
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  caseSlug: ContextId | null;
  caseOrigin: DOMRect | null;
  openCase: (slug: ContextId, origin?: DOMRect | null) => void;
  switchCase: (slug: ContextId) => void;
  closeCase: () => void;
  toasts: Toast[];
  notify: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

const readCaseParam = () => {
  const value = new URLSearchParams(location.search).get('case');
  return isProjectSlug(value) ? value : null;
};

function urlWithCase(slug: ContextId | null) {
  const params = new URLSearchParams(location.search);
  if (slug) params.set('case', slug);
  else params.delete('case');
  const query = params.toString();
  return `${location.pathname}${query ? `?${query}` : ''}${slug ? '' : location.hash}`;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [caseSlug, setCaseSlug] = useState<ContextId | null>(readCaseParam);
  const [caseOrigin, setCaseOrigin] = useState<DOMRect | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushedHistory = useRef(false);
  const toastId = useRef(0);

  // Browser back/forward opens and closes case studies.
  useEffect(() => {
    const onPop = () => {
      const slug = readCaseParam();
      if (!slug) pushedHistory.current = false;
      setCaseOrigin(null);
      setCaseSlug(slug);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openCase = useCallback((slug: ContextId, origin: DOMRect | null = null) => {
    setPaletteOpen(false);
    setCaseOrigin(origin);
    setCaseSlug(slug);
    history.pushState({ case: slug }, '', urlWithCase(slug));
    pushedHistory.current = true;
  }, []);

  const switchCase = useCallback((slug: ContextId) => {
    setCaseOrigin(null);
    setCaseSlug(slug);
    history.replaceState({ case: slug }, '', urlWithCase(slug));
  }, []);

  const closeCase = useCallback(() => {
    if (pushedHistory.current) {
      history.back();
      return;
    }
    setCaseSlug(null);
    history.replaceState(null, '', urlWithCase(null));
  }, []);

  const notify = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((list) => [...list.slice(-2), { id, message }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2600);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      paletteOpen,
      openPalette: () => setPaletteOpen(true),
      closePalette: () => setPaletteOpen(false),
      caseSlug,
      caseOrigin,
      openCase,
      switchCase,
      closeCase,
      toasts,
      notify,
    }),
    [paletteOpen, caseSlug, caseOrigin, openCase, switchCase, closeCase, toasts, notify],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}

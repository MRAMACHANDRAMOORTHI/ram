import { useEffect, useState, type RefObject } from 'react';

/** Live visibility (not one-shot) — used to pause animation loops off-screen. */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

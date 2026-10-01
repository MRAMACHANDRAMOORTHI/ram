import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export interface Connector {
  key: string;
  from: string;
  to: string;
  d: string;
}

/**
 * Measures elements marked `data-node="id"` inside `containerRef` and returns
 * SVG paths joining each pair.
 * - `edges`: S-curves between facing edges (side-to-side for the same row) — diagrams.
 * - `centers`: gently bowed centre-to-centre spokes — graph-style maps.
 */
export function useConnectors(
  containerRef: RefObject<HTMLElement | null>,
  pairs: ReadonlyArray<readonly [string, string]>,
  mode: 'edges' | 'centers' = 'edges',
) {
  const [paths, setPaths] = useState<Connector[]>([]);

  const compute = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const find = (id: string) => root.querySelector<HTMLElement>(`[data-node="${id}"]`)?.getBoundingClientRect();
    const out: Connector[] = [];

    for (const [a, b] of pairs) {
      const ra = find(a);
      const rb = find(b);
      if (!ra || !rb) continue;
      let d: string;
      if (mode === 'centers') {
        const x1 = ra.left + ra.width / 2 - box.left;
        const y1 = ra.top + ra.height / 2 - box.top;
        const x2 = rb.left + rb.width / 2 - box.left;
        const y2 = rb.top + rb.height / 2 - box.top;
        // A gentle bow keeps overlapping spokes distinguishable.
        const mx = (x1 + x2) / 2 - (y2 - y1) * 0.12;
        const my = (y1 + y2) / 2 + (x2 - x1) * 0.12;
        d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
      } else if (Math.abs(ra.top - rb.top) < 6) {
        const [l, r] = ra.left < rb.left ? [ra, rb] : [rb, ra];
        const x1 = l.right - box.left;
        const y1 = l.top + l.height / 2 - box.top;
        const x2 = r.left - box.left;
        const y2 = r.top + r.height / 2 - box.top;
        const bend = Math.max(16, (x2 - x1) / 2);
        d = `M${x1},${y1} C${x1 + bend},${y1} ${x2 - bend},${y2} ${x2},${y2}`;
      } else {
        const [t, btm] = ra.top < rb.top ? [ra, rb] : [rb, ra];
        const x1 = t.left + t.width / 2 - box.left;
        const y1 = t.bottom - box.top;
        const x2 = btm.left + btm.width / 2 - box.left;
        const y2 = btm.top - box.top;
        const my = (y1 + y2) / 2;
        d = `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
      }
      out.push({ key: `${a}->${b}`, from: a, to: b, d });
    }
    setPaths(out);
  }, [containerRef, pairs, mode]);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(root);
    document.fonts?.ready.then(compute);
    return () => ro.disconnect();
  }, [compute, containerRef]);

  return { paths, recompute: compute };
}

import { useRef, useState } from 'react';
import type { ArchitectureSpec } from '../../../content/types';
import { useConnectors } from '../../../hooks/useConnectors';
import { toneStyle } from '../../../lib/tones';
import { cn } from '../../../lib/utils';

/** Layered architecture diagram; connectors are measured from the live layout. */
export function ArchitectureDiagram({ spec }: { spec: ArchitectureSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const { paths } = useConnectors(ref, spec.edges);
  const [focus, setFocus] = useState<string | null>(null);
  const toneOf = (id: string) => `var(--${spec.layers.find((l) => l.nodes.some((n) => n.id === id))?.tone ?? 'systems'})`;
  const linked = (id: string) => !focus || focus === id || spec.edges.some(([a, b]) => (a === focus && b === id) || (b === focus && a === id));

  return (
    <figure>
      <div ref={ref} className="relative rounded-3xl border border-line bg-bg-raised p-4 sm:p-8">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {paths.map((p) => {
            const on = !focus || p.from === focus || p.to === focus;
            return (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                className={cn('transition-[stroke,opacity] duration-300', !(on && focus) && 'stroke-line-strong')}
                stroke={on && focus ? toneOf(focus) : undefined}
                strokeWidth={on && focus ? 1.5 : 1.25}
                strokeDasharray="4 5"
                opacity={on ? 1 : 0.25}
                style={{ animation: 'dash-flow 1.6s linear infinite' }}
              />
            );
          })}
        </svg>
        <ol className="relative flex flex-col gap-10 sm:gap-12">
          {spec.layers.map((layer, li) => (
            <li
              key={layer.label}
              style={toneStyle(layer.tone)}
              className="grid gap-3 sm:grid-cols-[7.5rem_1fr] sm:items-center sm:gap-6"
            >
              <span className="text-meta inline-flex items-center gap-2 text-faint">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-tone" />
                <span className="text-tone">0{li + 1}</span> {layer.label}
              </span>
              <ul className="flex flex-wrap justify-center gap-3 sm:gap-5">
                {layer.nodes.map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      data-node={node.id}
                      onPointerEnter={() => setFocus(node.id)}
                      onPointerLeave={() => setFocus(null)}
                      onFocus={() => setFocus(node.id)}
                      onBlur={() => setFocus(null)}
                      className={cn(
                        'relative z-10 rounded-xl border bg-surface px-4 py-2.5 text-left shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--tone)_35%,transparent)] transition-[border-color,opacity] duration-300',
                        focus === node.id ? 'border-tone' : 'border-line-strong hover:border-tone/50',
                        linked(node.id) ? 'opacity-100' : 'opacity-40',
                      )}
                    >
                      <span className="block text-sm font-medium text-ink">{node.label}</span>
                      {node.detail && <span className="text-label mt-0.5 block text-[0.75rem] text-faint">{node.detail}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="text-label mt-3 text-faint">{spec.caption} Hover or focus a component to trace its connections.</figcaption>
    </figure>
  );
}

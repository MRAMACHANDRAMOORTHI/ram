import type { Tone } from '../../../content/types';
import type { Sim, TicketState, TransitionKey } from './simulation';

const NODE_W = 104;
const NODE_H = 40;
const TOP = 96;
const BOTTOM = 182;
const half = NODE_W / 2;

const nodes: Record<TicketState, { x: number; y: number; label: string }> = {
  open: { x: 110, y: TOP, label: 'Open' },
  assigned: { x: 300, y: TOP, label: 'Assigned' },
  resolved: { x: 500, y: TOP, label: 'Resolved' },
  closed: { x: 676, y: TOP, label: 'Closed' },
  overdue: { x: 400, y: BOTTOM, label: 'Overdue' },
};

type Anchor = 'start' | 'middle' | 'end';
/** What drives each transition: a job (automation), a person (human) or a resolution (signal). */
const EDGE_TONE: Record<string, Tone> = {
  'new>open': 'human',
  'open>assigned': 'automation',
  'assigned>resolved': 'signal',
  'resolved>closed': 'automation',
  'assigned>overdue': 'systems',
  'overdue>resolved': 'signal',
  'resolved>assigned': 'human',
  'closed>assigned': 'human',
};

const NODE_TONE: Record<TicketState, Tone> = {
  open: 'human',
  assigned: 'automation',
  overdue: 'systems',
  resolved: 'signal',
  closed: 'data',
};

const edges: Array<{ key: TransitionKey; d: string; label: string; lx: number; ly: number; anchor: Anchor }> = [
  { key: 'new>open', d: `M14,${TOP} L${110 - half - 4},${TOP}`, label: 'new', lx: 14, ly: TOP - 8, anchor: 'start' },
  { key: 'open>assigned', d: `M${110 + half},${TOP} L${300 - half - 4},${TOP}`, label: 'round-robin', lx: 205, ly: TOP - 8, anchor: 'middle' },
  { key: 'assigned>resolved', d: `M${300 + half},${TOP} L${500 - half - 4},${TOP}`, label: 'resolve', lx: 400, ly: TOP - 8, anchor: 'middle' },
  { key: 'resolved>closed', d: `M${500 + half},${TOP} L${676 - half - 4},${TOP}`, label: 'auto-close', lx: 588, ly: TOP - 8, anchor: 'middle' },
  {
    key: 'assigned>overdue',
    d: `M300,${TOP + NODE_H / 2} C300,${BOTTOM} 320,${BOTTOM} ${400 - half - 4},${BOTTOM}`,
    label: 'SLA breach',
    lx: 292,
    ly: BOTTOM - 2,
    anchor: 'end',
  },
  {
    key: 'overdue>resolved',
    d: `M${400 + half},${BOTTOM} C480,${BOTTOM} 500,${BOTTOM} 500,${TOP + NODE_H / 2 + 4}`,
    label: 'resolve',
    lx: 510,
    ly: BOTTOM - 2,
    anchor: 'start',
  },
  {
    key: 'resolved>assigned',
    d: `M500,${TOP - NODE_H / 2} C500,${TOP - 62} 300,${TOP - 62} 300,${TOP - NODE_H / 2 - 4}`,
    label: 'reopen',
    lx: 400,
    ly: TOP - 58,
    anchor: 'middle',
  },
  {
    key: 'closed>assigned',
    d: `M676,${TOP - NODE_H / 2} C676,${TOP - 92} 312,${TOP - 92} 312,${TOP - NODE_H / 2 - 4}`,
    label: 'reopen',
    lx: 494,
    ly: TOP - 80,
    anchor: 'middle',
  },
];

export function StateDiagram({ sim, counts }: { sim: Sim; counts: Record<TicketState, number> }) {
  return (
    <svg viewBox="0 0 740 216" className="mx-auto h-auto w-full max-w-[820px] min-w-[600px]" role="img" aria-labelledby="fsm-title">
      <title id="fsm-title">
        Ticket state machine: open, assigned, overdue, resolved and closed, with reopen paths back to assigned.
      </title>
      <defs>
        <marker id="fsm-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" className="fill-line-strong" />
        </marker>
        {(['human', 'automation', 'signal', 'systems'] as Tone[]).map((t) => (
          <marker key={t} id={`fsm-arrow-${t}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" fill={`var(--${t})`} />
          </marker>
        ))}
      </defs>

      {edges.map((e) => {
        const hot = sim.flashes.includes(e.key);
        const tone = EDGE_TONE[e.key];
        return (
          <g key={e.key} style={{ ['--flash' as string]: `var(--${tone})` }}>
            <path
              key={hot ? `${e.key}-${sim.flashId}` : e.key}
              d={e.d}
              fill="none"
              className="stroke-line-strong"
              strokeWidth={1.25}
              markerEnd={`url(#${hot ? `fsm-arrow-${tone}` : 'fsm-arrow'})`}
              style={hot ? { animation: 'edge-flash 1.1s ease-out' } : undefined}
            />
            <text x={e.lx} y={e.ly} textAnchor={e.anchor} className="fill-faint font-mono text-[10px]">
              {e.label}
            </text>
          </g>
        );
      })}

      {(Object.keys(nodes) as TicketState[]).map((id) => {
        const n = nodes[id];
        const hot = sim.flashes.some((f) => f.endsWith(`>${id}`));
        return (
          <g key={id} transform={`translate(${n.x - half}, ${n.y - NODE_H / 2})`} style={{ ['--flash' as string]: `var(--${NODE_TONE[id]})` }}>
            <rect
              key={hot ? `hot-${sim.flashId}` : 'idle'}
              width={NODE_W}
              height={NODE_H}
              rx={11}
              className="fill-surface stroke-line-strong"
              strokeWidth={1}
              style={hot ? { animation: 'node-flash 1.2s ease-out' } : undefined}
            />
            <circle cx={12} cy={NODE_H / 2} r={3} fill={`var(--${NODE_TONE[id]})`} />
            <text x={22} y={NODE_H / 2 + 4} className="fill-ink text-[12.5px] font-medium">
              {n.label}
            </text>
            <text
              x={NODE_W - 14}
              y={NODE_H / 2 + 4}
              textAnchor="end"
              className={`font-mono text-[12px] ${id === 'overdue' && counts[id] > 0 ? 'fill-systems' : 'fill-muted'}`}
            >
              {counts[id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

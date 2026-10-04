import { m } from 'framer-motion';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useInViewport } from '../../../hooks/useInViewport';
import { useReducedMotion } from '../../../hooks/useMediaQuery';
import { EASE_OUT_EXPO } from '../../../lib/motion';
import { cn } from '../../../lib/utils';
import { Icon } from '../../primitives/Icon';
import { RoundRobinDial } from './RoundRobinDial';
import {
  EXECUTIVES,
  STATES,
  TIERS,
  formatClock,
  initialSim,
  simReducer,
  stats,
  type Ticket,
  type TicketState,
  type Tier,
} from './simulation';
import { StateDiagram } from './StateDiagram';

const SPEEDS = [1, 2, 4] as const;
const BASE_INTERVAL = 900;
const LANE_LIMIT = 5;

/** Interactive model of the Helpdesk ticket workflow. Lazy-loaded below the fold. */
export default function LifecycleSimulator() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, '-10% 0px');
  const [sim, dispatch] = useReducer(simReducer, undefined, initialSim);
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [announcement, setAnnouncement] = useState('');
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const sync = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    if (!playing || !inView || !tabVisible) return;
    const id = window.setInterval(
      () => dispatch({ type: 'tick', rand: Array.from({ length: 7 }, Math.random) }),
      BASE_INTERVAL / speed,
    );
    return () => window.clearInterval(id);
  }, [playing, inView, tabVisible, speed]);

  const counts = useMemo(() => {
    const c = { open: 0, assigned: 0, overdue: 0, resolved: 0, closed: 0 } as Record<TicketState, number>;
    for (const t of sim.tickets) c[t.state] += 1;
    return c;
  }, [sim.tickets]);
  const s = useMemo(() => stats(sim), [sim]);

  const act = (ticket: Ticket) => {
    if (ticket.state === 'assigned' || ticket.state === 'overdue') {
      dispatch({ type: 'resolve', id: ticket.id });
      setAnnouncement(`Ticket ${ticket.id} resolved.`);
    } else if (ticket.state === 'resolved' || ticket.state === 'closed') {
      dispatch({ type: 'reopen', id: ticket.id });
      setAnnouncement(`Ticket ${ticket.id} reopened and reassigned.`);
    }
  };

  const createTicket = (tier: Tier) => {
    dispatch({ type: 'create', tier });
    setAnnouncement(`New ticket with a ${tier} hour SLA created.`);
  };

  const fmtHours = (v: number | null) => (v === null ? '—' : `${v.toFixed(v % 1 ? 1 : 0)}h`);

  return (
    <div ref={ref} className="overflow-hidden rounded-[1.75rem] border border-line bg-bg-raised shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className={cn('status-dot', !playing && '[&::after]:hidden opacity-50')} aria-hidden="true" />
          <span className="text-meta text-ink">Ticket lifecycle · live model</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label mr-1 rounded-md bg-ink/5 px-2 py-1 text-muted tabular-nums" aria-label="Simulated time">
            {formatClock(sim.clock)}
          </span>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
            className="text-label inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-3.5 text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            <Icon name={playing ? 'pause' : 'play'} size={14} />
            {playing ? 'Pause' : 'Run'}
          </button>
          <div role="radiogroup" aria-label="Simulation speed" className="flex rounded-full border border-line p-0.5">
            {SPEEDS.map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={speed === v}
                onClick={() => setSpeed(v)}
                className={cn(
                  'text-label h-8 min-w-9 rounded-full px-2 transition-colors',
                  speed === v ? 'bg-ink text-bg' : 'text-muted hover:text-ink',
                )}
              >
                {v}×
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'reset' });
              setAnnouncement('Simulation reset.');
            }}
            aria-label="Reset simulation"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-ink/6 hover:text-ink"
          >
            <Icon name="reset" size={16} />
          </button>
        </div>
      </div>

      {/* State machine + background jobs */}
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="no-scrollbar overflow-x-auto border-b border-line px-4 pt-5 pb-3 sm:px-6 lg:border-r lg:border-b-0">
          <StateDiagram sim={sim} counts={counts} />
        </div>
        <div className="flex flex-col gap-6 p-4 sm:p-6">
          <div>
            <h4 className="text-meta text-faint">Background jobs</h4>
            <div className="mt-3 flex flex-col gap-2">
              <JobSwitch
                label="Round-robin assigner"
                on={sim.assigner}
                onToggle={() => {
                  dispatch({ type: 'toggle', job: 'assigner' });
                  setAnnouncement(`Assigner job ${sim.assigner ? 'stopped' : 'started'}.`);
                }}
              />
              <JobSwitch
                label="SLA escalation"
                on={sim.slaJob}
                onToggle={() => {
                  dispatch({ type: 'toggle', job: 'slaJob' });
                  setAnnouncement(`SLA job ${sim.slaJob ? 'stopped' : 'started'}.`);
                }}
              />
            </div>
            {s.silentBreaches > 0 && (!sim.slaJob || !sim.assigner) && (
              <p className="text-label mt-3 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-accent">
                {s.silentBreaches} late ticket{s.silentBreaches > 1 ? 's' : ''} nobody has been told about.
              </p>
            )}
          </div>
          <RoundRobinDial assignments={sim.assignments} pointer={sim.pointer} load={s.load} />
        </div>
      </div>

      {/* Lanes */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto border-b border-line p-4 sm:p-6">
        {STATES.map((state) => {
          const items = sim.tickets.filter((t) => t.state === state.id);
          const shown = items.slice(-LANE_LIMIT).reverse();
          return (
            <section key={state.id} aria-label={`${state.label} tickets`} className="w-[9.75rem] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:flex-1">
              <h4 className="text-meta flex items-center justify-between pb-3 text-faint">
                <span className={state.id === 'overdue' && items.length ? 'text-accent' : undefined}>{state.label}</span>
                <span className="tabular-nums">{items.length}</span>
              </h4>
              <ul className="flex min-h-[15rem] flex-col gap-2 rounded-xl bg-ink/[0.025] p-1.5">
                {shown.map((t) => (
                  <TicketChip key={`${t.id}-${t.state}`} ticket={t} clock={sim.clock} reduced={reduced} onAct={() => act(t)} />
                ))}
                {items.length > LANE_LIMIT && <li className="text-label px-2 py-1 text-faint">+{items.length - LANE_LIMIT} more</li>}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Create · stats · log */}
      <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-[auto_18rem_minmax(0,1fr)] xl:gap-10">
        <div>
          <h4 className="text-meta text-faint">Raise a ticket</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => createTicket(tier)}
                className="text-label inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-ink transition-colors hover:border-human hover:bg-human hover:text-bg"
              >
                <Icon name="plus" size={14} /> SLA {tier}h
              </button>
            ))}
          </div>
          <p className="text-label mt-3 max-w-xs text-faint">Click any ticket to resolve it — or reopen it once solved.</p>
        </div>

        <div>
          <h4 className="text-meta text-faint">Resolution stats</h4>
          <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {[
              ['Mean', fmtHours(s.mean)],
              ['Median', fmtHours(s.median)],
              ['Mode', fmtHours(s.mode)],
              ['SLA met', s.slaMet === null ? '—' : `${Math.round(s.slaMet * 100)}%`],
              ['Escalated', String(sim.escalated)],
              ['Reopened', String(sim.reopened)],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg-raised px-3 py-2.5">
                <dt className="text-meta text-[0.625rem] text-faint">{k}</dt>
                <dd className="mt-0.5 text-[1.0625rem] font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 md:col-span-2 xl:col-span-1">
          <h4 className="text-meta text-faint">Event log</h4>
          <ol className="text-label mt-3 space-y-1.5" aria-live="off">
            {sim.log.length === 0 && <li className="text-faint">Waiting for the next tick…</li>}
            {sim.log.map((e, i) => (
              <li
                key={e.id}
                className={cn(
                  'flex gap-3 truncate',
                  e.tone === 'accent' && 'text-accent',
                  e.tone === 'signal' && 'text-signal',
                  e.tone === 'neutral' && 'text-muted',
                )}
                style={{ opacity: 1 - i * 0.14 }}
              >
                <span className="shrink-0 text-faint tabular-nums">{formatClock(e.at)}</span>
                <span className="truncate">{e.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

function JobSwitch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex items-center justify-between gap-4 rounded-lg px-1 py-1 text-left text-sm text-ink"
    >
      {label}
      <span className={cn('relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-300', on ? 'border-signal bg-signal-soft' : 'border-line-strong bg-ink/5')}>
        <span
          className={cn(
            'absolute top-[3px] left-[3px] size-4 rounded-full transition-[translate,background-color] duration-300 ease-out-expo',
            on ? 'translate-x-4 bg-signal' : 'bg-faint',
          )}
        />
      </span>
    </button>
  );
}

function TicketChip({ ticket, clock, reduced, onAct }: { ticket: Ticket; clock: number; reduced: boolean; onAct: () => void }) {
  const done = ticket.state === 'resolved' || ticket.state === 'closed';
  const remaining = Math.max(0, Math.min(1, (ticket.due - clock) / ticket.tier));
  const late = !done && clock > ticket.due;
  const owner = ticket.owner === null ? 'unassigned' : EXECUTIVES[ticket.owner];
  const action = done ? 'reopen' : ticket.state === 'open' ? null : 'resolve';
  const label = `Ticket ${ticket.id}, ${ticket.tier} hour SLA, ${owner}${late ? ', past deadline' : ''}.${action ? ` Activate to ${action}.` : ''}`;

  return (
    <m.li
      initial={reduced ? false : { opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
    >
      <button
        type="button"
        onClick={onAct}
        disabled={!action}
        aria-label={label}
        title={action ? `Click to ${action}` : 'Waiting for the assigner'}
        className={cn(
          'w-full rounded-lg border bg-surface px-2.5 py-2 text-left transition-colors duration-300 disabled:cursor-default',
          late || ticket.state === 'overdue' ? 'border-accent/45' : 'border-line',
          action && 'hover:border-ink/40',
        )}
      >
        <span className="text-label flex items-center justify-between text-[0.75rem]">
          <span className="text-ink">#{ticket.id}</span>
          <span className="text-faint">
            {ticket.reopened > 0 && <span className="mr-1 text-accent">↺</span>}
            {ticket.tier}h
          </span>
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              'grid size-5 shrink-0 place-items-center rounded-full text-[0.625rem] font-semibold',
              ticket.owner === null ? 'border border-dashed border-line-strong text-faint' : 'bg-ink text-bg',
            )}
          >
            {ticket.owner === null ? '?' : EXECUTIVES[ticket.owner].slice(-1)}
          </span>
          {done ? (
            <span className={cn('text-label text-[0.6875rem]', ticket.breached ? 'text-accent' : 'text-signal')}>
              {ticket.breached ? 'late' : 'in SLA'}
            </span>
          ) : (
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-ink/8">
              <span
                className={cn('block h-full rounded-full transition-[width] duration-700', late ? 'bg-accent' : remaining < 0.4 ? 'bg-accent/70' : 'bg-signal')}
                style={{ width: `${late ? 100 : remaining * 100}%` }}
              />
            </span>
          )}
        </span>
      </button>
    </m.li>
  );
}

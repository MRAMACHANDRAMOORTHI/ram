/**
 * A simplified, deterministic model of a support-ticket workflow:
 * explicit states, a round-robin assigner job, an SLA job that escalates
 * breaches, and resolution statistics. Randomness is injected via actions
 * so the reducer stays pure.
 */

export type TicketState = 'open' | 'assigned' | 'overdue' | 'resolved' | 'closed';

export const STATES: Array<{ id: TicketState; label: string }> = [
  { id: 'open', label: 'Open' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
];

export const EXECUTIVES = ['Exec A', 'Exec B', 'Exec C', 'Exec D'];
export const TIERS = [4, 8, 12] as const;
export type Tier = (typeof TIERS)[number];

const AUTO_CLOSE_AFTER = 6;
const MAX_CLOSED = 6;
const MAX_LOG = 6;

export interface Ticket {
  id: number;
  tier: Tier;
  created: number;
  due: number;
  state: TicketState;
  owner: number | null;
  resolvedAt: number | null;
  breached: boolean;
  reopened: number;
}

export interface SimEvent {
  id: number;
  at: number;
  text: string;
  tone: 'neutral' | 'accent' | 'signal';
}

export type TransitionKey = `${TicketState | 'new'}>${TicketState}`;

export interface Sim {
  clock: number;
  seq: number;
  tickets: Ticket[];
  pointer: number;
  log: SimEvent[];
  resolutions: Array<{ hours: number; breached: boolean }>;
  escalated: number;
  reopened: number;
  assigner: boolean;
  slaJob: boolean;
  flashes: TransitionKey[];
  flashId: number;
  eventSeq: number;
  /** Total assignments ever made — drives the round-robin dial. */
  assignments: number;
}

export type SimAction =
  | { type: 'tick'; rand: number[] }
  | { type: 'create'; tier: Tier }
  | { type: 'resolve'; id: number }
  | { type: 'reopen'; id: number }
  | { type: 'toggle'; job: 'assigner' | 'slaJob' }
  | { type: 'reset' };

export function initialSim(): Sim {
  let sim: Sim = {
    clock: 9,
    seq: 1040,
    tickets: [],
    pointer: 0,
    log: [],
    resolutions: [],
    escalated: 0,
    reopened: 0,
    assigner: true,
    slaJob: true,
    flashes: [],
    flashId: 0,
    eventSeq: 0,
    assignments: 0,
  };
  // Seed a believable mid-morning queue.
  for (const tier of [8, 4, 12, 8] as Tier[]) sim = create(sim, tier, false);
  sim = assign(sim);
  return { ...sim, log: [], flashes: [] };
}

const fmt = (h: number) => `D${Math.floor(h / 24) + 1} ${String(h % 24).padStart(2, '0')}:00`;
export const formatClock = fmt;

function pushLog(sim: Sim, text: string, tone: SimEvent['tone'] = 'neutral'): Sim {
  const event = { id: sim.eventSeq + 1, at: sim.clock, text, tone };
  return { ...sim, eventSeq: event.id, log: [event, ...sim.log].slice(0, MAX_LOG) };
}

function flash(sim: Sim, key: TransitionKey): Sim {
  return sim.flashes.includes(key) ? sim : { ...sim, flashes: [...sim.flashes, key] };
}

function create(sim: Sim, tier: Tier, log = true): Sim {
  const id = sim.seq + 1;
  const ticket: Ticket = {
    id,
    tier,
    created: sim.clock,
    due: sim.clock + tier,
    state: 'open',
    owner: null,
    resolvedAt: null,
    breached: false,
    reopened: 0,
  };
  let next: Sim = { ...sim, seq: id, tickets: [...sim.tickets, ticket] };
  next = flash(next, 'new>open');
  return log ? pushLog(next, `#${id} opened · SLA ${tier}h`) : next;
}

function update(sim: Sim, id: number, patch: Partial<Ticket>): Sim {
  return { ...sim, tickets: sim.tickets.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
}

/** Round-robin assigner job: every open ticket gets the next executive in turn. */
function assign(sim: Sim): Sim {
  if (!sim.assigner) return sim;
  let next = sim;
  for (const t of sim.tickets) {
    if (t.state !== 'open') continue;
    const owner = next.pointer;
    next = update(next, t.id, { state: 'assigned', owner });
    next = { ...next, pointer: (owner + 1) % EXECUTIVES.length, assignments: next.assignments + 1 };
    next = flash(next, 'open>assigned');
    next = pushLog(next, `#${t.id} → ${EXECUTIVES[owner]} (round-robin)`);
  }
  return next;
}

/** SLA job: flags late tickets and escalates them. */
function enforceSla(sim: Sim): Sim {
  let next = sim;
  for (const t of sim.tickets) {
    const live = t.state === 'assigned' || t.state === 'open';
    if (!live || sim.clock <= t.due) continue;
    if (!t.breached) next = update(next, t.id, { breached: true });
    if (sim.slaJob && t.state === 'assigned') {
      next = update(next, t.id, { state: 'overdue' });
      next = { ...next, escalated: next.escalated + 1 };
      next = flash(next, 'assigned>overdue');
      next = pushLog(next, `#${t.id} breached ${t.tier}h SLA → escalated`, 'accent');
    }
  }
  return next;
}

function resolve(sim: Sim, id: number): Sim {
  const t = sim.tickets.find((x) => x.id === id);
  if (!t || (t.state !== 'assigned' && t.state !== 'overdue')) return sim;
  const hours = Math.max(1, sim.clock - t.created);
  const breached = t.breached || sim.clock > t.due;
  let next = update(sim, id, { state: 'resolved', resolvedAt: sim.clock, breached });
  next = { ...next, resolutions: [...next.resolutions, { hours, breached }].slice(-60) };
  next = flash(next, `${t.state}>resolved`);
  return pushLog(next, `#${id} resolved by ${EXECUTIVES[t.owner ?? 0]} in ${hours}h`, 'signal');
}

function reopen(sim: Sim, id: number): Sim {
  const t = sim.tickets.find((x) => x.id === id);
  if (!t || (t.state !== 'resolved' && t.state !== 'closed')) return sim;
  let next = update(sim, id, {
    state: 'assigned',
    resolvedAt: null,
    reopened: t.reopened + 1,
    created: sim.clock,
    due: sim.clock + t.tier,
    breached: false,
  });
  next = { ...next, reopened: next.reopened + 1 };
  next = flash(next, `${t.state}>assigned`);
  return pushLog(next, `#${id} reopened → back to ${EXECUTIVES[t.owner ?? 0]}`);
}

function autoClose(sim: Sim): Sim {
  let next = sim;
  for (const t of sim.tickets) {
    if (t.state === 'resolved' && t.resolvedAt !== null && sim.clock - t.resolvedAt >= AUTO_CLOSE_AFTER) {
      next = update(next, t.id, { state: 'closed' });
      next = flash(next, 'resolved>closed');
    }
  }
  // Keep memory bounded: forget the oldest closed tickets.
  const closed = next.tickets.filter((t) => t.state === 'closed');
  if (closed.length > MAX_CLOSED) {
    const drop = new Set(closed.slice(0, closed.length - MAX_CLOSED).map((t) => t.id));
    next = { ...next, tickets: next.tickets.filter((t) => !drop.has(t.id)) };
  }
  return next;
}

function tick(sim: Sim, rand: number[]): Sim {
  let next: Sim = { ...sim, clock: sim.clock + 1, flashes: [], flashId: sim.flashId + 1 };
  const backlog = next.tickets.filter((t) => t.state !== 'resolved' && t.state !== 'closed').length;

  // Incoming traffic, thinned when the queue is long.
  if (rand[0] < (backlog > 10 ? 0.25 : 0.55)) next = create(next, TIERS[Math.floor(rand[1] * TIERS.length)]);

  next = assign(next);
  next = enforceSla(next);

  // Each executive may finish one ticket per hour — escalated work first.
  EXECUTIVES.forEach((_, exec) => {
    if (rand[2 + exec] > 0.32) return;
    const mine = next.tickets.filter((t) => t.owner === exec && (t.state === 'overdue' || t.state === 'assigned'));
    const pick = mine.find((t) => t.state === 'overdue') ?? mine[0];
    if (pick) next = resolve(next, pick.id);
  });

  // Occasionally a customer replies to a solved ticket.
  if (rand[6] < 0.05) {
    const candidate = [...next.tickets].reverse().find((t) => t.state === 'resolved' || t.state === 'closed');
    if (candidate) next = reopen(next, candidate.id);
  }

  return autoClose(next);
}

export function simReducer(sim: Sim, action: SimAction): Sim {
  switch (action.type) {
    case 'tick':
      return tick(sim, action.rand);
    case 'create':
      return assign({ ...create({ ...sim, flashes: [], flashId: sim.flashId + 1 }, action.tier) });
    case 'resolve':
      return resolve({ ...sim, flashes: [], flashId: sim.flashId + 1 }, action.id);
    case 'reopen':
      return assign(reopen({ ...sim, flashes: [], flashId: sim.flashId + 1 }, action.id));
    case 'toggle': {
      const next = { ...sim, [action.job]: !sim[action.job] };
      const label = action.job === 'assigner' ? 'Assigner job' : 'SLA job';
      return pushLog(next, `${label} ${next[action.job] ? 'started' : 'stopped'}`, next[action.job] ? 'signal' : 'accent');
    }
    case 'reset':
      return initialSim();
  }
}

export interface SimStats {
  mean: number | null;
  median: number | null;
  mode: number | null;
  slaMet: number | null;
  silentBreaches: number;
  load: number[];
}

export function stats(sim: Sim): SimStats {
  const hours = sim.resolutions.map((r) => r.hours).sort((a, b) => a - b);
  const n = hours.length;
  let mode: number | null = null;
  if (n) {
    const freq = new Map<number, number>();
    let best = 0;
    for (const h of hours) {
      const f = (freq.get(h) ?? 0) + 1;
      freq.set(h, f);
      if (f > best || (f === best && mode !== null && h < mode)) {
        best = f;
        mode = h;
      }
    }
  }
  const load = EXECUTIVES.map(
    (_, i) => sim.tickets.filter((t) => t.owner === i && (t.state === 'assigned' || t.state === 'overdue')).length,
  );
  return {
    mean: n ? hours.reduce((a, b) => a + b, 0) / n : null,
    median: n ? (n % 2 ? hours[(n - 1) / 2] : (hours[n / 2 - 1] + hours[n / 2]) / 2) : null,
    mode,
    slaMet: n ? sim.resolutions.filter((r) => !r.breached).length / n : null,
    silentBreaches: sim.tickets.filter((t) => (t.state === 'assigned' || t.state === 'open') && sim.clock > t.due).length,
    load,
  };
}

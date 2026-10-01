/**
 * A dependency-free 3D renderer for the hero: four architecture layers
 * (Interface → Application → Domain → Data) stacked in perspective, with
 * request/response packets tracing the real paths of past projects.
 *
 * Canvas 2D + manual projection keeps it ~10 KB, 60 fps on low-end devices,
 * and free of a WebGL context.
 */

export interface ScenePalette {
  mode: 'dark' | 'light';
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  signal: string;
}

export interface SceneFocus {
  title: string;
  detail: string;
  source: 'tour' | 'hover';
}

interface NodeDef {
  id: string;
  label: string;
  layer: number;
  x: number;
  z: number;
  side: 1 | -1;
}

interface FlowDef {
  context: string;
  path: string[];
}

interface Packet {
  path: number[];
  seg: number;
  t: number;
  dir: 1 | -1;
  speed: number;
}

export const LAYERS = ['Interface', 'Application', 'Domain', 'Data'];

const NODES: NodeDef[] = [
  { id: 'vue', label: 'Vue 3', layer: 0, x: -66, z: -22, side: -1 },
  { id: 'react', label: 'React', layer: 0, x: 34, z: 44, side: 1 },
  { id: 'thymeleaf', label: 'Thymeleaf', layer: 0, x: 98, z: -38, side: 1 },
  { id: 'phoenix', label: 'Phoenix', layer: 1, x: -74, z: -12, side: -1 },
  { id: 'node', label: 'Node.js', layer: 1, x: 30, z: 50, side: 1 },
  { id: 'spring', label: 'Spring Boot', layer: 1, x: 94, z: -34, side: 1 },
  { id: 'fsm', label: 'Ticket FSM', layer: 2, x: -104, z: -48, side: -1 },
  { id: 'rr', label: 'Round-robin', layer: 2, x: -92, z: 46, side: -1 },
  { id: 'sla', label: 'SLA jobs', layer: 2, x: -20, z: -6, side: 1 },
  { id: 'web3j', label: 'Web3j', layer: 2, x: 108, z: 14, side: 1 },
  { id: 'postgres', label: 'PostgreSQL', layer: 3, x: -66, z: -8, side: -1 },
  { id: 'firebase', label: 'Firebase', layer: 3, x: 26, z: 56, side: 1 },
  { id: 'mysql', label: 'MySQL', layer: 3, x: 86, z: -54, side: 1 },
  { id: 'contract', label: 'Smart contract', layer: 3, x: 112, z: 28, side: 1 },
];

const CONTEXTS: Record<string, string> = {
  helpdesk: 'Helpdesk · Ardhika',
  cict: 'E-Learning · CICT',
  healthchain: 'HealthChain',
  retech: 'REST APIs · RETECH',
};

const FLOWS: FlowDef[] = [
  { context: 'helpdesk', path: ['vue', 'phoenix', 'fsm', 'postgres'] },
  { context: 'helpdesk', path: ['vue', 'phoenix', 'rr', 'postgres'] },
  { context: 'helpdesk', path: ['sla', 'fsm', 'postgres'] },
  { context: 'cict', path: ['react', 'node', 'firebase'] },
  { context: 'cict', path: ['react', 'firebase'] },
  { context: 'healthchain', path: ['thymeleaf', 'spring', 'mysql'] },
  { context: 'healthchain', path: ['thymeleaf', 'spring', 'web3j', 'contract'] },
  { context: 'retech', path: ['spring', 'mysql'] },
];

const TOUR = ['helpdesk', 'cict', 'healthchain'];
const TOUR_PATHS: Record<string, string> = {
  helpdesk: 'Vue 3 → Phoenix → Ticket FSM · SLA jobs · Round-robin → PostgreSQL',
  cict: 'React → Node.js → Firebase Auth & Realtime DB',
  healthchain: 'Thymeleaf → Spring Boot → MySQL · Web3j → Smart contract',
};

const W = 290;
const D = 150;
const FOCAL = 950;
const BASE_YAW = -0.58;
const BASE_PITCH = 0.5;
const BASE_GAP = 74;
const TOUR_MS = 4600;
const SEGMENT_TIME = 0.62;

const nodeIndex = new Map(NODES.map((n, i) => [n.id, i]));

// Unique edges from every flow, bucketed by their lower (deeper) layer for painter's ordering.
const EDGES: Array<[number, number]> = [];
{
  const seen = new Set<string>();
  for (const flow of FLOWS) {
    for (let i = 0; i < flow.path.length - 1; i++) {
      const a = nodeIndex.get(flow.path[i])!;
      const b = nodeIndex.get(flow.path[i + 1])!;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        EDGES.push([a, b]);
      }
    }
  }
}
const edgeLayer = (e: [number, number]) => Math.max(NODES[e[0]].layer, NODES[e[1]].layer);
const nodeContexts = NODES.map((n) => [...new Set(FLOWS.filter((f) => f.path.includes(n.id)).map((f) => f.context))]);

function makeGlow(color: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  g.globalAlpha = 0.9;
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export class StackScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private palette: ScenePalette;
  private glowAccent: HTMLCanvasElement;
  private glowSignal: HTMLCanvasElement;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private k = 1;
  private cx = 0;
  private cy = 0;
  private compact = false;

  private yaw = BASE_YAW;
  private pitch = BASE_PITCH;
  private pointerX = 0;
  private pointerY = 0;
  private scroll = 0;
  private entrance = 0;
  private entranceStart = -1;

  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;
  private reduced = false;
  private drewFirstFrame = false;

  private packets: Packet[] = [];
  private spawnIn = 0;
  private pulses = new Float32Array(NODES.length);

  private hovered = -1;
  private tourIndex = 0;
  private tourElapsed = 0;
  private activeNodes = new Uint8Array(NODES.length);
  private activeEdges = new Uint8Array(EDGES.length);
  private focusStrength = 0.4;
  private activeContexts: string[] = [];

  // Projection cache for nodes (screen space) — reused every frame.
  private nx = new Float32Array(NODES.length);
  private ny = new Float32Array(NODES.length);
  private ns = new Float32Array(NODES.length);
  private cosY = 1;
  private sinY = 0;
  private cosP = 1;
  private sinP = 0;
  private px = 0;
  private py = 0;
  private ps = 1;

  // Label layout (collision-avoided each frame).
  private labelFont = 0;
  private labelW = new Float32Array(NODES.length);
  private labelX = new Float32Array(NODES.length);
  private labelY = new Float32Array(NODES.length);
  private labelDim = new Uint8Array(NODES.length);
  private rects = new Float32Array(NODES.length * 8);
  private order = NODES.map((_, i) => i);

  onFocus?: (focus: SceneFocus) => void;
  onFirstFrame?: () => void;

  constructor(canvas: HTMLCanvasElement, palette: ScenePalette) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.palette = palette;
    this.glowAccent = makeGlow(palette.accent);
    this.glowSignal = makeGlow(palette.signal);
    this.applyFocus();
  }

  /* ----------------------------- public API ----------------------------- */

  setSize(width: number, height: number, dpr: number) {
    this.w = width;
    this.h = height;
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.compact = width < 520;
    // Fit the stack with room for layer labels on the left and node labels on the right.
    this.k = Math.min(width / (this.compact ? 500 : 520), height / 430);
    this.cx = width * (this.compact ? 0.62 : 0.55);
    this.cy = height * 0.5;
    this.requestStaticFrame();
  }

  setPalette(palette: ScenePalette) {
    this.palette = palette;
    this.glowAccent = makeGlow(palette.accent);
    this.glowSignal = makeGlow(palette.signal);
    this.requestStaticFrame();
  }

  setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
  }

  setScroll(progress: number) {
    this.scroll = progress;
    this.requestStaticFrame();
  }

  setReducedMotion(reduced: boolean) {
    this.reduced = reduced;
    if (reduced) {
      this.entrance = 1;
      this.stop();
      this.seedStaticPackets();
      this.render();
    }
  }

  /** Begin the assemble animation (called when the loader leaves). */
  playEntrance() {
    if (this.reduced) return;
    this.entranceStart = this.time;
  }

  start() {
    if (this.running || this.reduced) {
      if (this.reduced) this.render();
      return;
    }
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.update(dt);
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.onFocus = undefined;
    this.onFirstFrame = undefined;
  }

  /** Hit-test in CSS pixels; returns true when a node is under the pointer. */
  hover(x: number | null, y: number | null) {
    let hit = -1;
    if (x !== null && y !== null) {
      let best = (this.compact ? 30 : 24) ** 2;
      for (let i = 0; i < NODES.length; i++) {
        const dx = this.nx[i] - x;
        const dy = this.ny[i] - y;
        const d = dx * dx + dy * dy;
        if (d < best) {
          best = d;
          hit = i;
        }
      }
    }
    if (hit !== this.hovered) {
      this.hovered = hit;
      if (hit < 0) this.tourElapsed = 0;
      this.applyFocus();
      this.requestStaticFrame();
    }
    return hit >= 0;
  }

  /* ------------------------------ simulation ---------------------------- */

  private update(dt: number) {
    this.time += dt;

    if (this.entranceStart >= 0 && this.entrance < 1) {
      this.entrance = Math.min(1, (this.time - this.entranceStart) / 1.9);
    }

    // Ease the camera toward pointer + idle drift + scroll tilt.
    const drift = Math.sin(this.time * 0.17) * 0.09;
    const targetYaw = BASE_YAW + this.pointerX * 0.3 + drift + this.scroll * 0.45;
    const targetPitch = BASE_PITCH + this.pointerY * 0.1 + this.scroll * 0.22;
    const ease = 1 - Math.exp(-dt * 3.2);
    this.yaw += (targetYaw - this.yaw) * ease;
    this.pitch += (targetPitch - this.pitch) * ease;

    // Guided tour through project paths while nothing is hovered.
    if (this.hovered < 0 && this.entrance >= 1) {
      this.tourElapsed += dt * 1000;
      if (this.tourElapsed > TOUR_MS) {
        this.tourElapsed = 0;
        this.tourIndex = (this.tourIndex + 1) % TOUR.length;
        this.applyFocus();
      }
    }

    for (let i = 0; i < this.pulses.length; i++) this.pulses[i] = Math.max(0, this.pulses[i] - dt * 1.6);

    if (this.entrance > 0.75) {
      this.spawnIn -= dt;
      if (this.spawnIn <= 0 && this.packets.length < 14) {
        this.spawnPacket();
        this.spawnIn = 0.38 + Math.random() * 0.3;
      }
    }

    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.t += (dt * p.speed) / SEGMENT_TIME;
      if (p.t >= 1) {
        p.t = 0;
        p.seg += 1;
        this.pulses[p.path[p.seg]] = 1;
        if (p.seg >= p.path.length - 1) {
          if (p.dir === 1) {
            p.path = [...p.path].reverse();
            p.seg = 0;
            p.dir = -1;
          } else {
            this.packets.splice(i, 1);
          }
        }
      }
    }
  }

  private spawnPacket() {
    const favoured = FLOWS.filter((f) => this.activeContexts.includes(f.context));
    const pool = favoured.length && Math.random() < 0.8 ? favoured : FLOWS;
    const flow = pool[Math.floor(Math.random() * pool.length)];
    this.packets.push({
      path: flow.path.map((id) => nodeIndex.get(id)!),
      seg: 0,
      t: 0,
      dir: 1,
      speed: 0.85 + Math.random() * 0.4,
    });
  }

  private seedStaticPackets() {
    this.packets = FLOWS.filter((_, i) => i % 2 === 0).map((f, i) => ({
      path: f.path.map((id) => nodeIndex.get(id)!),
      seg: 0,
      t: 0.35 + (i % 3) * 0.2,
      dir: i % 2 === 0 ? 1 : -1,
      speed: 1,
    }));
  }

  /** Re-emit the current focus (e.g. after a listener attaches). */
  refreshFocus() {
    this.applyFocus();
  }

  private applyFocus() {
    this.activeNodes.fill(0);
    this.activeEdges.fill(0);
    let contexts: string[];
    let focus: SceneFocus;

    if (this.hovered >= 0) {
      const node = NODES[this.hovered];
      contexts = nodeContexts[this.hovered];
      this.focusStrength = 0.2;
      focus = {
        title: node.label,
        detail: `${LAYERS[node.layer]} layer · ${contexts.map((c) => CONTEXTS[c]).join(', ')}`,
        source: 'hover',
      };
    } else {
      const context = TOUR[this.tourIndex];
      contexts = [context];
      this.focusStrength = 0.38;
      focus = { title: CONTEXTS[context], detail: TOUR_PATHS[context], source: 'tour' };
    }

    this.activeContexts = contexts;
    for (const flow of FLOWS) {
      if (!contexts.includes(flow.context)) continue;
      for (let i = 0; i < flow.path.length; i++) {
        const a = nodeIndex.get(flow.path[i])!;
        this.activeNodes[a] = 1;
        if (i < flow.path.length - 1) {
          const b = nodeIndex.get(flow.path[i + 1])!;
          const e = EDGES.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));
          if (e >= 0) this.activeEdges[e] = 1;
        }
      }
    }
    this.onFocus?.(focus);
  }

  /* ------------------------------- render ------------------------------- */

  private requestStaticFrame() {
    if (!this.running && this.w > 0) this.render();
  }

  private gap() {
    const e = this.reduced ? 1 : easeOutExpo(this.entrance);
    return BASE_GAP * e + this.scroll * 44;
  }

  private layerY(layer: number) {
    return (1.5 - layer) * this.gap();
  }

  private layerAlpha(layer: number) {
    if (this.reduced) return 1;
    const start = 0.08 * (3 - layer);
    return clamp01((this.entrance - start) / 0.4);
  }

  private project(x: number, y: number, z: number) {
    const x1 = x * this.cosY + z * this.sinY;
    const z1 = -x * this.sinY + z * this.cosY;
    const y2 = y * this.cosP - z1 * this.sinP;
    const z2 = y * this.sinP + z1 * this.cosP;
    const s = FOCAL / (FOCAL - z2);
    this.px = this.cx + x1 * s * this.k;
    this.py = this.cy - y2 * s * this.k;
    this.ps = s;
  }

  private render() {
    const { ctx, palette } = this;
    const dark = palette.mode === 'dark';
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    if (this.w === 0) return;

    this.cosY = Math.cos(this.yaw);
    this.sinY = Math.sin(this.yaw);
    this.cosP = Math.cos(this.pitch);
    this.sinP = Math.sin(this.pitch);

    // Project all nodes once per frame.
    for (let i = 0; i < NODES.length; i++) {
      const n = NODES[i];
      this.project(n.x, this.layerY(n.layer), n.z);
      this.nx[i] = this.px;
      this.ny[i] = this.py;
      this.ns[i] = this.ps;
    }

    const fontSize = this.compact ? 9.5 : 10.5;
    ctx.font = `500 ${fontSize}px "Geist Mono Variable", ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    this.placeLabels(fontSize);

    // Painter's order: deepest layer first so upper planes frost what's beneath.
    for (let layer = LAYERS.length - 1; layer >= 0; layer--) {
      const alpha = this.layerAlpha(layer);
      if (alpha <= 0) continue;
      this.drawPlane(layer, alpha, dark);
      this.drawEdges(layer, alpha, dark);
      this.drawPackets(layer, alpha, dark);
      this.drawNodes(layer, alpha, dark);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (!this.drewFirstFrame) {
      this.drewFirstFrame = true;
      this.onFirstFrame?.();
    }
  }

  /** Greedy label placement: active nodes first, preferred side, then the alternatives. */
  private placeLabels(fontSize: number) {
    const { ctx } = this;
    if (this.labelFont !== fontSize) {
      for (let i = 0; i < NODES.length; i++) this.labelW[i] = ctx.measureText(NODES[i].label).width;
      this.labelFont = fontSize;
    }
    this.order.sort((a, b) => this.activeNodes[b] - this.activeNodes[a] || NODES[a].layer - NODES[b].layer);

    // Obstacles: every node dot, then each label as it is placed.
    let count = 0;
    const rects = this.rects;
    const push = (x1: number, y1: number, x2: number, y2: number) => {
      rects[count * 4] = x1;
      rects[count * 4 + 1] = y1;
      rects[count * 4 + 2] = x2;
      rects[count * 4 + 3] = y2;
      count++;
    };
    for (let i = 0; i < NODES.length; i++) push(this.nx[i] - 6, this.ny[i] - 6, this.nx[i] + 6, this.ny[i] + 6);
    const hits = (x1: number, y1: number, x2: number, y2: number, self: number) => {
      for (let r = 0; r < count; r++) {
        if (r === self) continue;
        if (x1 < rects[r * 4 + 2] + 3 && x2 > rects[r * 4] - 3 && y1 < rects[r * 4 + 3] + 2 && y2 > rects[r * 4 + 1] - 2) return true;
      }
      return false;
    };

    const h = fontSize + 2;
    for (const i of this.order) {
      const x = this.nx[i];
      const y = this.ny[i];
      const r = 9 * this.ns[i] * Math.max(0.85, this.k) + 2;
      const w = this.labelW[i];
      const right = x + r;
      const left = x - r - w;
      const side = NODES[i].side;
      const candidates = [
        [side === 1 ? right : left, y - h / 2],
        [side === 1 ? left : right, y - h / 2],
        [x - w / 2, y - r - h],
        [x - w / 2, y + r],
      ];
      let pick = candidates[0];
      let dim = 1;
      for (const c of candidates) {
        const inside = c[0] >= 4 && c[0] + w <= this.w - 4;
        if (inside && !hits(c[0], c[1], c[0] + w, c[1] + h, i)) {
          pick = c;
          dim = 0;
          break;
        }
      }
      this.labelX[i] = pick[0];
      this.labelY[i] = pick[1] + h / 2;
      this.labelDim[i] = dim;
      push(pick[0], pick[1], pick[0] + w, pick[1] + h);
    }
  }

  private drawPlane(layer: number, alpha: number, dark: boolean) {
    const { ctx, palette } = this;
    const y = this.layerY(layer);
    const hw = W / 2;
    const hd = D / 2;
    const corners: Array<[number, number]> = [];
    for (const [x, z] of [
      [-hw, -hd],
      [hw, -hd],
      [hw, hd],
      [-hw, hd],
    ]) {
      this.project(x, y, z);
      corners.push([this.px, this.py]);
    }

    ctx.beginPath();
    ctx.moveTo(corners[0][0], corners[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
    ctx.closePath();

    // Frosted fill.
    ctx.globalAlpha = alpha * (dark ? 0.62 : 0.66);
    ctx.fillStyle = dark ? palette.bg : palette.surface;
    if (!dark) {
      ctx.shadowColor = 'rgba(60, 45, 20, 0.14)';
      ctx.shadowBlur = 28 * this.k;
      ctx.shadowOffsetY = 10 * this.k;
    }
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    if (dark) {
      ctx.globalAlpha = alpha * 0.035;
      ctx.fillStyle = palette.ink;
      ctx.fill();
    }
    ctx.globalAlpha = alpha * (dark ? 0.26 : 0.32);
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Grid.
    const step = this.compact ? 48 : 29;
    ctx.beginPath();
    for (let gx = -hw + step; gx < hw - 1; gx += step) {
      this.project(gx, y, -hd);
      ctx.moveTo(this.px, this.py);
      this.project(gx, y, hd);
      ctx.lineTo(this.px, this.py);
    }
    for (let gz = -hd + step; gz < hd - 1; gz += step) {
      this.project(-hw, y, gz);
      ctx.moveTo(this.px, this.py);
      this.project(hw, y, gz);
      ctx.lineTo(this.px, this.py);
    }
    ctx.globalAlpha = alpha * (dark ? 0.07 : 0.08);
    ctx.stroke();

    // Layer label beside the front-left corner.
    const [lx, ly] = corners[3];
    ctx.globalAlpha = alpha * 0.75;
    ctx.fillStyle = palette.muted;
    ctx.textAlign = 'right';
    ctx.fillText(`0${layer + 1}  ${LAYERS[layer].toUpperCase()}`, lx - 10, ly);
    ctx.globalAlpha = alpha * 0.35;
    ctx.strokeStyle = palette.ink;
    ctx.beginPath();
    ctx.moveTo(lx - 6, ly);
    ctx.lineTo(lx - 1, ly);
    ctx.stroke();
  }

  private drawEdges(layer: number, alpha: number, dark: boolean) {
    const { ctx, palette } = this;
    for (let e = 0; e < EDGES.length; e++) {
      const edge = EDGES[e];
      if (edgeLayer(edge) !== layer) continue;
      const [a, b] = edge;
      const active = this.activeEdges[e] === 1;
      ctx.beginPath();
      ctx.moveTo(this.nx[a], this.ny[a]);
      ctx.lineTo(this.nx[b], this.ny[b]);
      if (active) {
        ctx.setLineDash([]);
        ctx.globalAlpha = alpha * (dark ? 0.75 : 0.85);
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 1.25;
      } else {
        ctx.setLineDash([2, 4]);
        ctx.lineDashOffset = this.reduced ? 0 : -this.time * 6;
        ctx.globalAlpha = alpha * this.focusStrength * 0.7;
        ctx.strokeStyle = palette.ink;
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  private drawPackets(layer: number, alpha: number, dark: boolean) {
    const { ctx, palette } = this;
    for (const p of this.packets) {
      const a = p.path[p.seg];
      const b = p.path[p.seg + 1];
      if (b === undefined) continue;
      if (Math.max(NODES[a].layer, NODES[b].layer) !== layer) continue;
      const t = easeInOut(p.t);
      const x = this.nx[a] + (this.nx[b] - this.nx[a]) * t;
      const y = this.ny[a] + (this.ny[b] - this.ny[a]) * t;
      const tt = Math.max(0, t - 0.22);
      const tx = this.nx[a] + (this.nx[b] - this.nx[a]) * tt;
      const ty = this.ny[a] + (this.ny[b] - this.ny[a]) * tt;
      const color = p.dir === 1 ? palette.accent : palette.signal;
      const s = this.ns[a] + (this.ns[b] - this.ns[a]) * t;

      const trail = ctx.createLinearGradient(tx, ty, x, y);
      trail.addColorStop(0, 'transparent');
      trail.addColorStop(1, color);
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.stroke();

      if (dark) {
        const size = 22 * s * this.k;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha * 0.55;
        ctx.drawImage(p.dir === 1 ? this.glowAccent : this.glowSignal, x - size / 2, y - size / 2, size, size);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 2.1 * s * Math.max(0.85, this.k), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawNodes(layer: number, alpha: number, dark: boolean) {
    const { ctx, palette } = this;
    for (let i = 0; i < NODES.length; i++) {
      const n = NODES[i];
      if (n.layer !== layer) continue;
      const x = this.nx[i];
      const y = this.ny[i];
      const s = this.ns[i] * Math.max(0.85, this.k);
      const active = this.activeNodes[i] === 1;
      const hovered = this.hovered === i;
      const nodeAlpha = alpha * (active ? 1 : this.focusStrength + 0.15);
      const pulse = this.pulses[i];

      if (dark && (active || pulse > 0)) {
        const size = (active ? 34 : 22) * s;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha * (active ? 0.35 : 0.2) + pulse * 0.25;
        ctx.drawImage(this.glowAccent, x - size / 2, y - size / 2, size, size);
        ctx.globalCompositeOperation = 'source-over';
      }

      if (pulse > 0) {
        ctx.globalAlpha = alpha * pulse * 0.7;
        ctx.strokeStyle = palette.signal;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, (4 + (1 - pulse) * 12) * s, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ring + core
      ctx.globalAlpha = nodeAlpha;
      ctx.fillStyle = dark ? palette.bg : palette.surface;
      ctx.strokeStyle = active ? palette.accent : palette.ink;
      ctx.lineWidth = hovered ? 1.6 : 1;
      ctx.beginPath();
      ctx.arc(x, y, (hovered ? 6.5 : 4.6) * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = active ? palette.accent : palette.ink;
      ctx.beginPath();
      ctx.arc(x, y, (hovered ? 2.6 : 1.9) * s, 0, Math.PI * 2);
      ctx.fill();

      // Label (position chosen in placeLabels)
      ctx.globalAlpha = alpha * (active ? 1 : this.focusStrength + 0.2) * (this.labelDim[i] && !hovered ? 0.35 : 1);
      ctx.fillStyle = active ? palette.ink : palette.muted;
      ctx.textAlign = 'left';
      ctx.fillText(n.label, this.labelX[i], this.labelY[i]);
    }
  }
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

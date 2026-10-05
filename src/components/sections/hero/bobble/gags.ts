/** Comedy gags as timed cues plus a per-frame tick. Pure data + callbacks — the scene supplies the actors. */

export type GagId = 'bug' | 'deploy' | 'coffee' | 'duck';

export interface Gag {
  id: GagId;
  duration: number;
  cues: Array<[number, () => void]>;
  tick?: (t: number, dt: number) => void;
  end: () => void;
}

export interface GagInfo {
  id: GagId;
  label: string;
  emoji: string;
  /** Punchline shown on its own when motion is reduced. */
  punchline: string;
}

export const GAGS: GagInfo[] = [
  { id: 'bug', label: 'Bug', emoji: '🐛', punchline: '1 bug fixed. 3 new bugs.' },
  { id: 'deploy', label: 'Deploy', emoji: '🔥', punchline: 'This is fine. Rolled back. Calmly.' },
  { id: 'coffee', label: 'Coffee', emoji: '☕', punchline: 'Coffee #4. I can hear the database.' },
  { id: 'duck', label: 'Duck', emoji: '🦆', punchline: 'Quack. (It was a nil check.)' },
];

export const BOOPS = [
  'Hey! I’m in a stand-up.',
  'Ticket #1042? On it.',
  'Works on my machine.',
  'Have you tried turning it off and on again?',
  'It’s not a bug, it’s a feature.',
  'One more migration and I’m done.',
];

/** Runs one gag at a time; time only advances while the scene is animating, so pausing pauses the joke. */
export class Director {
  private gag: Gag | null = null;
  private t = 0;
  private fired = 0;

  get busy() {
    return this.gag !== null;
  }

  get current() {
    return this.gag?.id ?? null;
  }

  play(gag: Gag) {
    if (this.gag) this.stop();
    this.gag = { ...gag, cues: [...gag.cues].sort((a, b) => a[0] - b[0]) };
    this.t = 0;
    this.fired = 0;
  }

  stop() {
    const g = this.gag;
    this.gag = null;
    g?.end();
  }

  update(dt: number) {
    const g = this.gag;
    if (!g) return;
    this.t += dt;
    while (this.fired < g.cues.length && g.cues[this.fired][0] <= this.t) {
      g.cues[this.fired][1]();
      this.fired += 1;
    }
    g.tick?.(this.t, dt);
    if (this.t >= g.duration) this.stop();
  }
}

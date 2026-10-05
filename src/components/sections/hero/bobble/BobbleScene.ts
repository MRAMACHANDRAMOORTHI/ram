/**
 * Bobblehead hero: a real-face sprite on a toon-shaded 3D body, behind a
 * sticker-covered laptop, with four comedy gags. Plain Three.js, lazy-loaded,
 * paused off-screen; all geometry is low-poly and shadows are faked with blobs.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PlaneGeometry,
  RGBADepthPacking,
  PerspectiveCamera,
  PMREMGenerator,
  Quaternion,
  Raycaster,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BOOPS, Director, type Gag, type GagId } from './gags';

export interface Anchor {
  x: number;
  y: number;
  visible: boolean;
}

export interface SceneCallbacks {
  onBubble: (who: 'me' | 'duck', text: string | null) => void;
  onFx: (text: string | null, tone?: 'pink' | 'amber' | 'lime' | 'cyan') => void;
  onAnchors: (me: Anchor, duck: Anchor, fx: Anchor) => void;
  onGag: (id: GagId | null) => void;
  onFirstFrame: () => void;
}

type Hit = 'head' | 'body' | 'mug' | 'button' | 'duck' | 'laptop' | 'bug' | null;

const UP = new Vector3(0, 1, 0);
const DESK_Y = 0.75;
/**
 * The person is the real portrait cutout (head, shoulders, suit) on a plane at true
 * proportions: ~1.5 units across the shoulders, shoulders ~0.65 above the desk, the
 * chest disappearing behind the laptop and desk like someone seated at it.
 */
const PERSON_SIZE = 2.0; // square source image, in scene units
const PERSON_BASE = new Vector3(0, 1.08, 0.05); // bottom-centre of the photo (mid-chest)
const HEAD_TOP = 0.91; // top of the hair, as a fraction of the photo height from the bottom
const LOOK = new Vector3(0, 1.78, 0.5);

const PALETTE = {
  suit: '#151b28',
  lapel: '#18203a',
  shirt: '#f2f3f5',
  tie: '#1a35a0',
  skin: '#c98a62',
  chair: '#1b1c20',
  deskTop: '#3a2a20',
  deskFront: '#2c2018',
  steel: '#1d1f24',
  laptop: '#c3c7cd',
  keys: '#1d1f23',
  mug: '#f4f4f2',
  mugBand: '#c9974a',
  coffee: '#3b2416',
  duck: '#ffd23a',
  beak: '#ff8a1f',
  bug: '#b3263a',
  bugDark: '#1b1416',
  rack: '#2a2d33',
  extinguisher: '#d0202f',
  button: '#e0223a',
  buttonBase: '#2a2d33',
};

/** Surface finish per palette entry: [roughness, metalness]. */
const FINISH: Record<string, [number, number]> = {
  [PALETTE.suit]: [0.86, 0],
  [PALETTE.lapel]: [0.7, 0],
  [PALETTE.shirt]: [0.72, 0],
  [PALETTE.tie]: [0.42, 0.05],
  [PALETTE.skin]: [0.55, 0],
  [PALETTE.chair]: [0.42, 0.05],
  [PALETTE.deskTop]: [0.48, 0],
  [PALETTE.deskFront]: [0.55, 0],
  [PALETTE.steel]: [0.4, 0.7],
  [PALETTE.laptop]: [0.3, 0.75],
  [PALETTE.keys]: [0.7, 0.1],
  [PALETTE.mug]: [0.16, 0],
  [PALETTE.mugBand]: [0.2, 0],
  [PALETTE.coffee]: [0.12, 0],
  [PALETTE.duck]: [0.26, 0],
  [PALETTE.beak]: [0.3, 0],
  [PALETTE.rack]: [0.45, 0.55],
  [PALETTE.extinguisher]: [0.28, 0.2],
  [PALETTE.button]: [0.3, 0],
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const backOut = (t: number) => {
  const x = clamp01(t) - 1;
  return 1 + 2.4 * x * x * x + 1.4 * x * x;
};

/** Critically-under-damped spring for the bobble. */
class Spring {
  x: number;
  v = 0;
  target: number;
  private k: number;
  private c: number;
  constructor(x = 0, k = 70, c = 7) {
    this.x = x;
    this.target = x;
    this.k = k;
    this.c = c;
  }
  kick(v: number) {
    this.v += v;
  }
  step(dt: number) {
    this.v += ((this.target - this.x) * this.k - this.v * this.c) * dt;
    this.x += this.v * dt;
  }
}

function radialTexture(inner: string, outer: string, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** The back of the laptop lid — the part visitors actually see — covered in dev stickers. */
function lidTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const g = c.getContext('2d')!;
  // Brushed aluminium.
  const brushed = g.createLinearGradient(0, 0, 512, 320);
  brushed.addColorStop(0, '#cfd3d8');
  brushed.addColorStop(0.5, '#b9bdc4');
  brushed.addColorStop(1, '#c8ccd2');
  g.fillStyle = brushed;
  g.fillRect(0, 0, 512, 320);
  g.globalAlpha = 0.05;
  for (let y = 0; y < 320; y += 2) {
    g.fillStyle = y % 4 ? '#ffffff' : '#000000';
    g.fillRect(0, y, 512, 1);
  }
  g.globalAlpha = 1;
  const sticker = (x: number, y: number, w: number, h: number, bg: string, fg: string, text: string, r = 18, rot = 0, size = 28) => {
    g.save();
    g.translate(x + w / 2, y + h / 2);
    g.rotate(rot);
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.beginPath();
    g.roundRect(-w / 2 + 4, -h / 2 + 6, w, h, r);
    g.fill();
    g.fillStyle = bg;
    g.beginPath();
    g.roundRect(-w / 2, -h / 2, w, h, r);
    g.fill();
    g.fillStyle = fg;
    g.font = `800 ${size}px system-ui, "Segoe UI", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 0, 2);
    g.restore();
  };
  sticker(46, 44, 150, 66, '#1d1f24', '#eef0f3', 'Elixir', 33, -0.1, 30);
  sticker(306, 34, 160, 60, '#f4f4f2', '#121418', 'MSR', 30, 0.06, 30);
  sticker(64, 196, 228, 60, '#e6b065', '#2a1a00', 'works on my machine', 12, 0.04, 21);
  sticker(336, 156, 112, 112, '#0f1a33', '#e3b66d', '</>', 56, -0.08, 44);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export class BobbleScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(30, 1, 0.1, 60);
  private director = new Director();
  private cb: SceneCallbacks;

  private w = 1;
  private h = 1;
  private raf = 0;
  private running = false;
  private last = 0;
  private time = 0;
  private reduced = false;
  private drewFirst = false;
  private prepared = false;
  private disposed = false;
  private envMap: Texture | null = null;
  private key!: DirectionalLight;
  private intro = 0;

  // Rig
  private body = new Group();
  private person!: Mesh;
  private personMat!: MeshBasicMaterial;
  private personDepth!: MeshDepthMaterial;
  private armL: Mesh[] = [];
  private armR: Mesh[] = [];
  private handL!: Mesh;
  private handR!: Mesh;
  private shoulderL = new Vector3(-0.42, DESK_Y + 0.14, 0.42);
  private shoulderR = new Vector3(0.42, DESK_Y + 0.14, 0.42);
  private handTargetL = new Vector3();
  private handTargetR = new Vector3();
  private handPosL = new Vector3(-0.3, DESK_Y + 0.1, 0.7);
  private handPosR = new Vector3(0.3, DESK_Y + 0.1, 0.7);
  private restL = new Vector3(-0.3, DESK_Y + 0.1, 0.7);
  private restR = new Vector3(0.3, DESK_Y + 0.1, 0.7);
  private handROverride: Vector3 | null = null;
  private handLOverride: Vector3 | null = null;
  private handSpeed = 10;

  // Bobble
  private bobX = new Spring(0, 60, 6);
  private bobY = new Spring(0, 80, 7);
  private bobRot = new Spring(0, 55, 5.5);
  private bobScale = new Spring(1, 120, 9);
  private nod = new Spring(0, 90, 9);
  private lean = 0;
  private pointerX = 0;
  private pointerY = 0;
  private camX = 0;
  private camY = 0;
  private typing = 1;
  private vibrate = 0;
  private shake = 0;

  // Props
  private laptop = new Group();
  private lid!: Mesh;
  private mug = new Group();
  private steam: Sprite[] = [];
  private cups: Group[] = [];
  private duck = new Group();
  private button = new Group();
  private buttonCap!: Mesh;
  private rack = new Group();
  private leds: Mesh[] = [];
  private extinguisher = new Group();
  private bug = new Group();
  private babies: Group[] = [];
  private fire: Sprite[] = [];
  private foam: Sprite[] = [];
  private fireLevel = 0;
  private foamOn = false;

  // Anchors & picking
  private fxPos = new Vector3();
  private fxVisible = false;
  private raycaster = new Raycaster();
  private hittables: Array<[Object3D, Hit]> = [];
  private tmp = new Vector3();
  private tmp2 = new Vector3();
  private q = new Quaternion();

  constructor(canvas: HTMLCanvasElement, cb: SceneCallbacks) {
    this.cb = cb;
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    // Soft studio reflections for metal, ceramic and rubber.
    const pmrem = new PMREMGenerator(this.renderer);
    this.envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envMap;
    this.scene.environmentIntensity = 0.55;
    this.camera.position.set(0, 2.3, 7.2);
    this.camera.lookAt(LOOK);

    this.buildLights();
    this.buildSet();
    this.buildBody();
    this.buildProps();
    this.scene.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh || m.material instanceof MeshBasicMaterial) return;
      m.castShadow = true;
      m.receiveShadow = true;
    });
  }

  /* ------------------------------ public ------------------------------ */

  /** Load the face and compile shaders off the main thread before the first frame. */
  async prepare(faceUrl: string) {
    const tex = await new TextureLoader().loadAsync(faceUrl);
    if (this.disposed) {
      tex.dispose();
      return;
    }
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    this.personMat.map = tex;
    this.personMat.needsUpdate = true;
    this.personMat.opacity = 1;
    this.personDepth.map = tex;
    this.personDepth.needsUpdate = true;
    // Make every prop visible once so all shader variants compile up front.
    const hidden: Object3D[] = [];
    this.scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    await this.renderer.compileAsync(this.scene, this.camera);
    if (this.disposed) return;
    hidden.forEach((o) => (o.visible = false));
    this.prepared = true;
    this.requestFrame();
  }

  setSize(w: number, h: number, dpr: number) {
    this.w = w;
    this.h = h;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Keep the whole desk in frame on narrow screens.
    this.camera.fov = w / h < 0.9 ? 36 : 30;
    this.camera.updateProjectionMatrix();
    this.requestFrame();
  }

  setTheme(light: boolean) {
    const hemi = this.scene.getObjectByName('hemi') as HemisphereLight;
    hemi.intensity = light ? 0.7 : 0.35;
    this.scene.environmentIntensity = light ? 0.8 : 0.55;
    this.requestFrame();
  }

  setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
  }

  setReducedMotion(reduced: boolean) {
    this.reduced = reduced;
    if (reduced) {
      this.stop();
      this.director.stop();
      this.requestFrame();
    }
  }

  get busy() {
    return this.director.busy;
  }

  play(id: GagId) {
    if (this.reduced) return;
    const gag = this.makeGag(id);
    const end = gag.end;
    gag.end = () => {
      end();
      this.cb.onGag(null);
    };
    this.director.play(gag);
    this.cb.onGag(id);
  }

  /** Pointer in canvas CSS px; returns what's under it. */
  pick(x: number, y: number): Hit {
    const ndc = new Vector2((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.hittables.filter(([o]) => o.visible).map(([o]) => o),
      true,
    );
    if (!hits.length) return null;
    let obj: Object3D | null = hits[0].object;
    while (obj) {
      const found = this.hittables.find(([o]) => o === obj);
      if (found) return found[1];
      obj = obj.parent;
    }
    return null;
  }

  /** Click handling: props start their gag, the head gets booped. */
  click(x: number, y: number): Hit {
    const hit = this.pick(x, y);
    if (!hit) return null;
    if (hit === 'head' || hit === 'body') this.boop();
    else if (!this.director.busy) {
      const map: Partial<Record<Exclude<Hit, null>, GagId>> = { mug: 'coffee', button: 'deploy', duck: 'duck', laptop: 'bug', bug: 'bug' };
      const gag = map[hit];
      if (gag) this.play(gag);
    }
    return hit;
  }

  start() {
    if (this.disposed) return;
    if (this.running || this.reduced) {
      if (this.reduced) this.requestFrame();
      return;
    }
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
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

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.director.stop();
    window.clearTimeout(this.boopTimer);
    const textures = new Set<Texture>();
    const materials = new Set<{ dispose: () => void }>();
    this.scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
      const list = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of list) {
        materials.add(mat);
        const map = (mat as { map?: Texture | null }).map;
        if (map && (map as Texture).isTexture) textures.add(map);
      }
    });
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
    this.envMap?.dispose();
    this.renderer.dispose();
  }

  /* ------------------------------ build ------------------------------- */

  /** Physically based material with a finish (roughness/metalness) chosen per palette colour. */
  private pbr(color: string, extra: Partial<{ emissive: string; emissiveIntensity: number; roughness: number; metalness: number }> = {}) {
    const [roughness, metalness] = FINISH[color] ?? [0.6, 0];
    const m = new MeshStandardMaterial({
      color: new Color(color),
      roughness: extra.roughness ?? roughness,
      metalness: extra.metalness ?? metalness,
    });
    if (extra.emissive) {
      m.emissive = new Color(extra.emissive);
      m.emissiveIntensity = extra.emissiveIntensity ?? 1;
    }
    return m;
  }

  private buildLights() {
    const hemi = new HemisphereLight('#dfe6ff', '#1a1714', 0.35);
    hemi.name = 'hemi';
    // Warm key with soft shadows, a cool rim from behind, a gentle fill from the left.
    this.key = new DirectionalLight('#fff1e3', 2.7);
    this.key.position.set(2.6, 6.2, 4.6);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(1024, 1024);
    const cam = this.key.shadow.camera;
    cam.left = -2.6;
    cam.right = 2.6;
    cam.top = 3.2;
    cam.bottom = -0.6;
    cam.near = 2;
    cam.far = 16;
    this.key.shadow.bias = -0.0004;
    this.key.shadow.normalBias = 0.025;
    this.key.shadow.radius = 5;
    const rim = new DirectionalLight('#9fb4ff', 1.5);
    rim.position.set(-3.2, 3.8, -4.2);
    const fill = new DirectionalLight('#ffffff', 0.45);
    fill.position.set(-4.5, 2.2, 3.2);
    this.scene.add(hemi, this.key, rim, fill);
  }

  private buildSet() {
    // Chair back behind the character.
    const chair = new Mesh(new CapsuleGeometry(0.55, 1.0, 6, 16), this.pbr(PALETTE.chair));
    chair.scale.set(1.15, 1, 0.28);
    chair.position.set(0, 1.62, -0.66);
    const headrest = new Mesh(new CapsuleGeometry(0.3, 0.5, 6, 12), this.pbr(PALETTE.chair));
    headrest.rotation.z = Math.PI / 2;
    headrest.scale.set(1, 1, 0.3);
    headrest.position.set(0, 2.62, -0.68);
    this.scene.add(chair, headrest);

    // Desk.
    const top = new Mesh(new BoxGeometry(3.5, 0.12, 1.75), this.pbr(PALETTE.deskTop));
    top.position.set(0, DESK_Y - 0.06, 0.66);
    const front = new Mesh(new BoxGeometry(3.5, 0.46, 0.1), this.pbr(PALETTE.deskFront));
    front.position.set(0, DESK_Y - 0.35, 1.5);
    // Brushed-steel trim along the front edge, steel legs.
    const edge = new Mesh(new BoxGeometry(3.52, 0.03, 0.03), this.pbr(PALETTE.steel));
    edge.position.set(0, DESK_Y - 0.02, 1.54);
    const legGeo = new BoxGeometry(0.09, 1.3, 0.09);
    const legs = [-1.62, 1.62].map((x) => {
      const leg = new Mesh(legGeo, this.pbr(PALETTE.steel));
      leg.position.set(x, DESK_Y - 1.2, 1.38);
      return leg;
    });
    top.receiveShadow = true;
    this.scene.add(top, front, edge, ...legs);

  }

  private buildBody() {
    // The real person: the portrait cutout on a plane, pivoting at the chest so leans look natural.
    this.personMat = new MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.02, toneMapped: false });
    this.person = new Mesh(new PlaneGeometry(PERSON_SIZE, PERSON_SIZE), this.personMat);
    this.person.geometry.translate(0, PERSON_SIZE / 2, 0);
    this.person.position.copy(PERSON_BASE);
    // Shape-accurate shadow on the chair and desk from the photo's own silhouette.
    this.personDepth = new MeshDepthMaterial({ depthPacking: RGBADepthPacking, alphaTest: 0.5 });
    this.person.customDepthMaterial = this.personDepth;
    this.person.castShadow = true;
    this.person.renderOrder = 5;
    this.body.add(this.person);
    const lowerTorso = new Mesh(
      new BoxGeometry(1.66, PERSON_BASE.y - (DESK_Y - 0.2) + 0.06, 0.5),
      new MeshBasicMaterial({ color: '#12161f', toneMapped: false }),
    );
    lowerTorso.position.set(0.06, (PERSON_BASE.y + 0.06 + DESK_Y - 0.2) / 2, PERSON_BASE.z - 0.27);
    this.body.add(lowerTorso);

    // Forearms in the suit's fabric, hands in the photo's skin tone. Hidden while typing.
    const sleeve = this.pbr(PALETTE.suit, { roughness: 0.85 });
    const armGeo = new CapsuleGeometry(0.075, 1, 4, 12);
    for (const side of [-1, 1]) {
      const upper = new Mesh(armGeo, sleeve);
      const fore = new Mesh(armGeo, sleeve);
      upper.visible = false;
      const hand = new Mesh(new SphereGeometry(0.075, 16, 12), this.pbr(PALETTE.skin, { roughness: 0.6 }));
      hand.scale.set(1, 0.8, 1.25);
      this.body.add(upper, fore, hand);
      if (side < 0) {
        this.armL = [upper, fore];
        this.handL = hand;
      } else {
        this.armR = [upper, fore];
        this.handR = hand;
      }
    }

    this.scene.add(this.body);
    this.hittables.push([this.person, 'head']);
  }

  private buildProps() {
    // Laptop: base, keys and a lid whose back (facing us) wears stickers.
    const base = new Mesh(new BoxGeometry(1.2, 0.05, 0.72), this.pbr(PALETTE.laptop));
    base.position.set(0, DESK_Y + 0.025, 0.76);
    const keys = new Mesh(new BoxGeometry(1.02, 0.012, 0.4), this.pbr(PALETTE.keys));
    keys.position.set(0, DESK_Y + 0.055, 0.7);
    const lidGroup = new Group();
    lidGroup.position.set(0, DESK_Y + 0.05, 1.11);
    lidGroup.rotation.x = 0.2;
    this.lid = new Mesh(new BoxGeometry(1.2, 0.74, 0.04), [
      this.pbr(PALETTE.laptop),
      this.pbr(PALETTE.laptop),
      this.pbr(PALETTE.laptop),
      this.pbr(PALETTE.laptop),
      new MeshStandardMaterial({ map: lidTexture(), roughness: 0.38, metalness: 0.35 }),
      new MeshBasicMaterial({ color: '#d6e2ff', toneMapped: false }),
    ]);
    this.lid.position.y = 0.37;
    lidGroup.add(this.lid);
    this.laptop.add(base, keys, lidGroup);
    this.scene.add(this.laptop);
    this.hittables.push([this.laptop, 'laptop']);

    // Mug with steam.
    const cup = new Mesh(new CylinderGeometry(0.15, 0.13, 0.32, 18), this.pbr(PALETTE.mug));
    cup.position.y = 0.16;
    const band = new Mesh(new CylinderGeometry(0.152, 0.15, 0.07, 18), this.pbr(PALETTE.mugBand));
    band.position.y = 0.2;
    const coffee = new Mesh(new CylinderGeometry(0.13, 0.13, 0.01, 18), this.pbr(PALETTE.coffee));
    coffee.position.y = 0.315;
    const handle = new Mesh(new TorusGeometry(0.075, 0.025, 8, 16), this.pbr(PALETTE.mug));
    handle.position.set(0.16, 0.17, 0);
    this.mug.add(cup, band, coffee, handle);
    this.mug.position.set(-1.2, DESK_Y, 0.95);
    const steamTex = radialTexture('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)');
    for (let i = 0; i < 4; i++) {
      const s = new Sprite(new SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0.5 }));
      s.scale.setScalar(0.18);
      this.steam.push(s);
      this.mug.add(s);
    }
    this.scene.add(this.mug);
    this.hittables.push([this.mug, 'mug']);

    // Coffee stack (coffee gag).
    for (let i = 0; i < 4; i++) {
      const c = this.mug.clone();
      c.children.filter((ch) => ch instanceof Sprite).forEach((ch) => c.remove(ch));
      c.visible = false;
      this.cups.push(c);
      this.scene.add(c);
    }

    // Rubber duck.
    const duckMat = this.pbr(PALETTE.duck);
    const dBody = new Mesh(new SphereGeometry(0.2, 18, 14), duckMat);
    dBody.scale.set(1.15, 0.85, 1);
    dBody.position.y = 0.16;
    const dHead = new Mesh(new SphereGeometry(0.13, 16, 12), duckMat);
    dHead.position.set(0.02, 0.38, 0.06);
    const beak = new Mesh(new ConeGeometry(0.05, 0.12, 10), this.pbr(PALETTE.beak));
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0.02, 0.36, 0.2);
    const eyeMat = new MeshBasicMaterial({ color: '#141022' });
    const eyes = [-1, 1].map((d) => {
      const e = new Mesh(new SphereGeometry(0.022, 8, 8), eyeMat);
      e.position.set(0.02 + d * 0.06, 0.42, 0.17);
      return e;
    });
    this.duck.add(dBody, dHead, beak, ...eyes);
    this.duck.position.set(-1.0, DESK_Y, 1.2);
    this.duck.rotation.y = 0.5;
    this.duck.scale.setScalar(0.001);
    this.duck.visible = false;
    this.scene.add(this.duck);
    this.hittables.push([this.duck, 'duck']);

    // Big red deploy button.
    const bBase = new Mesh(new CylinderGeometry(0.2, 0.22, 0.08, 20), this.pbr(PALETTE.buttonBase));
    bBase.position.y = 0.04;
    this.buttonCap = new Mesh(new CylinderGeometry(0.15, 0.15, 0.09, 20), this.pbr(PALETTE.button, { emissive: '#ff0030', emissiveIntensity: 0.25 }));
    this.buttonCap.position.y = 0.12;
    this.button.add(bBase, this.buttonCap);
    this.button.position.set(0.95, DESK_Y, 1.0);
    this.button.scale.setScalar(0.001);
    this.button.visible = false;
    this.scene.add(this.button);
    this.hittables.push([this.button, 'button']);

    // Server rack (Friday deploy) — enters from the right.
    const rackBody = new Mesh(new BoxGeometry(0.72, 1.35, 0.7), this.pbr(PALETTE.rack));
    rackBody.position.y = 0.675;
    this.rack.add(rackBody);
    for (let r = 0; r < 5; r++) {
      const slot = new Mesh(new BoxGeometry(0.6, 0.17, 0.02), this.pbr('#1c1f3a'));
      slot.position.set(0, 0.22 + r * 0.24, 0.36);
      const led = new Mesh(new BoxGeometry(0.05, 0.05, 0.02), new MeshBasicMaterial({ color: '#5fd0a0', toneMapped: false }));
      led.position.set(0.22, 0.22 + r * 0.24, 0.372);
      this.leds.push(led);
      this.rack.add(slot, led);
    }
    this.rack.position.set(3.6, DESK_Y - 0.06, 0.1);
    this.rack.visible = false;
    this.scene.add(this.rack);

    // Fire and foam particles above the rack.
    const fireTex = radialTexture('rgba(255,220,120,1)', 'rgba(255,60,0,0)');
    const foamTex = radialTexture('rgba(255,255,255,0.95)', 'rgba(220,240,255,0)');
    for (let i = 0; i < 26; i++) {
      const f = new Sprite(new SpriteMaterial({ map: fireTex, transparent: true, depthWrite: false, blending: AdditiveBlending }));
      f.visible = false;
      this.fire.push(f);
      this.scene.add(f);
      const o = new Sprite(new SpriteMaterial({ map: foamTex, transparent: true, depthWrite: false }));
      o.visible = false;
      this.foam.push(o);
      this.scene.add(o);
    }

    // Fire extinguisher.
    const can = new Mesh(new CylinderGeometry(0.13, 0.13, 0.62, 16), this.pbr(PALETTE.extinguisher));
    can.position.y = 0.31;
    const top = new Mesh(new CylinderGeometry(0.05, 0.08, 0.1, 10), this.pbr('#2b2f52'));
    top.position.y = 0.66;
    const hose = new Mesh(new CylinderGeometry(0.025, 0.025, 0.36, 8), this.pbr('#1b1d33'));
    hose.position.set(0.12, 0.66, 0);
    hose.rotation.z = -1.1;
    this.extinguisher.add(can, top, hose);
    this.extinguisher.position.set(1.05, DESK_Y, 1.25);
    this.extinguisher.scale.setScalar(0.001);
    this.extinguisher.visible = false;
    this.scene.add(this.extinguisher);

    // The bug and its offspring.
    const makeBug = () => {
      const g = new Group();
      const shell = new Mesh(new SphereGeometry(0.11, 14, 10), this.pbr(PALETTE.bug));
      shell.scale.set(1, 0.55, 1.3);
      shell.position.y = 0.06;
      const head = new Mesh(new SphereGeometry(0.055, 10, 8), this.pbr(PALETTE.bugDark));
      head.position.set(0, 0.06, 0.15);
      const legMat = this.pbr(PALETTE.bugDark);
      for (let i = 0; i < 6; i++) {
        const leg = new Mesh(new CylinderGeometry(0.008, 0.008, 0.14, 4), legMat);
        const side = i < 3 ? -1 : 1;
        leg.position.set(side * 0.1, 0.04, -0.07 + (i % 3) * 0.07);
        leg.rotation.z = side * 1.1;
        leg.name = 'leg';
        g.add(leg);
      }
      g.add(shell, head);
      g.visible = false;
      return g;
    };
    this.bug = makeBug();
    this.scene.add(this.bug);
    this.hittables.push([this.bug, 'bug']);
    for (let i = 0; i < 3; i++) {
      const b = makeBug();
      b.scale.setScalar(0.5);
      this.babies.push(b);
      this.scene.add(b);
    }
  }

  /* ------------------------------ gags -------------------------------- */

  private say(text: string | null) {
    this.cb.onBubble('me', text);
  }

  private fx(text: string | null, at?: Vector3, tone?: 'pink' | 'amber' | 'lime' | 'cyan') {
    if (at) this.fxPos.copy(at);
    this.fxVisible = !!text;
    this.cb.onFx(text, tone);
  }

  private boop() {
    this.nod.kick(1.6);
    this.bobRot.kick(rand(-0.6, 0.6));
    if (!this.director.busy) {
      this.say(BOOPS[Math.floor(Math.random() * BOOPS.length)]);
      window.clearTimeout(this.boopTimer);
      this.boopTimer = window.setTimeout(() => {
        if (!this.director.busy) this.say(null);
      }, 2200);
    }
  }
  private boopTimer = 0;

  private makeGag(id: GagId): Gag {
    switch (id) {
      case 'bug':
        return this.bugGag();
      case 'deploy':
        return this.deployGag();
      case 'coffee':
        return this.coffeeGag();
      case 'duck':
        return this.duckGag();
    }
  }

  private bugGag(): Gag {
    const start = new Vector3(-2.1, DESK_Y, 1.05);
    const stop = new Vector3(-0.78, DESK_Y, 0.95);
    let squashed = false;
    const dirs = [new Vector3(-1, 0, 0.6), new Vector3(0.2, 0, 1), new Vector3(1, 0, 0.4)];
    return {
      id: 'bug',
      duration: 6.4,
      cues: [
        [0, () => {
          this.bug.visible = true;
          this.bug.scale.set(1, 1, 1);
          this.bug.position.copy(start);
          this.bug.rotation.y = Math.PI / 2;
        }],
        [0.9, () => {
          this.say('…is that a bug?');
          this.lean = -0.9;
        }],
        [2.3, () => {
          this.typing = 0;
          this.handSpeed = 9;
          this.handROverride = new Vector3(-0.72, DESK_Y + 0.6, 0.98);
        }],
        [2.75, () => {
          this.handSpeed = 40;
          this.handROverride = stop.clone().setY(DESK_Y + 0.12);
        }],
        [2.86, () => {
          squashed = true;
          this.bug.scale.set(1.6, 0.18, 1.5);
          this.shake = 0.35;
          this.nod.kick(1.2);
          this.fx('SPLAT!', stop.clone().setY(DESK_Y + 0.5), 'lime');
        }],
        [3.4, () => {
          this.babies.forEach((b, i) => {
            b.visible = true;
            b.position.copy(stop);
            b.rotation.y = Math.atan2(dirs[i].x, dirs[i].z);
          });
          this.fx(null);
          this.say('1 bug fixed. 3 new bugs.');
          this.handROverride = null;
          this.handSpeed = 10;
        }],
        [5.6, () => this.say(null)],
      ],
      tick: (t, dt) => {
        if (t < 2.2) {
          const p = ease(t / 2.2);
          this.bug.position.lerpVectors(start, stop, p);
          this.wiggleLegs(this.bug, t);
        }
        if (squashed && t > 3.4) {
          this.babies.forEach((b, i) => {
            b.position.addScaledVector(dirs[i], dt * 1.4);
            this.wiggleLegs(b, t * 1.6);
            if (Math.abs(b.position.x) > 2.3 || b.position.z > 1.55) b.position.y -= dt * 3;
          });
        }
      },
      end: () => {
        this.bug.visible = false;
        this.babies.forEach((b) => (b.visible = false));
        this.handROverride = null;
        this.handSpeed = 10;
        this.typing = 1;
        this.lean = 0;
        this.fx(null);
        this.say(null);
      },
    };
  }

  private deployGag(): Gag {
    const rackIn = new Vector3(1.5, DESK_Y - 0.06, 0.1);
    const rackOut = new Vector3(3.6, DESK_Y - 0.06, 0.1);
    const fireTop = new Vector3(1.4, DESK_Y + 1.4, 0.1);
    return {
      id: 'deploy',
      duration: 8.6,
      cues: [
        [0, () => {
          this.button.visible = true;
          this.rack.visible = true;
          this.rack.position.copy(rackOut);
          this.fx('DEPLOY · FRI 5:59 PM', new Vector3(0.95, DESK_Y + 0.5, 1.0), 'pink');
        }],
        [0.9, () => this.say('Small change. Ship it.')],
        [1.5, () => {
          this.typing = 0;
          this.handROverride = new Vector3(0.95, DESK_Y + 0.35, 1.0);
        }],
        [1.95, () => {
          this.handSpeed = 30;
          this.handROverride = new Vector3(0.95, DESK_Y + 0.18, 1.0);
          this.buttonCap.position.y = 0.07;
          this.fx(null);
        }],
        [2.25, () => {
          this.handSpeed = 10;
          this.handROverride = null;
          this.buttonCap.position.y = 0.12;
          this.fireLevel = 1;
          this.leds.forEach((l) => (l.material as MeshBasicMaterial).color.set('#ff4545'));
          this.vibrate = 1;
          this.fx('PROD IS ON FIRE', fireTop.clone().add(new Vector3(0, 0.7, 0)), 'amber');
        }],
        [3.2, () => this.say('This is fine.')],
        [4.3, () => {
          this.extinguisher.visible = true;
          this.foamOn = true;
          this.fx(null);
          this.say('…rolling back.');
        }],
        [6.0, () => {
          this.foamOn = false;
          this.vibrate = 0;
          this.leds.forEach((l) => (l.material as MeshBasicMaterial).color.set('#5fd0a0'));
          this.say('Rolled back. Calmly.');
        }],
        [7.8, () => this.say(null)],
      ],
      tick: (t) => {
        const enter = ease((t - 1.6) / 0.7);
        const leave = ease((t - 7.6) / 0.8);
        this.rack.position.lerpVectors(rackOut, rackIn, enter * (1 - leave));
        this.button.scale.setScalar(Math.max(0.001, backOut(t / 0.5) * (1 - ease((t - 7.6) / 0.5))));
        this.extinguisher.scale.setScalar(t > 4.3 ? Math.max(0.001, backOut((t - 4.3) / 0.4) * (1 - ease((t - 7.4) / 0.5))) : 0.001);
        if (t > 4.3) this.fireLevel = Math.max(0, 1 - (t - 4.6) / 1.4);
      },
      end: () => {
        this.button.visible = false;
        this.rack.visible = false;
        this.extinguisher.visible = false;
        this.fireLevel = 0;
        this.foamOn = false;
        this.vibrate = 0;
        this.typing = 1;
        this.handROverride = null;
        this.leds.forEach((l) => (l.material as MeshBasicMaterial).color.set('#5fd0a0'));
        this.fx(null);
        this.say(null);
      },
    };
  }

  private coffeeGag(): Gag {
    const lines = ['Coffee #1. Productive.', 'Coffee #2. Very productive.', 'Coffee #3. I can hear the database.', 'COFFEE #4. I REFACTORED EVERYTHING.'];
    const base = new Vector3(-1.55, DESK_Y, 0.72);
    const drops = [0.3, 1.3, 2.3, 3.3];
    return {
      id: 'coffee',
      duration: 6.8,
      cues: [
        ...drops.map(
          (at, i) =>
            [
              at,
              () => {
                const c = this.cups[i];
                c.visible = true;
                c.position.set(base.x + (i % 2) * 0.05, DESK_Y + 2.4, base.z);
                this.typing = 1 + (i + 1) * 0.9;
                this.vibrate = (i + 1) * 0.28;
                this.say(lines[i]);
                this.nod.kick(-0.5 - i * 0.2);
              },
            ] as [number, () => void],
        ),
        [5.3, () => this.say(null)],
      ],
      tick: (t) => {
        drops.forEach((at, i) => {
          const c = this.cups[i];
          if (!c.visible) return;
          const p = clamp01((t - at) / 0.45);
          const floorY = DESK_Y + i * 0.33;
          c.position.y = floorY + (1 - backOut(p)) * 2.4 * (1 - p) + (p < 1 ? (1 - p) * 0.3 : 0);
          c.rotation.z = (1 - p) * 0.6;
          if (t > 5.4) c.scale.setScalar(Math.max(0.001, 1 - ease((t - 5.4) / 0.6)));
        });
      },
      end: () => {
        this.cups.forEach((c) => {
          c.visible = false;
          c.scale.setScalar(1);
        });
        this.typing = 1;
        this.vibrate = 0;
        this.say(null);
      },
    };
  }

  private duckGag(): Gag {
    return {
      id: 'duck',
      duration: 7.4,
      cues: [
        [0, () => {
          this.duck.visible = true;
        }],
        [0.4, () => (this.lean = -0.7)],
        [0.7, () => {
          this.typing = 0.3;
          this.say('So the function takes the ticket, then…');
        }],
        [2.5, () => {
          this.say(null);
          this.cb.onBubble('duck', 'Quack.');
        }],
        [3.6, () => {
          this.cb.onBubble('duck', null);
          this.say('…oh. It’s a nil check.');
          this.nod.kick(-1.2);
        }],
        [5.0, () => {
          this.say(null);
          this.cb.onBubble('duck', 'Quack. You’re welcome.');
        }],
        [6.6, () => this.cb.onBubble('duck', null)],
      ],
      tick: (t) => {
        const s = backOut(t / 0.55) * (1 - ease((t - 6.8) / 0.5));
        this.duck.scale.setScalar(Math.max(0.001, s));
        const quack = (t > 2.5 && t < 3.2) || (t > 5 && t < 5.7);
        this.duck.rotation.z = quack ? Math.sin(t * 40) * 0.12 : 0;
      },
      end: () => {
        this.duck.visible = false;
        this.duck.scale.setScalar(0.001);
        this.typing = 1;
        this.lean = 0;
        this.say(null);
        this.cb.onBubble('duck', null);
      },
    };
  }

  private wiggleLegs(bug: Group, t: number) {
    let i = 0;
    bug.children.forEach((c) => {
      if (c.name === 'leg') {
        c.rotation.x = Math.sin(t * 28 + i) * 0.5;
        i += 1.7;
      }
    });
  }

  /* ----------------------------- per frame ---------------------------- */

  private requestFrame() {
    if (!this.running) {
      this.update(0);
      this.render();
    }
  }

  private placeLimb(mesh: Mesh, a: Vector3, b: Vector3) {
    this.tmp.subVectors(b, a);
    const len = this.tmp.length();
    mesh.position.addVectors(a, b).multiplyScalar(0.5);
    this.q.setFromUnitVectors(UP, this.tmp.normalize());
    mesh.quaternion.copy(this.q);
    mesh.scale.set(1, Math.max(0.05, len - 0.12), 1);
  }

  private poseArm(anchor: Vector3, hand: Vector3, segs: Mesh[], handMesh: Mesh, reaching: boolean) {
    // Hands are on the keyboard behind the lid; an arm only shows when it reaches out.
    segs[1].visible = reaching;
    handMesh.visible = reaching;
    if (reaching) this.placeLimb(segs[1], anchor, hand);
  }

  private update(dt: number) {
    this.time += dt;
    const t = this.time;
    this.director.update(dt);

    // Typing: hands bounce alternately; speed rises with coffee.
    const speed = 10 * this.typing;
    const tl = this.handTargetL.copy(this.handLOverride ?? this.restL);
    const tr = this.handTargetR.copy(this.handROverride ?? this.restR);
    if (this.typing > 0 && !this.handLOverride) tl.y += Math.max(0, Math.sin(t * speed)) * 0.07;
    if (this.typing > 0 && !this.handROverride) tr.y += Math.max(0, Math.sin(t * speed + Math.PI)) * 0.07;
    const k = 1 - Math.exp(-dt * this.handSpeed);
    this.handPosL.lerp(tl, dt ? k : 1);
    this.handPosR.lerp(tr, dt ? k : 1);
    this.handL.position.copy(this.handPosL);
    this.handR.position.copy(this.handPosR);
    const reachL = this.handLOverride !== null || this.handPosL.distanceTo(this.restL) > 0.08;
    const reachR = this.handROverride !== null || this.handPosR.distanceTo(this.restR) > 0.08;
    this.poseArm(this.shoulderL, this.handPosL, this.armL, this.handL, reachL);
    this.poseArm(this.shoulderR, this.handPosR, this.armR, this.handR, reachR);

    // Body: breathing, a slight lean toward the cursor, coffee jitter, a nod when booped.
    const jitter = this.vibrate * 0.018;
    this.bobX.target = this.pointerX * 0.035 + this.lean * 0.05;
    this.bobRot.target = -this.pointerX * 0.025 - this.lean * 0.05;
    if (this.vibrate > 0) this.bobRot.kick(Math.sin(t * 50) * this.vibrate * 0.15);
    for (let left = dt; left > 0; left -= 1 / 60) {
      const step = Math.min(left, 1 / 60);
      this.bobX.step(step);
      this.bobY.step(step);
      this.bobRot.step(step);
      this.bobScale.step(step);
      this.nod.step(step);
    }
    const breathe = Math.sin(t * 1.6) * 0.006;
    this.person.position.set(
      PERSON_BASE.x + this.bobX.x + Math.sin(t * 61) * jitter,
      PERSON_BASE.y + this.bobY.x * 0.25 + Math.sin(t * 47) * jitter * 0.5,
      PERSON_BASE.z,
    );
    this.person.rotation.z = this.bobRot.x;
    this.person.rotation.x = -this.nod.x;
    this.person.scale.set(1 - breathe * 0.4, 1 + breathe + (this.bobScale.x - 1) * 0.08, 1);

    // Steam
    this.steam.forEach((s, i) => {
      const p = (t * 0.45 + i / this.steam.length) % 1;
      s.position.set(Math.sin(p * 6 + i) * 0.05, 0.36 + p * 0.5, 0);
      (s.material as SpriteMaterial).opacity = Math.sin(p * Math.PI) * 0.4;
      s.scale.setScalar(0.12 + p * 0.18);
    });

    // LEDs blink
    this.leds.forEach((l, i) => (l.visible = Math.sin(t * (this.fireLevel > 0 ? 18 : 3) + i * 1.7) > -0.3));

    // Fire & foam
    const fireBase = this.rack.position;
    this.fire.forEach((f, i) => {
      if (this.fireLevel <= 0) {
        f.visible = false;
        return;
      }
      f.visible = true;
      const p = (t * 1.2 + i / this.fire.length) % 1;
      f.position.set(fireBase.x + Math.sin(i * 12.9) * 0.26 * (1 - p), fireBase.y + 1.38 + p * 1.0, fireBase.z + Math.cos(i * 7.3) * 0.22);
      f.scale.setScalar((0.55 - p * 0.35) * this.fireLevel);
      (f.material as SpriteMaterial).opacity = (1 - p) * this.fireLevel;
    });
    this.foam.forEach((o, i) => {
      if (!this.foamOn) {
        o.visible = false;
        return;
      }
      o.visible = true;
      const p = (t * 1.6 + i / this.foam.length) % 1;
      const from = this.tmp.set(1.15, DESK_Y + 0.75, 1.2);
      const to = this.tmp2.set(fireBase.x + Math.sin(i * 3.1) * 0.25, fireBase.y + 1.5 + Math.cos(i * 5.7) * 0.18, fireBase.z);
      o.position.lerpVectors(from, to, p);
      o.position.y += Math.sin(p * Math.PI) * 0.3;
      o.scale.setScalar(0.12 + p * 0.3);
      (o.material as SpriteMaterial).opacity = 1 - p * 0.6;
    });

    // Intro: the studio light comes up as the camera dollies in.
    if (this.intro < 1) this.intro = this.reduced ? 1 : Math.min(1, this.intro + dt / 2.4);
    const io = ease(this.intro);
    this.key.intensity = 2.7 * (0.3 + 0.7 * io);

    // Camera: gentle parallax and impact shake.
    this.camX += (this.pointerX * 0.9 - this.camX) * (dt ? 1 - Math.exp(-dt * 3) : 1);
    this.camY += (-this.pointerY * 0.35 - this.camY) * (dt ? 1 - Math.exp(-dt * 3) : 1);
    this.shake = Math.max(0, this.shake - dt);
    const sh = this.shake * 0.25;
    this.camera.position.set(
      this.camX + rand(-sh, sh) + (1 - io) * 1.2,
      2.3 + this.camY + rand(-sh, sh) + (1 - io) * 0.9,
      7.2 + (1 - io) * 3.4,
    );
    this.camera.lookAt(LOOK);

    this.emitAnchors();
  }

  private project(v: Vector3, visible: boolean): Anchor {
    this.tmp.copy(v).project(this.camera);
    return { x: (this.tmp.x * 0.5 + 0.5) * this.w, y: (-this.tmp.y * 0.5 + 0.5) * this.h, visible };
  }

  private emitAnchors() {
    const me = this.tmp2.copy(this.person.position).add(new Vector3(0.26, PERSON_SIZE * HEAD_TOP - 0.05, 0));
    const meA = this.project(me, true);
    const duckA = this.project(this.duck.position.clone().add(new Vector3(0, 0.7, 0)), this.duck.visible);
    const fxA = this.project(this.fxPos, this.fxVisible);
    this.cb.onAnchors(meA, duckA, fxA);
  }

  private render() {
    if (!this.prepared || this.disposed) return;
    this.renderer.render(this.scene, this.camera);
    if (!this.drewFirst && this.personMat.map) {
      this.drewFirst = true;
      this.cb.onFirstFrame();
    }
  }
}

import headUrl from '../../../../assets/head.webp';

/**
 * Lightweight stand-in for the 3D scene: the same face, gently bobbling, at
 * roughly the 3D head's size and position. Shown while Three.js loads, on
 * devices without WebGL, and cross-faded out once the first 3D frame lands.
 */
export function HeadPoster() {
  return (
    <div className="relative size-full" aria-hidden="true">
      <img
        src={headUrl}
        alt=""
        width={440}
        height={562}
        decoding="async"
        className="absolute top-[13%] left-1/2 h-[46%] w-auto -translate-x-1/2 animate-[poster-bob_2.4s_ease-in-out_infinite] drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}

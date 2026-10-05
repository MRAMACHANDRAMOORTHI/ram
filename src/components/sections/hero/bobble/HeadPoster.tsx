import personUrl from '../../../../assets/person.webp';

/**
 * Lightweight stand-in for the 3D scene: the same portrait cutout, framed like the
 * scene, breathing gently. Shown while Three.js loads, on devices without WebGL,
 * and cross-faded out once the first 3D frame lands.
 */
export function HeadPoster() {
  return (
    <div className="relative size-full overflow-hidden" aria-hidden="true">
      <img
        src={personUrl}
        alt=""
        width={900}
        height={900}
        decoding="async"
        className="absolute bottom-[14%] left-1/2 h-[78%] w-auto -translate-x-1/2 animate-[poster-bob_4s_ease-in-out_infinite] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
      />
    </div>
  );
}

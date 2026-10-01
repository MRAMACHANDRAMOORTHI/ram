import { profile } from '../../content/profile';
import { scrollToSection } from '../../lib/scroll';

export function Logo({ showName = true }: { showName?: boolean }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection('top');
      }}
      aria-label={`${profile.name} — back to top`}
      className="group flex items-center gap-3 rounded-full"
    >
      <span className="relative grid h-9 place-items-center rounded-full border border-line-strong px-3 text-[0.72rem] font-semibold tracking-[0.14em] transition-colors duration-500 group-hover:border-accent group-hover:text-accent">
        <span className="flex items-center gap-1">
          {profile.monogram}
          <span className="size-1.5 rounded-full bg-accent" />
        </span>
      </span>
      {showName && (
        <span className="hidden text-[0.8125rem] leading-tight xl:block">
          <span className="block text-ink">{profile.name}</span>
          <span className="block text-faint">{profile.role}</span>
        </span>
      )}
    </a>
  );
}

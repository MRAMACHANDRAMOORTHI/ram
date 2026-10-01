import { cn } from '../../lib/utils';
import { useTheme } from '../../providers/ThemeProvider';
import { Icon } from '../primitives/Icon';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-10 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-ink/6 hover:text-ink',
        className,
      )}
    >
      <span className="relative size-[18px]">
        <Icon
          name="sun"
          className={cn(
            'absolute inset-0 transition-[scale,rotate,opacity] duration-500 ease-out-expo',
            theme === 'light' && 'scale-50 rotate-90 opacity-0',
          )}
        />
        <Icon
          name="moon"
          className={cn(
            'absolute inset-0 transition-[scale,rotate,opacity] duration-500 ease-out-expo',
            theme === 'dark' && 'scale-50 -rotate-90 opacity-0',
          )}
        />
      </span>
    </button>
  );
}

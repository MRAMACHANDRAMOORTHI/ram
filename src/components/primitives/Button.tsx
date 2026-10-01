import type { MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Icon, type IconName } from './Icon';
import { Magnetic } from './Magnetic';

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  magnetic?: boolean;
  className?: string;
  'aria-label'?: string;
}

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

type ActionProps = BaseProps & {
  href?: undefined;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-[color,border-color,opacity] duration-500 ease-out-expo disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:text-bg',
  secondary: 'border border-line-strong text-ink hover:text-bg hover:border-ink',
  quiet: 'text-ink hover:text-bg',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
};

/** Arrow that swaps out diagonally on hover. */
function SwapIcon({ name }: { name: IconName }) {
  const diagonal = name === 'arrow-up-right';
  const out = diagonal ? 'group-hover/btn:translate-x-[120%] group-hover/btn:-translate-y-[120%]' : name === 'arrow-down' || name === 'download' ? 'group-hover/btn:translate-y-[120%]' : 'group-hover/btn:translate-x-[120%]';
  const enter = diagonal ? '-translate-x-[120%] translate-y-[120%]' : name === 'arrow-down' || name === 'download' ? '-translate-y-[120%]' : '-translate-x-[120%]';
  return (
    <span className="relative inline-flex size-[18px] overflow-hidden">
      <span className={cn('absolute inset-0 transition-transform duration-500 ease-out-expo', out)}>
        <Icon name={name} />
      </span>
      <span className={cn('absolute inset-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0', enter)}>
        <Icon name={name} />
      </span>
    </span>
  );
}

export function Button(props: LinkProps | ActionProps) {
  const { children, variant = 'primary', size = 'md', icon, magnetic = false, className } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-0 origin-bottom scale-y-0 rounded-[inherit] bg-ink transition-transform duration-500 ease-out-expo group-hover/btn:scale-y-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
        {icon && <SwapIcon name={icon} />}
      </span>
    </>
  );

  let element: ReactNode;
  if (props.href !== undefined) {
    const { href, external, download, onClick } = props;
    element = (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={props['aria-label']}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: '' } : {})}
      >
        {inner}
      </a>
    );
  } else {
    const { type = 'button', disabled, onClick } = props;
    element = (
      <button type={type} disabled={disabled} onClick={onClick} className={classes} aria-label={props['aria-label']}>
        {inner}
      </button>
    );
  }

  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}

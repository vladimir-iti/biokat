import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary';

const base =
  'group inline-flex h-13 items-center justify-center gap-3 rounded-[2px] px-8 font-semibold transition-colors duration-150 ease-[var(--ease-out-soft)] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-teal text-white hover:bg-teal-deep',
  secondary: 'border border-line bg-transparent text-ink hover:border-teal hover:text-teal',
};

function Arrow() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-150 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
    >
      <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
}

export function Button({
  href,
  variant = 'primary',
  className,
  children,
  withArrow = true,
  ...rest
}: CommonProps & { href: string } & React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </Link>
  );
}

export function ActionButton({
  variant = 'primary',
  className,
  children,
  withArrow = true,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {withArrow && <Arrow />}
    </button>
  );
}

/** Текстовая ссылка с прочерчиваемым подчёркиванием */
export function TextLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'link-draw inline-flex items-center gap-2 font-medium text-teal',
        className,
      )}
    >
      {children}
    </Link>
  );
}

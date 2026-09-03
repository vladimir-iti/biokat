import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Tag({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    'inline-flex items-center rounded-[2px] border border-line px-3 py-1 t-micro font-mono text-steel',
    href && 'transition-colors duration-150 hover:border-teal hover:text-teal',
    className,
  );

  return href ? (
    <Link href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <span className={classes}>{children}</span>
  );
}

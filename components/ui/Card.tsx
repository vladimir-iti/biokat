import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Карточка — модуль на DIN-рейке: прямые углы, обводка,
 * маркировочная полоса сверху, которая растёт при наведении.
 */
export function Card({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    'group relative block rounded-[2px] border border-line bg-panel',
    'transition-[border-color,transform,box-shadow] duration-150 ease-[var(--ease-out-soft)]',
    href &&
      'hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_6px_20px_rgba(14,26,31,0.08)]',
    className,
  );

  const stripe = (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[3px] bg-teal transition-[height] duration-150 ease-[var(--ease-out-soft)] group-hover:h-[5px]"
    />
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {stripe}
        {children}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {stripe}
      {children}
    </div>
  );
}

import { cn } from '@/lib/cn';

/**
 * Знак — узел схемы с отводами.
 *
 * Собран в кривых: один залитый контур, без штрихов. Холст нечётный (31),
 * поэтому линия толщиной в одну единицу ложится ровно по центру и знак
 * симметричен относительно обеих осей. При отрисовке 31 px масштаб 1:1 —
 * все грани попадают на границы пикселей, толщина линии равна линии шины.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 31 31"
      aria-hidden="true"
      className={cn('size-[31px] shrink-0', className)}
    >
      <path
        fill="currentColor"
        d="M15 0h1v31h-1zM0 15h31v1H0zM12 12h7v7h-7zM13 0h5v1h-5zM13 30h5v1h-5zM0 13h1v5H0zM30 13h1v5h-1z"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoMark className="text-teal" />
      <span className="flex flex-col leading-none">
        <span className="bus-wordmark font-display text-xl font-semibold tracking-[-0.02em] [--bus-wordmark-idle:var(--color-ink)]">
          БИОКАТ
        </span>
        <span className="mt-1 t-label-sm text-steel">Инженерные системы</span>
      </span>
    </span>
  );
}

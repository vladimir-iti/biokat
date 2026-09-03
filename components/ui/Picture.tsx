import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';

const WIDTHS = [640, 960, 1440];

function srcSet(base: string, ext: string) {
  return WIDTHS.map((w) => `${asset(base)}-${w}.${ext} ${w}w`).join(', ');
}

/**
 * Варианты изображений готовит scripts/images.ts —
 * при статическом экспорте рантайм-оптимизации нет.
 */
export function Picture({
  base,
  alt,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className,
  imgClassName,
  priority = false,
}: {
  base: string;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <picture className={cn('block', className)}>
      <source type="image/avif" srcSet={srcSet(base, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(base, 'webp')} sizes={sizes} />
      <img
        src={`${asset(base)}-960.jpg`}
        srcSet={srcSet(base, 'jpg')}
        sizes={sizes}
        alt={alt}
        width={1440}
        height={900}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </picture>
  );
}

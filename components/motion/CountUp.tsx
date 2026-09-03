'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Счётчик. В HTML лежит готовое значение (children),
 * скрипт лишь перебивает его после гидратации.
 */
export function CountUp({
  value,
  decimals = 0,
  children,
}: {
  value: number;
  decimals?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const format = (n: number) =>
      new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(n);

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const started = performance.now();
        const duration = 1200;
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(format(value * eased));
          if (t < 1) frame = requestAnimationFrame(step);
          else setDisplay(null);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, decimals]);

  return <span ref={ref}>{display ?? children}</span>;
}

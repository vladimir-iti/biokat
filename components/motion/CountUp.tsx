'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Счётчик. В HTML лежит готовое значение (children),
 * скрипт лишь перебивает его после гидратации.
 *
 * Если счётчик стоит внутри [data-countup-group], старт ждёт появления
 * всей группы, а не своего числа: так соседние счётчики трогаются разом,
 * даже когда на телефоне они стоят столбиком и видны не одновременно.
 * Длительность задаётся на месте — при близких длительностях маленькое
 * число набирается медленнее большого, и все приходят почти вместе.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1200,
  grouping = true,
  children,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  /** false — для годов: «2010», а не «2 010» */
  grouping?: boolean;
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
        useGrouping: grouping,
      }).format(n);

    const target = node.closest<HTMLElement>('[data-countup-group]') ?? node;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const started = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          // Отбрасываем, а не округляем: иначе маленькое число (3) показывало бы
          // итог уже на середине пути и «финишировало» раньше соседей
          const scale = 10 ** decimals;
          setDisplay(format(Math.floor(value * eased * scale) / scale));
          if (t < 1) frame = requestAnimationFrame(step);
          else setDisplay(null);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: target === node ? 0.6 : 0.3 },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, decimals, duration, grouping]);

  return <span ref={ref}>{display ?? children}</span>;
}

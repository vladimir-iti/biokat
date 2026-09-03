'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/** Высота рамки. Нечётная — тогда её середина приходится на .5,
 *  и квадратик со своей нечётной стороной садится на целые пиксели. */
const BOX_H = 31;
const INSET = 0.5;

/**
 * Название блока в рамке.
 *
 * Рамка нарисована всегда — в обесточенном виде. Поверх неё ток идёт двумя
 * симметричными путями: оба выходят из левой середины, один поверху, другой
 * понизу, и сходятся в правой середине. Длины путей равны, поэтому скорость
 * одинаковая и замыкание происходит в одной точке.
 *
 * Состоянием управляет BusRail через data-live на строке блока.
 */
export function BusLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const measure = () => setWidth(Math.ceil(el.getBoundingClientRect().width));

    measure();
    // Пока не подгрузился моноширинный шрифт, текст мерится фолбэком
    // и рамка выходит уже надписи — пересчитываем после загрузки.
    document.fonts?.ready.then(measure).catch(() => {});
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const w = width;
  const mid = BOX_H / 2;

  return (
    <span
      ref={boxRef}
      className={cn('bus-box relative flex w-fit items-center px-2.5', className)}
    >
      {w > 0 && (
        <svg
          aria-hidden="true"
          className="bus-outline pointer-events-none absolute inset-0"
          width={w}
          height={BOX_H}
          viewBox={`0 0 ${w} ${BOX_H}`}
          style={{ ['--bus-outline-length' as string]: mid - INSET + (w - INSET * 2) + mid - INSET }}
        >
          {/* Обесточенная рамка — видна всегда */}
          <rect
            className="bus-outline-idle"
            x={INSET}
            y={INSET}
            width={w - INSET * 2}
            height={BOX_H - INSET * 2}
          />
          <path className="bus-outline-live" d={`M${INSET} ${mid} V${INSET} H${w - INSET} V${mid}`} />
          <path
            className="bus-outline-live"
            d={`M${INSET} ${mid} V${BOX_H - INSET} H${w - INSET} V${mid}`}
          />
        </svg>
      )}
      <span className="bus-label-text t-label">{children}</span>
    </span>
  );
}

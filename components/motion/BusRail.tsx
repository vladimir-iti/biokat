'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Вертикальная шина.
 *
 * С первой прокруткой шина заползает на меню: подвод в шапке растёт снизу
 * вверх и замыкается на вертикали логотипа. Пока стыковка не завершилась,
 * вниз полоса не идёт — движение начинается только после соединения.
 *
 * Дальше полоса идёт равномерно по всей странице и не поспевает за скроллом,
 * а догоняет его. К положению добавлено опережение в треть экрана, иначе блок
 * загорался бы у самого верха экрана.
 *
 * Узлы включаются и выключаются по положению края полосы, поэтому при
 * обратной прокрутке ток уходит. Состояние ставится на строку блока
 * (data-live), а рисуют его уже стили: узел, линия, обводка названия.
 */
export function BusRail() {
  const rootRef = useRef<HTMLDivElement>(null);
  const upRef = useRef<HTMLDivElement>(null);
  const downRef = useRef<HTMLDivElement>(null);

  /** Шина живёт только на десктопе, но окно можно растянуть из узкого */
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const up = upRef.current;
    const down = downRef.current;
    if (!root || !up || !down) return;
    if (!wide) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    interface Node {
      row: HTMLElement | null;
      y: number;
      live: boolean;
      first: boolean;
    }

    interface Geometry {
      anchor: number;
      railBottom: number;
      downLength: number;
      /** Сколько нужно прокрутить, чтобы подвод дошёл до логотипа */
      connectDistance: number;
      /** Длина продолжения шины в подвале — от её конца до логотипа */
      footLength: number;
      /** Куда ток доходит в самом конце: конец шины плюс подвал */
      endpoint: number;
      nodes: Node[];
    }

    const connector = document.querySelector<HTMLElement>('.bus-connector');
    const mark = document.querySelector<SVGElement>('header svg');
    const footLine = document.querySelector<HTMLElement>('.bus-foot');
    const footIdle = document.querySelector<HTMLElement>('.bus-foot-idle');
    const footRow = document.querySelector<HTMLElement>('footer[data-bus-row]');
    const footMark = document.querySelector<SVGElement>('footer svg');

    let geometry: Geometry | null = null;
    let edge = 0;
    /** Насколько подвод дотянулся до логотипа, 0…1 */
    let connect = 0;
    let frame = 0;

    /** Пересчёт геометрии: меняется при ресайзе и когда страница растёт */
    const remeasure = () => {
      const rect = root.getBoundingClientRect();
      const elements = Array.from(document.querySelectorAll<HTMLElement>('.bus-node'));
      if (elements.length === 0 || rect.height <= 0) {
        geometry = null;
        return;
      }

      const railTop = rect.top + window.scrollY;
      const railBottom = railTop + rect.height;

      const nodes = elements.map((el) => {
        const box = el.getBoundingClientRect();
        const row = el.closest<HTMLElement>('[data-bus-row]');
        return {
          row,
          y: box.top + window.scrollY + box.height / 2,
          live: row?.dataset.live === 'true',
          first: el.dataset.first === 'true',
        };
      });

      const anchor = nodes[0].y;

      // Подвод: от нижней грани вертикали знака до нижнего края шапки
      let connectDistance = 1;
      if (connector && mark) {
        const header = connector.closest('header');
        const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
        const markBottom = mark.getBoundingClientRect().bottom;
        const height = Math.max(0, headerBottom - markBottom);
        connector.style.bottom = '-1px';
        connector.style.height = `${height}px`;
        connectDistance = Math.max(1, headerBottom);
      }

      // Продолжение в подвале: от конца шины до верхней грани знака
      let footLength = 0;
      if (footLine && footIdle && footMark) {
        const markTop = footMark.getBoundingClientRect().top + window.scrollY;
        footLength = Math.max(0, markTop - railBottom);
        footLine.style.height = `${footLength}px`;
        footIdle.style.height = `${footLength}px`;
      }

      geometry = {
        anchor,
        railBottom,
        downLength: Math.max(1, railBottom - anchor),
        connectDistance,
        footLength,
        endpoint: railBottom + footLength,
        nodes,
      };

      // Высоты отрезков зависят только от геометрии, не от прокрутки
      up.style.height = `${anchor - railTop}px`;
      down.style.height = `${geometry.downLength}px`;

      edge = Math.min(geometry.endpoint, Math.max(anchor, edge || target()));
      connect = connect || connectTarget();
      paint();
    };

    /** Насколько подвод должен быть вытянут при текущей прокрутке */
    const connectTarget = () => {
      if (!geometry) return 0;
      return Math.min(1, Math.max(0, window.scrollY / geometry.connectDistance));
    };

    /** Куда полоса стремится при текущей прокрутке */
    const target = () => {
      if (!geometry) return 0;

      // Вниз считаем только ту прокрутку, что осталась после стыковки
      // с логотипом: до неё полоса стоит на первом узле.
      const after = Math.max(0, window.scrollY - geometry.connectDistance);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight -
          window.innerHeight -
          geometry.connectDistance,
      );
      const progress = Math.min(1, after / maxScroll);
      const lead = Math.min(window.innerHeight * 0.35, after);

      return Math.min(
        geometry.endpoint,
        geometry.anchor + (geometry.endpoint - geometry.anchor) * progress + lead,
      );
    };

    const paint = () => {
      if (!geometry) return;
      const { anchor, downLength, nodes } = geometry;

      const { railBottom, footLength, endpoint } = geometry;

      down.style.transform = `scaleY(${Math.min(1, Math.max(0, (edge - anchor) / downLength))})`;
      if (connector) connector.style.transform = `scaleY(${connect})`;

      if (footLine && footLength > 0) {
        const filled = Math.min(1, Math.max(0, (edge - railBottom) / footLength));
        footLine.style.transform = `scaleY(${filled})`;
      }

      // Ток дошёл до знака в подвале — загораются обе вывески разом
      const lit = String(edge >= endpoint - 0.5);
      if (footRow && footRow.dataset.live !== lit) footRow.dataset.live = lit;
      if (document.documentElement.dataset.busLit !== lit) {
        document.documentElement.dataset.busLit = lit;
      }

      for (const node of nodes) {
        // Первый узел запитан всегда — его состояние задано в разметке
        if (node.first) continue;
        const live = edge >= node.y;
        if (live === node.live) continue;
        node.live = live;
        node.row?.setAttribute('data-live', String(live));
      }
    };

    const tick = () => {
      frame = 0;
      const distance = target() - edge;
      const connectDistance = connectTarget() - connect;
      const settled = Math.abs(distance) < 0.5 && Math.abs(connectDistance) < 0.005;

      // Догоняющее движение: чем дальше цель, тем быстрее ход
      edge += settled ? distance : distance * 0.055;
      connect += settled ? connectDistance : connectDistance * 0.12;
      paint();

      if (!settled) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!geometry) return;
      if (reduced) {
        edge = target();
        connect = connectTarget();
        paint();
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    remeasure();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure, { passive: true });
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      observer.disconnect();
      cancelAnimationFrame(frame);
      // Окно сузили до мобильного — шины больше нет, гасим вывеску
      delete document.documentElement.dataset.busLit;
    };
  }, [wide]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <div className="mx-auto h-full w-full max-w-site px-16">
        <div className="relative h-full">
          <div className="absolute inset-y-0 left-0 w-px bg-line" />
          {/* Отрезок вверх от первого узла — нарисован всегда */}
          <div ref={upRef} className="bus-up absolute left-0 top-0 w-px bg-teal" />
          {/* Полоса вниз — растёт с прокруткой */}
          <div
            ref={downRef}
            className="bus-down absolute bottom-0 left-0 w-px origin-top bg-teal"
          />
        </div>
      </div>
    </div>
  );
}

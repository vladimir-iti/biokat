/**
 * Узел на шине и горизонтальная линия до рамки названия блока.
 *
 * Вертикальные отступы считаются от высоты рамки, чтобы линия входила
 * ровно в её левую середину.
 *
 * Первый узел страницы горит всегда и без анимации; остальными управляет
 * BusRail через data-live на строке блока.
 */
export function BusNode({ first = false }: { first?: boolean }) {
  const line = 'absolute left-0 top-[calc((var(--bus-box-h)-1px)/2)] block h-px';
  const width = 'w-[var(--bus-offset)]';

  return (
    <>
      {/* Обесточенная линия — видна всегда */}
      <span aria-hidden="true" className={`${line} ${width} bg-current opacity-20`} />
      <span aria-hidden="true" className={`bus-tap ${line} ${width} origin-left bg-teal`} />
      <span
        aria-hidden="true"
        data-first={first ? 'true' : undefined}
        className="bus-node absolute left-0 top-[calc((var(--bus-box-h)-7px)/2)] block size-[7px] -translate-x-[3px]"
      />
    </>
  );
}

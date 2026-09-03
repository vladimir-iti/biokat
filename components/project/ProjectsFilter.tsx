'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface FilterOption {
  id: string;
  title: string;
}

/**
 * Фильтры работают поверх серверной разметки: карточки уже в HTML,
 * клиент только скрывает несовпадающие. Состояние пишется в адрес,
 * чтобы отфильтрованную выборку можно было отправить ссылкой.
 */
export function ProjectsFilter({
  types,
  services,
  regions,
  children,
}: {
  types: FilterOption[];
  services: FilterOption[];
  regions: string[];
  children: React.ReactNode;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [visible, setVisible] = useState<number | null>(null);

  // Начальное состояние берём из адреса уже после гидратации:
  // страница пререндерится полной, и такой её видит поисковик.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setType(params.get('type'));
    setService(params.get('service'));
    setRegion(params.get('region'));
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let shown = 0;
    for (const item of Array.from(grid.children) as HTMLElement[]) {
      const matches =
        (!type || item.dataset.type === type) &&
        (!service || (item.dataset.services ?? '').split(' ').includes(service)) &&
        (!region || item.dataset.region === region);
      item.hidden = !matches;
      if (matches) shown += 1;
    }
    setVisible(shown);

    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (service) params.set('service', service);
    if (region) params.set('region', region);
    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  }, [type, service, region]);

  const chip = (active: boolean) =>
    cn(
      'inline-flex items-center gap-2 rounded-[2px] border px-4 py-2 t-small transition-colors duration-150',
      active
        ? 'border-ink bg-ink text-paper'
        : 'border-line bg-panel text-ink hover:border-teal hover:text-teal',
    );

  const reset = type || service || region;

  return (
    <div>
      <div className="border-y border-line py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-label mr-2 text-steel">Тип объекта</span>
            <button type="button" onClick={() => setType(null)} className={chip(!type)}>
              Все
            </button>
            {types.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setType(option.id)}
                className={chip(type === option.id)}
              >
                {option.title}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="t-label mr-2 text-steel">Направление</span>
            <button
              type="button"
              onClick={() => setService(null)}
              className={chip(!service)}
            >
              Все
            </button>
            {services.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setService(option.id)}
                className={chip(service === option.id)}
              >
                {option.title}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="region" className="t-label text-steel">
              Регион
            </label>
            <select
              id="region"
              value={region ?? ''}
              onChange={(event) => setRegion(event.target.value || null)}
              className="h-11 rounded-[2px] border border-line bg-panel px-3 t-small outline-none transition-colors focus:border-teal"
            >
              <option value="">Все регионы</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {visible !== null && (
              <span className="font-mono t-micro text-steel">
                Показано: {visible}
              </span>
            )}

            {reset && (
              <button
                type="button"
                onClick={() => {
                  setType(null);
                  setService(null);
                  setRegion(null);
                }}
                className="link-draw t-small font-medium text-teal"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>
      </div>

      <div ref={gridRef} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>

      {visible === 0 && (
        <p className="mt-10 border border-line bg-panel p-8 text-steel">
          По выбранным условиям объектов нет. Снимите часть фильтров — или{' '}
          <Link href="/contacts/" className="link-draw font-medium text-teal">
            спросите напрямую
          </Link>
          : показываем не всё.
        </p>
      )}
    </div>
  );
}

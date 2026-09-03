'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { contractObject, formatMillions, yearOf, yearRange } from '@/lib/format';
import type { Contract } from '@/lib/types';

type SortKey = 'id' | 'client' | 'year' | 'amount';
type Direction = 'asc' | 'desc';

const columns: { key: SortKey; title: string; align?: 'right' }[] = [
  { key: 'id', title: '№' },
  { key: 'client', title: 'Заказчик' },
  { key: 'year', title: 'Годы' },
  { key: 'amount', title: 'Сумма', align: 'right' },
];

/**
 * Таблица приходит в HTML уже заполненной и отсортированной по умолчанию.
 * Клиент только меняет порядок строк — без JS реестр остаётся читаемым.
 */
export function ContractsTable({ contracts }: { contracts: Contract[] }) {
  const [sort, setSort] = useState<{ key: SortKey; direction: Direction }>({
    key: 'id',
    direction: 'desc',
  });

  const rows = useMemo(() => {
    const sign = sort.direction === 'asc' ? 1 : -1;
    return [...contracts].sort((a, b) => {
      switch (sort.key) {
        case 'client':
          return sign * a.client.localeCompare(b.client, 'ru');
        case 'year':
          return sign * ((yearOf(a.signed) ?? 0) - (yearOf(b.signed) ?? 0));
        case 'amount':
          return sign * (a.amount - b.amount);
        default:
          return sign * (a.id - b.id);
      }
    });
  }, [contracts, sort]);

  const toggle = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'client' ? 'asc' : 'desc' },
    );

  return (
    <div className="overflow-x-auto">
      <table className="table-cards w-full text-left md:min-w-[860px]">
        <caption className="sr-only">
          Реестр исполненных договоров ООО «ГК «Биокат»
        </caption>
        <thead>
          <tr className="border-b border-ink/20">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  sort.key === column.key
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                className={cn(
                  'py-3 pr-4 font-medium',
                  column.align === 'right' && 'text-right',
                  column.key === 'client' && 'w-56',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(column.key)}
                  className={cn(
                    't-label inline-flex items-center gap-2 transition-colors duration-150 hover:text-teal',
                    sort.key === column.key ? 'text-ink' : 'text-steel',
                  )}
                >
                  {column.title}
                  <span aria-hidden="true" className="font-mono">
                    {sort.key === column.key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="t-label py-3 font-medium text-steel">
              Объект
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((contract) => (
            <tr
              key={contract.id}
              className="border-b border-line align-top transition-colors duration-150 hover:bg-teal/4"
            >
              <td data-label="№" className="py-4 pr-4 font-mono t-micro text-steel">
                {contract.id}
              </td>
              <td data-label="Заказчик" className="py-4 pr-4 font-medium">{contract.client}</td>
              <td data-label="Годы" className="py-4 pr-4 font-mono t-micro whitespace-nowrap">
                {contract.status === 'active' ? (
                  <span className="text-teal">в работе</span>
                ) : (
                  yearRange(contract.signed, contract.finished)
                )}
              </td>
              <td data-label="Сумма" className="py-4 pr-4 text-right font-mono tnum whitespace-nowrap md:text-right">
                {formatMillions(contract.amount)} млн ₽
              </td>
              <td data-label="Объект" className="py-4 t-small text-steel">
                {contract.project ? (
                  <Link
                    href={`/projects/${contract.project}/`}
                    className="link-draw text-ink transition-colors hover:text-teal"
                  >
                    {contractObject(contract.description)}
                  </Link>
                ) : (
                  contractObject(contract.description)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

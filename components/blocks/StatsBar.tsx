import Link from 'next/link';
import { CountUp } from '@/components/motion/CountUp';
import { Container } from '@/components/ui/Container';
import { formatMillions, plural } from '@/lib/format';
import { registryPeriod, totalAmount, totalContracts } from '@/lib/queries';
import { company } from '@/content/company';
import { documents } from '@/content/documents';
import { cn } from '@/lib/cn';

interface Stat {
  value: React.ReactNode;
  unit?: string;
  /** Подпись всегда в две строки — так подписи всех ячеек стоят вровень */
  title: [string, string];
  href: string;
  accent?: boolean;
}

/*
 * Длительности счётчиков: близкие, но не равные. Все трогаются разом,
 * маленькие числа набираются медленнее больших, а финишируют слева направо
 * с небольшим шагом — почти вместе, но не одним щелчком.
 */
const DURATION = 1800;
const FINISH_STEP = 150;

/*
 * Рамки и отступы ячеек заданы по позиции, а не через divide-x: в раскладке
 * 2×2 divide-x оставлял линию у правого края и не ставил её между рядами.
 * Крайние колонки прижаты к краям контента, внутренние — с полями с двух сторон.
 *   телефон: одна колонка, линия под каждой ячейкой, кроме последней;
 *   планшет: 2×2, вертикаль после левой колонки и линия между рядами;
 *   десктоп: 4 в ряд, вертикали между ячейками.
 */
const cellBorders = [
  'border-b sm:border-r lg:border-b-0',
  'border-b lg:border-b-0 lg:border-r',
  'border-b sm:border-b-0 sm:border-r',
  '',
];

const cellPadding = [
  'sm:pr-8 lg:pr-6',
  'sm:pl-8 lg:px-6',
  'sm:pr-8 lg:px-6',
  'sm:pl-8 lg:pl-6',
];

export function StatsBar() {
  const sroCount = documents.filter((item) => item.kind === 'sro').length;
  const stats: Stat[] = [
    {
      value: (
        <CountUp value={totalContracts} duration={DURATION}>
          {totalContracts}
        </CountUp>
      ),
      title: [plural(totalContracts, ['договор', 'договора', 'договоров']), registryPeriod],
      href: '/experience/',
    },
    {
      value: (
        <CountUp value={totalAmount / 1000} decimals={1} duration={DURATION + FINISH_STEP}>
          {formatMillions(totalAmount)}
        </CountUp>
      ),
      unit: 'млн ₽',
      title: ['общая сумма', 'договоров'],
      href: '/experience/',
      accent: true,
    },
    {
      value: (
        <>
          <CountUp value={sroCount} duration={DURATION + FINISH_STEP * 2}>
            {sroCount}
          </CountUp>{' '}
          СРО
        </>
      ),
      title: ['изыскания, проект', 'и строительство'],
      href: '/certificates/',
    },
    {
      value: (
        <>
          с{' '}
          <CountUp value={company.since} grouping={false} duration={DURATION + FINISH_STEP * 3}>
            {company.since}
          </CountUp>
        </>
      ),
      title: ['года на инженерных', 'системах'],
      href: '/about/',
    },
  ];

  return (
    <section className="border-y border-line bg-panel">
      <Container>
        <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
          <div className="relative hidden lg:block" aria-hidden="true">
          </div>
          {/* Прямыми детьми dl могут быть только dt, dd и div — ссылка лежит
              внутри div, иначе список определений распадается для скринридера.
              Разделители и рамки держит div: он же ячейка сетки.
              @container — от ширины полосы на десктопе считается кегль цифр:
              он одинаков во всех ячейках и не выходит за разделители.
              data-countup-group — счётчики стартуют разом, когда видна полоса. */}
          <dl data-countup-group className="@container grid sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.href + index} className={cn('border-line', cellBorders[index])}>
                <Link
                  href={stat.href}
                  className={cn(
                    'group block py-8 transition-colors duration-150 sm:py-10 lg:py-12',
                    cellPadding[index],
                  )}
                >
                  <dd
                    className="t-data flex flex-wrap items-baseline gap-x-2 gap-y-1 whitespace-nowrap transition-colors duration-150 group-hover:text-teal lg:text-[length:min(3.8cqi,4rem)]"
                  >
                    <span className={stat.accent ? 'text-teal' : undefined}>{stat.value}</span>
                    {stat.unit && (
                      // leading-none: высота строки подписи единицы иначе
                      // опускала бы подпись под этой ячейкой на пару пикселей
                      <span className="font-sans text-[0.9375rem] leading-none font-medium text-steel">
                        {stat.unit}
                      </span>
                    )}
                  </dd>
                  <dt className="t-small mt-4 text-steel">
                    {/* nowrap — ровно две строки на любой ширине: строки подобраны
                        так, чтобы влезать в самую узкую ячейку (1024px) */}
                    <span className="block whitespace-nowrap">{stat.title[0]}</span>
                    <span className="block whitespace-nowrap">{stat.title[1]}</span>
                  </dt>
                </Link>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

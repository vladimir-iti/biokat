import Link from 'next/link';
import { CountUp } from '@/components/motion/CountUp';
import { Container } from '@/components/ui/Container';
import { formatMillions } from '@/lib/format';
import { totalAmount, totalContracts } from '@/lib/queries';
import { company } from '@/content/company';
import { cn } from '@/lib/cn';

interface Stat {
  value: React.ReactNode;
  unit?: string;
  title: string;
  href: string;
  accent?: boolean;
  /** Текстовые значения набираются мельче — иначе ломают сетку */
  text?: boolean;
}

export function StatsBar() {
  const stats: Stat[] = [
    {
      value: <CountUp value={totalContracts}>{totalContracts}</CountUp>,
      title: 'исполненных договоров с 2016 года',
      href: '/experience/',
    },
    {
      value: (
        <CountUp value={totalAmount / 1000} decimals={1}>
          {formatMillions(totalAmount)}
        </CountUp>
      ),
      unit: 'млн ₽',
      title: 'общая сумма договоров',
      href: '/experience/',
      accent: true,
    },
    {
      value: 'Бессрочно',
      title: 'лицензия МЧС № 77-Б/05039',
      href: '/certificates/',
      text: true,
    },
    {
      value: `с ${company.since}`,
      title: 'года на инженерных системах',
      href: '/about/',
      text: true,
    },
  ];

  return (
    <section className="border-y border-line bg-panel">
      <Container>
        <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
          <div className="relative hidden lg:block" aria-hidden="true">
          </div>
          <dl className="grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.title}
                href={stat.href}
                className="group border-b border-line px-0 py-8 transition-colors duration-150 last:border-b-0 sm:border-b-0 sm:px-8 sm:py-10 sm:first:pl-0 lg:py-12"
              >
                <dd
                  className={cn(
                    'flex items-baseline gap-2 transition-colors duration-150 group-hover:text-teal',
                    stat.text
                      ? 'font-display text-3xl font-medium leading-none tracking-[-0.02em] lg:text-4xl'
                      : 't-data',
                  )}
                >
                  <span className={stat.accent ? 'text-teal' : undefined}>{stat.value}</span>
                  {stat.unit && (
                    <span className="whitespace-nowrap font-sans t-small font-medium text-steel">
                      {stat.unit}
                    </span>
                  )}
                </dd>
                <dt className="t-small mt-4 max-w-[22ch] text-steel">{stat.title}</dt>
              </Link>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

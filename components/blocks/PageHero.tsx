import Link from 'next/link';
import { BusLabel } from '@/components/motion/BusLabel';
import { BusNode } from '@/components/motion/BusNode';
import { Container } from '@/components/ui/Container';

export interface Crumb {
  title: string;
  href?: string;
}

export function PageHero({
  label,
  title,
  lead,
  crumbs = [],
  aside,
}: {
  label?: string;
  title: string;
  lead?: React.ReactNode;
  crumbs?: Crumb[];
  aside?: React.ReactNode;
}) {
  return (
    <section data-page-hero className="bg-paper pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        {/* Две строки: крошки идут выше, чтобы узел встал напротив метки блока —
            так же, как на главной. */}
        <div
          data-bus-row
          data-live="true"
          data-static="true"
          className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
          {crumbs.length > 0 && (
            <>
              <div className="hidden lg:block" aria-hidden="true" />
              <nav aria-label="Хлебные крошки" className="mb-6">
                <ol className="flex flex-wrap items-center gap-2 t-label-sm text-steel">
                  <li>
                    <Link href="/" className="transition-colors hover:text-teal">
                      Главная
                    </Link>
                  </li>
                  {crumbs.map((crumb) => (
                    <li key={crumb.title} className="flex min-w-0 items-center gap-2">
                      <span aria-hidden="true">/</span>
                      {crumb.href ? (
                        <Link href={crumb.href} className="transition-colors hover:text-teal">
                          {crumb.title}
                        </Link>
                      ) : (
                        <span className="text-ink">{crumb.title}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}

          <div className="relative hidden lg:block" aria-hidden="true">
            <BusNode first />
          </div>

          <div>
            {label && <BusLabel className="mb-6">{label}</BusLabel>}

            <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
              <div>
                <h1 className="t-h1 max-w-[18ch]">{title}</h1>
                {lead && <p className="t-lead measure mt-8 text-steel">{lead}</p>}
              </div>
              {aside && <div className="mt-10 shrink-0 lg:mt-0">{aside}</div>}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

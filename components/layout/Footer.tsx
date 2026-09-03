import Link from 'next/link';
import { LogoMark } from '@/components/layout/Logo';
import { Container } from '@/components/ui/Container';
import { company } from '@/content/company';
import { asset } from '@/lib/asset';
import { downloads } from '@/content/documents';
import { mainNav } from '@/content/nav';
import { services } from '@/content/services';

export function Footer() {
  return (
    <footer data-bus-row className="bg-ink text-paper">
      <Container className="relative py-16 md:py-20">
        {/* Продолжение шины до логотипа: обесточенная линия видна всегда,
            поверх неё сверху вниз приходит ток. Геометрию задаёт BusRail. */}
        <span
          aria-hidden="true"
          className="bus-foot-idle pointer-events-none absolute top-0 hidden w-px bg-line lg:left-16 lg:block"
        />
        <span
          aria-hidden="true"
          className="bus-foot pointer-events-none absolute top-0 hidden w-px origin-top bg-teal lg:left-16 lg:block"
        />
        {/* Всё содержимое подвала сдвинуто влево на внутренний отступ знака:
            вертикаль логотипа встаёт на линию шины, а колонки считаются от него */}
        <div className="lg:ml-[calc(-1*var(--logo-line-inset))]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="text-teal" />
              <span className="bus-wordmark font-display text-xl font-semibold tracking-[-0.02em] [--bus-wordmark-idle:var(--color-paper)]">
                БИОКАТ
              </span>
            </div>
            <p className="mt-6 max-w-xs t-small leading-relaxed text-paper/60">
              Электроснабжение, пожарная безопасность, автоматика и производство
              низковольтных шкафов. Работаем с {company.since} года.
            </p>
          </div>

          <nav aria-label="Направления">
            <p className="t-label mb-6 text-paper/40">Направления</p>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="t-small text-paper/75 transition-colors duration-150 hover:text-teal"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Разделы">
            <p className="t-label mb-6 text-paper/40">Разделы</p>
            <ul className="space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-small text-paper/75 transition-colors duration-150 hover:text-teal"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="t-label mb-6 text-paper/40">Контакты</p>
            <a
              href={`tel:${company.phoneHref}`}
              className="block font-mono text-lg tracking-tight transition-colors duration-150 hover:text-teal"
            >
              {company.phone}
            </a>
            <a
              href={`mailto:${company.emailHref}`}
              className="mt-2 block t-small text-paper/75 transition-colors duration-150 hover:text-teal"
            >
              {company.email}
            </a>
            <p className="mt-4 t-small leading-relaxed text-paper/55">
              {company.hours}
            </p>
            <p className="mt-4 t-small leading-relaxed text-paper/55">
              {company.addressLegal}
            </p>

            <ul className="mt-6 space-y-2">
              {downloads.map((item) => (
                <li key={item.id}>
                  <a
                    href={asset(item.file)}
                    className="inline-flex items-center gap-2 t-label-sm text-teal transition-opacity hover:opacity-75"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M6 1v8M3 6l3 3 3-3M1 11h10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        fill="none"
                      />
                    </svg>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/20 pt-8 t-micro text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            {company.legalNameShort} · ИНН 5029213177 · ОГРН 1165029056400
          </p>
          <Link href="/privacy/" className="transition-colors hover:text-paper/80">
            Политика конфиденциальности
          </Link>
        </div>
        </div>
      </Container>
    </footer>
  );
}

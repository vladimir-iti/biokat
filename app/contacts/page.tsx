import type { Metadata } from 'next';
import { ContactForm } from '@/components/blocks/ContactForm';
import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { company } from '@/content/company';
import { asset } from '@/lib/asset';
import { downloads } from '@/content/documents';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Контакты',
  description:
    'Телефон +7 (495) 142-45-78, почта info@биокат.рф. Офис — Москва, ул. Скобелевская, 22. Производство — Мытищинский район, Дмитровское шоссе, 36. Полные реквизиты ООО «ГК «Биокат».',
  path: '/contacts/',
});

const mapUrl = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
  'Москва, улица Скобелевская, 22',
)}&z=16`;

export default function ContactsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'Контакты', path: '/contacts/' }]),
          ),
        }}
      />

      <PageHero
        label="Москва · Мытищинский район"
        title="Расскажите о задаче"
        lead="Отвечаем в рабочее время. Если вопрос срочный — звоните, это быстрее формы."
        crumbs={[{ title: 'Контакты' }]}
      />

      <section className="pb-24 md:pb-32 lg:pb-40">
        <Container>
          <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
            <div className="relative hidden lg:block" aria-hidden="true">
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <a
                  href={`tel:${company.phoneHref}`}
                  className="block font-mono text-2xl tracking-tight transition-colors hover:text-teal md:text-3xl"
                >
                  {company.phone}
                </a>
                <a
                  href={`mailto:${company.emailHref}`}
                  className="mt-3 block text-lg transition-colors hover:text-teal"
                >
                  {company.email}
                </a>

                <dl className="mt-10 divide-y divide-line border-y border-line">
                  <div className="py-4">
                    <dt className="t-label text-steel">Время работы</dt>
                    <dd className="mt-2">{company.hours}</dd>
                  </div>
                  <div className="py-4">
                    <dt className="t-label text-steel">Офис и юридический адрес</dt>
                    <dd className="mt-2">{company.addressLegal}</dd>
                  </div>
                  <div className="py-4">
                    <dt className="t-label text-steel">Производство</dt>
                    <dd className="mt-2">{company.addressProduction}</dd>
                  </div>
                </dl>

                <ul className="mt-8 space-y-3">
                  {downloads.map((item) => (
                    <li key={item.id}>
                      <a
                        href={asset(item.file)}
                        className="link-draw inline-flex items-center gap-2 font-medium text-teal"
                      >
                        {item.title} · {item.format}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <ContactForm phone={company.phone} phoneHref={company.phoneHref} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-panel">
        <iframe
          src={mapUrl}
          title="Офис ГК «Биокат» на карте"
          loading="lazy"
          className="h-[420px] w-full border-0 grayscale-[0.15]"
        />
        <Container>
          <p className="py-4 t-small text-steel">
            {company.addressLegal} ·{' '}
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(
                'Москва, улица Скобелевская, 22',
              )}`}
              target="_blank"
              rel="noreferrer"
              className="link-draw font-medium text-teal"
            >
              Открыть в Яндекс.Картах
            </a>
          </p>
        </Container>
      </section>

      <Section label="Реквизиты" title="Для договора и проверки контрагента">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <dl className="divide-y divide-line border-y border-line">
            {company.requisites.map((item) => (
              <div
                key={item.label}
                className="py-4 sm:flex sm:items-baseline sm:justify-between sm:gap-6"
              >
                <dt className="text-steel">{item.label}</dt>
                <dd className="mt-1 font-medium sm:mt-0 sm:text-right">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-6">
            {company.banks.map((bank) => (
              <div key={bank.account} className="border border-line bg-panel p-6">
                <p className="font-medium">{bank.name}</p>
                <dl className="mt-4 space-y-2 font-mono t-micro">
                  <div className="flex gap-3">
                    <dt className="w-16 text-steel">Р/с</dt>
                    <dd className="tnum">{bank.account}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 text-steel">БИК</dt>
                    <dd className="tnum">{bank.bik}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-16 text-steel">К/с</dt>
                    <dd className="tnum">{bank.corr}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

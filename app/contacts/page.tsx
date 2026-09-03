import type { Metadata } from 'next';
import { ContactForm } from '@/components/blocks/ContactForm';
import { PageHero } from '@/components/blocks/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { AddressLink } from '@/components/ui/AddressLink';
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

const brief = [
  {
    title: 'Объект и задача',
    text: 'Что за здание, какие системы нужны, новое строительство или реконструкция действующего.',
  },
  {
    title: 'Проект или схема',
    text: 'Рабочая документация, однолинейная схема, планировки. Проекта нет — посчитаем от задачи.',
  },
  {
    title: 'Сроки',
    text: 'Когда выходить на площадку и к какой дате сдавать. От этого зависит, сколько бригад ставим.',
  },
  {
    title: 'Формат договора',
    text: 'Прямой договор, субподряд или конкурсная процедура. Скажите, если нужен пакет для тендера.',
  },
];

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
                    <dd className="mt-2">
                      <AddressLink
                        address={company.addressLegal}
                        street={company.addressLegalStreet}
                        map={company.addressLegalMap}
                      />
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="t-label text-steel">Производство</dt>
                    <dd className="mt-2">
                      <AddressLink
                        address={company.addressProduction}
                        street={company.addressProductionStreet}
                        map={company.addressProductionMap}
                      />
                    </dd>
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

      <Section
        tone="panel"
        label="Перед запросом"
        title="Что ускорит ответ"
        lead="Ничего из этого не обязательно: если под рукой только адрес объекта — начнём с него. Но чем точнее вводные, тем содержательнее будет первый ответ и тем меньше уточняющих писем."
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {brief.map((item, index) => (
            <Reveal key={item.title} delay={index * 50} className="h-full">
              <article className="h-full bg-paper p-6">
                <h3 className="t-h4 text-teal">{item.title}</h3>
                <p className="t-small mt-3 text-steel">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

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

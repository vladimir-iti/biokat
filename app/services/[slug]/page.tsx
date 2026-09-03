import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { SwitchboardsBlock } from '@/components/blocks/SwitchboardsBlock';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { formatMillions } from '@/lib/format';
import { contractsForService, projectsForService } from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata, serviceJsonLd } from '@/lib/seo';
import type { ServiceSlug } from '@/lib/types';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}/`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const isSwitchboards = service.slug === 'switchboards';
  const isFireSafety = service.slug === 'fire-safety';

  const projects = projectsForService(service.slug as ServiceSlug).slice(0, 3);
  const contracts = contractsForService(service.slug as ServiceSlug)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
  const neighbours = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceJsonLd(
              service.title,
              service.seo.description,
              `/services/${service.slug}/`,
            ),
            breadcrumbsJsonLd([
              { name: 'Услуги', path: '/services/' },
              { name: service.title, path: `/services/${service.slug}/` },
            ]),
          ]),
        }}
      />

      <PageHero
        label={service.label}
        title={service.title}
        lead={service.lead}
        crumbs={[{ title: 'Услуги', href: '/services/' }, { title: service.title }]}
        aside={
          <Button href="/contacts/">
            {isSwitchboards ? 'Отправить спецификацию' : 'Обсудить задачу'}
          </Button>
        }
      />

      {isFireSafety && (
        <Section tone="ink" label="Срочно" title="Пришло предписание МЧС?">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <p className="t-lead text-paper/75">
              Выезжаем на объект, читаем предписание, обследуем системы и готовим решение,
              которое закрывает пункты. Работы ведём по бессрочной лицензии
              № 77-Б/05039 — её реквизиты можно указать в ответе надзорному органу.
            </p>
            <div>
              <a
                href={`tel:${company.phoneHref}`}
                className="block font-mono text-2xl tracking-tight text-teal transition-opacity hover:opacity-80 md:text-3xl"
              >
                {company.phone}
              </a>
              <p className="t-small mt-3 text-paper/50">{company.hours}</p>
            </div>
          </div>
        </Section>
      )}

      <Section
        tone="panel"
        label="Состав работ"
        title="Что входит в услугу"
      >
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {service.includes.map((item, index) => (
            <li key={item} className="flex gap-4 bg-panel p-6">
              <span className="mt-2 block size-[7px] shrink-0 bg-teal" aria-hidden="true" />
              <span>
                <span className="sr-only">Пункт {index + 1}. </span>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        label="Задачи"
        title="С чем к нам приходят"
        lead="Типовые постановки задач, по которым мы уже работали."
      >
        <ul className="divide-y divide-line border-y border-line">
          {service.tasks.map((task) => (
            <li key={task} className="flex items-baseline gap-6 py-6">
              <span
                className="block h-px w-8 shrink-0 translate-y-[-4px] bg-teal"
                aria-hidden="true"
              />
              <span className="t-h4 font-normal">{task}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="panel"
        label="Почему мы"
        title="На чём держится наша уверенность"
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {service.strengths.map((strength, index) => (
            <Reveal key={strength.title} delay={index * 60} className="h-full">
              <article className="h-full bg-panel p-6">
                <h3 className="t-h4 text-teal">{strength.title}</h3>
                <p className="mt-3 text-steel">{strength.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {isSwitchboards && <SwitchboardsBlock />}

      {projects.length > 0 && (
        <Section
          label="Объекты"
          title={`Где мы это делали`}
          headerAside={
            <Button href="/projects/" variant="secondary">
              Все объекты
            </Button>
          }
        >
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 60} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {contracts.length > 0 && (
        <Section
          tone="panel"
          label="Договоры"
          title="Крупнейшие договоры по направлению"
          lead="Из реестра исполненных договоров — с заказчиками, сроками и суммами."
          headerAside={
            <Button href="/experience/" variant="secondary">
              Весь реестр
            </Button>
          }
        >
          <ul className="divide-y divide-line border-y border-line">
            {contracts.map((contract) => (
              <li
                key={contract.id}
                className="flex flex-col gap-2 py-4 md:flex-row md:items-baseline md:gap-8"
              >
                <span className="font-mono t-micro text-steel md:w-10">
                  {contract.id}
                </span>
                <span className="font-medium md:w-64">{contract.client}</span>
                <span className="flex-1 t-small text-steel">
                  {contract.description}
                </span>
                <span className="font-mono tnum whitespace-nowrap md:text-right">
                  {formatMillions(contract.amount)} млн ₽
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section label="Смежное" title="Соседние направления">
        <div className="grid gap-6 md:grid-cols-3">
          {neighbours.map((item) => (
            <Card key={item.slug} href={`/services/${item.slug}/`} className="h-full">
              <div className="p-6">
                <Label className="mb-4">{item.label}</Label>
                <h3 className="t-h4 transition-colors group-hover:text-teal">
                  {item.title}
                </h3>
                <p className="t-small mt-3 text-steel">{item.short}</p>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-steel">
          Нужен полный цикл?{' '}
          <Link href="/services/" className="link-draw font-medium text-teal">
            Все направления
          </Link>
        </p>
      </Section>

      <CtaBlock
        variant={isSwitchboards ? 'spec' : 'default'}
        label={isSwitchboards ? 'Расчёт' : 'Заявка'}
        title={isSwitchboards ? 'Пришлите спецификацию — посчитаем' : 'Расскажите о задаче'}
        lead={
          isSwitchboards
            ? 'Однолинейная схема, спецификация или просто список щитов. Ответим с расчётом и сроками.'
            : 'Ответим в рабочее время. Для срочных вопросов — телефон: быстрее, чем форма.'
        }
      />
    </>
  );
}

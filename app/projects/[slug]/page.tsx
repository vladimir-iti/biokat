import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { BusLabel } from '@/components/motion/BusLabel';
import { BusNode } from '@/components/motion/BusNode';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Picture } from '@/components/ui/Picture';
import { Section } from '@/components/ui/Section';
import { Tag } from '@/components/ui/Tag';
import { projects, projectTypes } from '@/content/projects';
import { getService } from '@/content/services';
import { cn } from '@/lib/cn';
import { formatMillions } from '@/lib/format';
import { contractsForProject, relatedProjects } from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: `${project.title}. ${project.address}. ${project.works
      .slice(0, 2)
      .join('. ')}.`,
    path: `/projects/${project.slug}/`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const contracts = contractsForProject(project);
  const related = relatedProjects(project, 3);
  const typeTitle = projectTypes.find((type) => type.id === project.type)?.title ?? '';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([
              { name: 'Объекты', path: '/projects/' },
              { name: project.title, path: `/projects/${project.slug}/` },
            ]),
          ),
        }}
      />

      <section data-page-hero className="bg-paper pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          {/* Крошки отдельной строкой — узел встаёт напротив метки блока */}
          <div
            data-bus-row
            data-live="true"
            data-static="true"
            className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]"
          >
            <div className="hidden lg:block" aria-hidden="true" />
            <nav aria-label="Хлебные крошки" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 t-label-sm text-steel">
                <li>
                  <Link href="/" className="transition-colors hover:text-teal">Главная</Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link href="/projects/" className="transition-colors hover:text-teal">
                    Объекты
                  </Link>
                </li>
                <li className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span className="max-w-[46ch] truncate text-ink">{project.title}</span>
                </li>
              </ol>
            </nav>

            <div className="relative hidden lg:block" aria-hidden="true">
              <BusNode first />
            </div>

            <div>
              <BusLabel className="mb-6">
                {typeTitle}
                {project.years !== '—' && ` · ${project.years}`}
              </BusLabel>

              <h1 className="t-h1">
                {project.title}
              </h1>
              <p className="t-lead mt-8 text-steel">{project.address}</p>

              <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
                <div className="self-start overflow-hidden rounded-[2px] border border-line">
                  <Picture
                    base={`/images/projects/${project.slug}`}
                    alt={`${project.title}. ${project.address}`}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    priority
                  />
                </div>

                <dl className="divide-y divide-line self-start border-y border-line">
                  {project.client && (
                    <div className="py-4">
                      <dt className="t-label text-steel">Заказчик</dt>
                      <dd className="mt-2 font-medium">{project.client}</dd>
                    </div>
                  )}
                  {project.facts.map((fact) => (
                    <div key={fact.label} className="py-4">
                      <dt className="t-label text-steel">{fact.label}</dt>
                      <dd className="mt-2 font-mono text-lg tnum">{fact.value}</dd>
                    </div>
                  ))}
                  <div className="py-4">
                    <dt className="t-label text-steel">Направления</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {project.services.map((serviceSlug) => {
                        const service = getService(serviceSlug);
                        return (
                          <Tag key={serviceSlug} href={`/services/${service.slug}/`}>
                            {service.title}
                          </Tag>
                        );
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="panel" label="Состав" title="Что делали">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          {project.works.map((work, index) => (
            <li
              key={work}
              className={cn(
                'flex gap-4 bg-panel p-6',
                // нечётный список не должен оставлять пустую ячейку
                index === project.works.length - 1 &&
                  project.works.length % 2 === 1 &&
                  'md:col-span-2',
              )}
            >
              <span className="mt-2.5 block size-[7px] shrink-0 bg-teal" aria-hidden="true" />
              <span>{work}</span>
            </li>
          ))}
        </ul>
      </Section>

      {project.story && (
        <Section label="Разбор" title="Задача и решение">
          <div className="measure space-y-6 leading-relaxed">
            {project.story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Section>
      )}

      {contracts.length > 0 && (
        <Section
          tone="panel"
          label="Реестр"
          title={contracts.length === 1 ? 'Договор по объекту' : 'Договоры по объекту'}
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
                <span className="font-medium md:w-56">{contract.client}</span>
                <span className="flex-1 font-mono t-micro text-steel">
                  {contract.signed} — {contract.finished}
                </span>
                <span className="font-mono tnum whitespace-nowrap md:text-right">
                  {formatMillions(contract.amount)} млн ₽
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {related.length > 0 && (
        <Section
          label="Ещё"
          title="Похожие объекты"
          headerAside={
            <Button href="/projects/" variant="secondary">
              Все объекты
            </Button>
          }
        >
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 60} className="h-full">
                <ProjectCard project={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CtaBlock
        label="Заявка"
        title="Похожая задача?"
        lead="Расскажите об объекте — оценим состав работ и сроки."
      />
    </>
  );
}

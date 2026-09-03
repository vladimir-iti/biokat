import type { Metadata } from 'next';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ProjectsFilter } from '@/components/project/ProjectsFilter';
import { Container } from '@/components/ui/Container';
import { projectTypes } from '@/content/projects';
import { services } from '@/content/services';
import { plural } from '@/lib/format';
import { projects, regions } from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Объекты',
  description:
    'Выполненные объекты ГК «Биокат»: насосные станции олимпийского Сочи, подстанция 500 кВ, магазины INDITEX, жилые комплексы, промышленные и социальные объекты.',
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'Объекты', path: '/projects/' }]),
          ),
        }}
      />

      <PageHero
        label={`${projects.length} ${plural(projects.length, ['объект', 'объекта', 'объектов'])}`}
        title="Объекты"
        lead="Насосные станции олимпийского Сочи, подстанция 500 кВ, магазины INDITEX, жилые комплексы и промышленные площадки. По большинству объектов указан договор из реестра."
        crumbs={[{ title: 'Объекты' }]}
      />

      <section className="pb-24 md:pb-32 lg:pb-40">
        <Container>
          <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
            <div className="relative hidden lg:block" aria-hidden="true">
            </div>
            <ProjectsFilter
              types={projectTypes.map((type) => ({ id: type.id, title: type.short }))}
              services={services.map((service) => ({
                id: service.slug,
                title: service.title,
              }))}
              regions={regions}
            >
              {projects.map((project, index) => (
                <div
                  key={project.slug}
                  data-type={project.type}
                  data-region={project.region}
                  data-services={project.services.join(' ')}
                >
                  <ProjectCard project={project} priority={index < 3} />
                </div>
              ))}
            </ProjectsFilter>
          </div>
        </Container>
      </section>

      <CtaBlock
        label="Заявка"
        title="Похожая задача?"
        lead="Расскажите об объекте — оценим состав работ и сроки."
      />
    </>
  );
}

import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { featuredProjects, projects } from '@/lib/queries';
import { plural } from '@/lib/format';

export function ProjectsPreview() {
  const list = featuredProjects(3);

  return (
    <Section
      label="Объекты"
      title="Что уже сделано"
      lead="От насосных станций олимпийского Сочи до подстанции 500 кВ. За каждым объектом — договор, сроки и подписанные акты."
      headerAside={
        <Button href="/projects/" variant="secondary">
          Все объекты · {projects.length}
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((project, index) => (
          <Reveal key={project.slug} delay={index * 60} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
      <p className="t-small mt-8 text-steel">
        Всего в портфеле {projects.length}{' '}
        {plural(projects.length, ['объект', 'объекта', 'объектов'])} в{' '}
        {new Set(projects.map((p) => p.region)).size} регионах.
      </p>
    </Section>
  );
}

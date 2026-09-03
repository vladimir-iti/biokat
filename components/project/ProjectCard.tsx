import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Picture } from '@/components/ui/Picture';
import { projectTypes } from '@/content/projects';
import type { Project } from '@/lib/types';

function typeTitle(type: Project['type']) {
  return projectTypes.find((t) => t.id === type)?.short ?? '';
}

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const amount = project.facts.find(
    (f) => f.label === 'Договор' || f.label === 'Сумма договоров',
  );

  return (
    <Card href={`/projects/${project.slug}/`} className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-16/10 overflow-hidden border-b border-line">
        <Picture
          base={`/images/projects/${project.slug}`}
          alt={`${project.title}. ${project.address}`}
          priority={priority}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Label className="mb-3">
          {typeTitle(project.type)}
          {project.years !== '—' && ` · ${project.years}`}
        </Label>
        <h3 className="t-h4 mb-2 min-h-12 transition-colors duration-150 group-hover:text-teal">
          {project.title}
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-4 pt-3">
          <p className="t-small text-steel">{project.address}</p>
          {/* Сумма договора раскрыта не по каждому объекту — поэтому она стоит
              в строке-подвале, где её отсутствие не оставляет пустого места. */}
          {amount && (
            <span className="t-micro shrink-0 font-mono whitespace-nowrap text-teal">
              {amount.value}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

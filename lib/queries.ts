import { contracts } from '@/content/contracts';
import { projects, projectBySlug } from '@/content/projects';
import { services } from '@/content/services';
import { yearOf } from '@/lib/format';
import type { Contract, Project, ServiceSlug } from '@/lib/types';

/** Все производные значения считаются здесь — на сборке, а не в браузере. */

export const totalContracts = contracts.length;

/** Сумма всех договоров в тысячах рублей */
export const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

export const activeContracts = contracts.filter((c) => c.status === 'active');

export const doneContracts = contracts.filter((c) => c.status === 'done');

/**
 * Годы, которые покрывает реестр. Считаются из самих договоров, иначе
 * «с 2016 по 2025 год» в текстах пришлось бы править руками каждый январь.
 */
const registryYearValues = contracts.flatMap((c) =>
  [yearOf(c.signed), yearOf(c.finished)].filter((y): y is number => y !== null),
);
export const registryFrom = Math.min(...registryYearValues);
export const registryTo = Math.max(...registryYearValues);
/** «2016–2025» — для меток и заголовков */
export const registrySpan = `${registryFrom}–${registryTo}`;
/** «с 2016 по 2025 год» — для текста в предложении */
export const registryPeriod = `с ${registryFrom} по ${registryTo} год`;

export const contractsByDate = [...contracts].sort((a, b) => b.id - a.id);

export function contractsForService(slug: ServiceSlug): Contract[] {
  return contracts.filter((c) => c.services.includes(slug));
}

export function contractsForProject(project: Project): Contract[] {
  if (!project.contracts?.length) return [];
  const ids = new Set(project.contracts);
  return contracts.filter((c) => ids.has(c.id));
}

export function projectsForService(slug: ServiceSlug): Project[] {
  return projects.filter((p) => p.services.includes(slug));
}

export function featuredProjects(limit = 4): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

/** Похожие объекты: сначала тот же тип, затем пересечение по направлениям. */
export function relatedProjects(project: Project, limit = 3): Project[] {
  const others = projects.filter((p) => p.slug !== project.slug);
  const scored = others.map((p) => {
    const sameType = p.type === project.type ? 10 : 0;
    const shared = p.services.filter((s) => project.services.includes(s)).length;
    return { project: p, score: sameType + shared };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.project);
}

export function projectsByType() {
  const map = new Map<string, number>();
  for (const project of projects) {
    map.set(project.type, (map.get(project.type) ?? 0) + 1);
  }
  return map;
}

export const residentialProjects = projects.filter((p) => p.type === 'residential');

/** Сумма договоров по жилым комплексам — для блока «Работаем с застройщиками» */
export const residentialAmount = contracts
  .filter((c) => {
    const project = c.project ? projectBySlug.get(c.project) : undefined;
    return project?.type === 'residential';
  })
  .reduce((sum, c) => sum + c.amount, 0);

export const regions = Array.from(new Set(projects.map((p) => p.region))).sort(
  (a, b) => a.localeCompare(b, 'ru'),
);

export function getProject(slug: string): Project {
  const project = projectBySlug.get(slug);
  if (!project) throw new Error(`Неизвестный объект: ${slug}`);
  return project;
}

export { projects, services, contracts };

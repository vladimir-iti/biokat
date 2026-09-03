import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { formatMillions } from '@/lib/format';
import { residentialAmount, residentialProjects } from '@/lib/queries';

export function DevelopersBand() {
  return (
    <Section
      tone="panel"
      label="Застройщикам"
      title="Жилые комплексы — половина портфеля"
      lead="Апрелевка, Балашиха, Ногинск, Старая Купавна, Щёлково, Москва. Работаем сериями: щиты, силовые сети, освещение и слаботочка идут синхронно с графиком монтажа."
      headerAside={<Button href="/projects/?type=residential">Жилые объекты</Button>}
    >
      <Reveal>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-panel p-6">
            <p className="t-data text-teal">{formatMillions(residentialAmount)}</p>
            <p className="t-small mt-3 text-steel">
              млн ₽ по договорам на жилых объектах
            </p>
          </div>
          <div className="bg-panel p-6">
            <p className="t-data">{residentialProjects.length}</p>
            <p className="t-small mt-3 text-steel">жилых комплексов и домов</p>
          </div>
          <div className="bg-panel p-6">
            <p className="t-data">300 597</p>
            <p className="t-small mt-3 text-steel">метров кабеля на ЖК «Купавино»</p>
          </div>
        </div>
      </Reveal>

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 t-small text-steel">
        {residentialProjects.slice(0, 8).map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}/`}
              className="link-draw transition-colors hover:text-teal"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

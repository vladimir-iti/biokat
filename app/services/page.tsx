import type { Metadata } from 'next';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { ServicesGrid } from '@/components/blocks/ServicesGrid';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Услуги',
  description:
    'Семь направлений: электроснабжение, освещение, пожарная безопасность, слаботочные системы, автоматизация, производство НКУ и высоковольтные работы.',
  path: '/services/',
});

const stages = [
  { code: 'Э1', title: 'Проект', text: 'Однолинейные схемы, планы сетей, спецификации. Членство в СРО на проектирование.' },
  { code: 'Э2', title: 'Производство', text: 'Щитовое оборудование собираем на своей площадке — по спецификации проекта.' },
  { code: 'Э3', title: 'Монтаж', text: 'Бригадный подряд под задачу: от одной бригады до 85 человек в смену.' },
  { code: 'Э4', title: 'Пусконаладка', text: 'Настройка, испытания, замеры. Объект включается под нагрузкой при нас.' },
  { code: 'Э5', title: 'Сдача', text: 'Исполнительная документация, протоколы, акты. Гарантия до 5 лет на оборудование.' },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'Услуги', path: '/services/' }]),
          ),
        }}
      />
      <PageHero
        label="Направления"
        title="Закрываем инженерную часть объекта"
        lead="Не распыляемся на смежные работы. Семь направлений, в каждом из которых ведём объект от проекта до подписанных актов."
        crumbs={[{ title: 'Услуги' }]}
      />

      <Section>
        <ServicesGrid />
      </Section>

      <Section
        tone="panel"
        label="Порядок работы"
        title="Полный цикл — без стыков между подрядчиками"
        lead="Каждый этап ведём сами. Это снимает главную проблему инженерных подрядов: спор о том, чей участок ответственности."
      >
        <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage, index) => (
            <li
              key={stage.code}
              className={cn(
                'bg-panel p-6',
                // пять этапов в двух колонках оставляли пустую ячейку
                index === stages.length - 1 && 'sm:col-span-2 lg:col-span-1',
              )}
            >
              <span className="font-mono t-micro font-medium tracking-[0.1em] text-teal">
                {stage.code}
              </span>
              <p className="t-h4 mt-4">{stage.title}</p>
              <p className="t-small mt-3 text-steel">{stage.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBlock />
    </>
  );
}

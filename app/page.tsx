import type { Metadata } from 'next';
import { ContractsPreview } from '@/components/blocks/ContractsPreview';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { DevelopersBand } from '@/components/blocks/DevelopersBand';
import { DocumentsPreview } from '@/components/blocks/DocumentsPreview';
import { Hero } from '@/components/blocks/Hero';
import { ProjectsPreview } from '@/components/blocks/ProjectsPreview';
import { ServicesGrid } from '@/components/blocks/ServicesGrid';
import { StatsBar } from '@/components/blocks/StatsBar';
import { SwitchboardsBlock } from '@/components/blocks/SwitchboardsBlock';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ГК «Биокат» — электромонтаж, пожарная безопасность, производство НКУ',
  description:
    'Инженерные системы объектов под ключ: электроснабжение, освещение, пожарная безопасность, слаботочка, автоматика, производство низковольтных шкафов. 26 договоров на 668 млн ₽, лицензия МЧС бессрочно.',
  path: '/',
  bare: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />

      <Section
        label="Направления"
        title="Семь направлений, которые закрываем сами"
        lead="Не берём смежные работы, в которых не разбираемся. Всё, что перечислено, ведём от проекта до сдачи."
      >
        <ServicesGrid />
      </Section>

      <SwitchboardsBlock />
      <ProjectsPreview />
      <DevelopersBand />
      <ContractsPreview />
      <DocumentsPreview />
      <CtaBlock />
    </>
  );
}

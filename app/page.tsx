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
import { buildMetadata, websiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ГК «Биокат» — электромонтаж, пожарная безопасность, производство НКУ',
  // Около 160 символов — столько поисковики показывают в сниппете;
  // название компании и все семь направлений — в начале
  description:
    'ГК «Биокат»: электроснабжение, освещение, пожарная безопасность, слаботочные системы, автоматика, производство НКУ и высоковольтные работы под ключ.',
  path: '/',
  bare: true,
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
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

import type { Metadata } from 'next';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { Label } from '@/components/ui/Label';
import { Lightbox } from '@/components/ui/Lightbox';
import { Section } from '@/components/ui/Section';
import { documents, downloads } from '@/content/documents';
import { asset } from '@/lib/asset';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Документы и допуски',
  description:
    'Бессрочная лицензия МЧС № 77-Б/05039, выписки из реестров СРО на проектирование и на строительство, сертификаты и образцы документации на щитовое оборудование.',
  path: '/certificates/',
});

const kindTitles: Record<string, string> = {
  license: 'Лицензия',
  sro: 'СРО',
  certificate: 'Сертификат',
  sample: 'Документация',
};

export default function CertificatesPage() {
  const withPreview = documents.filter((item) => item.preview);
  const rest = documents.filter((item) => !item.preview);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'Документы', path: '/certificates/' }]),
          ),
        }}
      />

      <PageHero
        label="Допуски"
        title="Работаем по документам"
        lead="Лицензия МЧС выдана бессрочно и покрывает одиннадцать видов работ по пожарной безопасности. Оба СРО — на проектирование и на строительство — действующие. Всё можно открыть и проверить."
        crumbs={[{ title: 'Документы' }]}
      />

      <Section label="Основные" title="Действующие допуски">
        <div className="grid gap-8 md:grid-cols-3">
          {withPreview.map((document, index) => (
            <Reveal key={document.id} delay={index * 60} className="h-full">
              <article className="flex h-full flex-col rounded-[2px] border border-line bg-panel">
                <div className="border-b border-line bg-paper p-6">
                  <Lightbox
                    src={asset(`${document.preview}.png`)}
                    alt={document.title}
                    file={document.file && asset(document.file)}
                  >
                    <picture className="block overflow-hidden rounded-[2px] border border-line bg-white shadow-[0_2px_10px_rgba(14,26,31,0.06)]">
                      <source type="image/avif" srcSet={asset(`${document.preview}.avif`)} />
                      <source type="image/webp" srcSet={asset(`${document.preview}.webp`)} />
                      <img
                        src={asset(`${document.preview}.png`)}
                        alt={document.title}
                        loading="lazy"
                        decoding="async"
                        className="h-[320px] w-full object-cover object-top transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-[1.01]"
                      />
                    </picture>
                  </Lightbox>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <Label className="mb-4 block text-teal">
                    {kindTitles[document.kind]}
                  </Label>
                  <h2 className="t-h3">{document.title}</h2>
                  <p className="t-small mt-3 text-steel">{document.summary}</p>

                  <dl className="mt-6 space-y-3 font-mono t-micro">
                    {/* Карточки узкие — подпись стоит над значением */}
                    {document.meta.map((item) => (
                      <div key={item.label}>
                        <dt className="t-label-sm text-steel">{item.label}</dt>
                        <dd className="mt-1 break-words">{item.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {document.file && (
                    <a
                      href={asset(document.file)}
                      className="link-draw mt-auto inline-flex items-center gap-2 pt-7 font-medium text-teal"
                    >
                      Открыть PDF
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        tone="panel"
        label="Прочее"
        title="Сертификаты и документация"
        lead="Сертификаты оформлены на предыдущее юридическое лицо команды и заменяются действующими. Актуальные копии и образцы документации высылаем по запросу."
      >
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {rest.map((document) => (
            <article key={document.id} className="bg-panel p-6">
              <Label className="mb-4 block">{kindTitles[document.kind]}</Label>
              <h3 className="t-h4">{document.title}</h3>
              <p className="t-small mt-3 text-steel">{document.summary}</p>
              <dl className="mt-6 space-y-3 font-mono t-micro">
                {document.meta.map((item) => (
                  <div key={item.label}>
                    <dt className="t-label-sm text-steel">{item.label}</dt>
                    <dd className="mt-1 break-words">{item.value}</dd>
                  </div>
                ))}
              </dl>
              {document.note && (
                <p className="mt-6 border-l-2 border-teal pl-4 t-micro leading-relaxed text-steel">
                  {document.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      <Section label="Скачать" title="Документы для проверки контрагента">
        <ul className="divide-y divide-line border-y border-line">
          {downloads.map((item) => (
            <li key={item.id}>
              <a
                href={asset(item.file)}
                className="group flex flex-wrap items-center justify-between gap-4 py-6 transition-colors duration-150"
              >
                <span>
                  <span className="t-h4 transition-colors group-hover:text-teal">
                    {item.title}
                  </span>
                  <span className="t-small mt-1 block text-steel">{item.description}</span>
                </span>
                <span className="font-mono t-micro uppercase tracking-[0.1em] text-teal">
                  {item.format} ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBlock
        label="Заявка"
        title="Нужны документы на конкретный объект?"
        lead="Пришлём заверенные копии и карточку контрагента — обычно в тот же день."
      />
    </>
  );
}

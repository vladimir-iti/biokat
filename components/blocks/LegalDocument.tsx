import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/ui/Container';
import type { LegalBlock, LegalDocumentData } from '@/content/legal';

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <p>{block}</p>;

  if ('list' in block) {
    return (
      <ul className="space-y-2">
        {block.list.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.7em] block size-[5px] shrink-0 bg-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Таблица целей: на узких экранах строки разворачиваются в карточки
  // (та же схема table-cards, что у реестра договоров)
  return (
    <div className="border-y border-line">
      <table className="table-cards w-full t-small">
        <thead>
          <tr className="border-b border-line text-left">
            {block.table.head.map((cell) => (
              <th key={cell} className="py-3 pr-6 align-bottom t-label-sm font-medium text-steel">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {block.table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  key={index}
                  data-label={block.table.head[index]}
                  className="py-4 pr-6 align-top text-ink first:font-medium md:first:w-[34%]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Страница правового документа: политика, согласие. Текст — в content/legal.ts */
export function LegalDocument({
  document,
  label,
  lead,
  crumb,
  aside,
}: {
  document: LegalDocumentData;
  label: string;
  lead: string;
  crumb: string;
  aside?: React.ReactNode;
}) {
  return (
    <>
      <PageHero label={label} title={document.title} lead={lead} crumbs={[{ title: crumb }]} />

      <section className="pb-24 md:pb-32 lg:pb-40">
        <Container>
          <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
            <div className="relative hidden lg:block" aria-hidden="true" />

            <article className="max-w-[72ch]">
              <p className="t-label text-steel">Редакция от {document.edition}</p>
              {document.intro && (
                <p className="t-lead mt-6 text-ink">{document.intro}</p>
              )}
              {aside}

              <div className="mt-12 space-y-12">
                {document.sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="t-h4">{section.title}</h2>
                    <div className="mt-4 space-y-4 leading-relaxed text-steel">
                      {section.blocks.map((block, index) => (
                        <Block key={index} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}

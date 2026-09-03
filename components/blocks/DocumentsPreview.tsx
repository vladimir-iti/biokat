import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { documents } from '@/content/documents';

export function DocumentsPreview() {
  const main = documents.filter((d) => d.id === 'license-mchs' || d.id === 'sro-design');
  const rest = documents.filter((d) => !main.includes(d));

  return (
    <Section
      label="Документы"
      title="Работаем по допускам"
      lead="Лицензия МЧС без срока действия и действующее членство в СРО на проектирование. Все документы открыты для просмотра."
      headerAside={
        <Button href="/certificates/" variant="secondary">
          Все документы
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {main.map((document, index) => (
          <Reveal key={document.id} delay={index * 60} className="h-full">
            <article className="h-full rounded-[2px] border border-line bg-panel p-6">
              <Label className="mb-4 block text-teal">
                {document.kind === 'license' ? 'Лицензия' : 'СРО'}
              </Label>
              <h3 className="t-h3">{document.title}</h3>
              <p className="t-small mt-3 text-steel">{document.summary}</p>
              <dl className="mt-6 space-y-2 font-mono t-micro">
                {document.meta.slice(0, 3).map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-x-3 sm:grid-cols-[9rem_minmax(0,1fr)]"
                  >
                    <dt className="text-steel">{item.label}</dt>
                    <dd className="break-words">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>

      <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((document) => (
          <li key={document.id} className="bg-panel p-6">
            <p className="t-small font-medium">{document.title}</p>
            {document.note && (
              <p className="mt-2 t-micro leading-snug text-steel">{document.note}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

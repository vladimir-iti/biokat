import { ContactForm } from '@/components/blocks/ContactForm';
import { AddressLink } from '@/components/ui/AddressLink';
import { Section } from '@/components/ui/Section';
import { company } from '@/content/company';

export function CtaBlock({
  variant = 'default',
  label = 'Заявка',
  title = 'Расскажите о задаче',
  lead = 'Ответим в рабочее время. Для срочных вопросов — телефон: быстрее, чем форма.',
}: {
  variant?: 'default' | 'spec';
  label?: string;
  title?: string;
  lead?: string;
}) {
  return (
    <Section tone="ink" label={label} title={title} lead={lead}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <a
            href={`tel:${company.phoneHref}`}
            className="block font-mono text-2xl tracking-tight text-teal transition-opacity hover:opacity-80 md:text-3xl"
          >
            {company.phone}
          </a>
          <a
            href={`mailto:${company.emailHref}`}
            className="mt-3 block text-paper/70 transition-colors hover:text-paper"
          >
            {company.email}
          </a>
          <dl className="mt-10 space-y-6 t-small">
            <div>
              <dt className="t-label text-paper/40">Часы работы</dt>
              <dd className="mt-2 text-paper/80">{company.hours}</dd>
            </div>
            <div>
              <dt className="t-label text-paper/40">Офис</dt>
              <dd className="mt-2 text-paper/80">
                <AddressLink
                  address={company.addressLegal}
                  street={company.addressLegalStreet}
                  map={company.addressLegalMap}
                />
              </dd>
            </div>
            <div>
              <dt className="t-label text-paper/40">Производство</dt>
              <dd className="mt-2 text-paper/80">
                <AddressLink
                  address={company.addressProduction}
                  street={company.addressProductionStreet}
                  map={company.addressProductionMap}
                />
              </dd>
            </div>
          </dl>
        </div>

        <ContactForm
          variant={variant}
          tone="dark"
          phone={company.phone}
          phoneHref={company.phoneHref}
        />
      </div>
    </Section>
  );
}

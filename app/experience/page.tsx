import type { Metadata } from 'next';
import { ContractsTable } from '@/components/blocks/ContractsTable';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { downloads } from '@/content/documents';
import { formatMillions, plural } from '@/lib/format';
import {
  activeContracts,
  contractsByDate,
  totalAmount,
  totalContracts,
} from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Реестр исполненных договоров',
  description:
    'Полный реестр договоров ООО «ГК «Биокат» с 2016 по 2025 год: заказчики, сроки, суммы. 26 договоров на 668,1 млн ₽.',
  path: '/experience/',
});

export default function ExperiencePage() {
  const registry = downloads.find((item) => item.id === 'contracts-registry');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'Опыт', path: '/experience/' }]),
          ),
        }}
      />

      <PageHero
        label="Договоры 2016–2025"
        title="Реестр исполненных договоров"
        lead="Данные из справки о компании, подписанной генеральным директором. Заказчики, сроки и суммы — как есть. Реестр открыт, потому что каждая строка проверяется."
        crumbs={[{ title: 'Опыт' }]}
        aside={
          registry && (
            <Button href={registry.file} variant="secondary">
              Скачать PDF
            </Button>
          )
        }
      />

      <section className="pb-16">
        <Container>
          <div className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
            <div className="relative hidden lg:block" aria-hidden="true">
            </div>
            <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
              <div className="bg-panel p-6">
                <dd className="t-data">{totalContracts}</dd>
                <dt className="t-small mt-3 text-steel">
                  {plural(totalContracts, ['договор', 'договора', 'договоров'])} с 2016
                  по 2025 год
                </dt>
              </div>
              <div className="bg-panel p-6">
                <dd className="t-data text-teal">{formatMillions(totalAmount)}</dd>
                <dt className="t-small mt-3 text-steel">млн ₽ общая сумма</dt>
              </div>
              <div className="bg-panel p-6">
                <dd className="t-data text-signal">{activeContracts.length}</dd>
                <dt className="t-small mt-3 text-steel">
                  {plural(activeContracts.length, ['договор', 'договора', 'договоров'])} в
                  работе прямо сейчас
                </dt>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <Section
        label="Таблица"
        title="Все договоры"
        lead={
          <>
            Во всех договорах состав работ один: электромонтажные и слаботочные работы
            плюс изготовление НКУ — в таблице показан объект.{' '}
            {/* на узких экранах таблица разворачивается в карточки, заголовков столбцов нет */}
            <span className="hidden md:inline">
              Сортировка по клику на заголовок столбца.
            </span>
          </>
        }
      >
        <ContractsTable contracts={contractsByDate} />

        <p className="t-small mt-8 text-steel">
          Суммы приведены в миллионах рублей и соответствуют справке о компании. Часть
          объектов выполнена до создания текущего юридического лица — они показаны в
          разделе «Объекты» без указания сумм.
        </p>
      </Section>

      <CtaBlock
        label="Заявка"
        title="Нужен подрядчик на объект?"
        lead="Расскажите о задаче — оценим состав работ, сроки и стоимость."
      />
    </>
  );
}

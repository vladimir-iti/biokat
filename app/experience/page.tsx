import type { Metadata } from 'next';
import { ContractsTable } from '@/components/blocks/ContractsTable';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { downloads } from '@/content/documents';
import { asset } from '@/lib/asset';
import { formatMillions, plural } from '@/lib/format';
import {
  activeContracts,
  contractsByDate,
  doneContracts,
  registryPeriod,
  registrySpan,
  totalAmount,
  totalContracts,
} from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Реестр исполненных договоров',
  description: `Полный реестр договоров ООО «ГК «Биокат» ${registryPeriod}: заказчики, сроки, суммы. ${totalContracts} ${plural(totalContracts, ['договор', 'договора', 'договоров'])} на ${formatMillions(totalAmount)} млн ₽.`,
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
        label={`Договоры ${registrySpan}`}
        title="Реестр исполненных договоров"
        lead="Данные из справки о компании, подписанной генеральным директором. Заказчики, сроки и суммы — как есть. Реестр открыт, потому что каждая строка проверяется."
        crumbs={[{ title: 'Опыт' }]}
        aside={
          registry && (
            // Обычная ссылка, не next/link: это файл, а не маршрут
            <a
              href={asset(registry.file)}
              className="group inline-flex h-13 items-center justify-center gap-3 rounded-[2px] border border-line px-8 font-semibold transition-colors duration-150 hover:border-teal hover:text-teal"
            >
              Скачать PDF
            </a>
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
                  {plural(totalContracts, ['договор', 'договора', 'договоров'])}{' '}
                  {registryPeriod}, из них {doneContracts.length} завершено
                </dt>
              </div>
              <div className="bg-panel p-6">
                <dd className="t-data text-teal">{formatMillions(totalAmount)}</dd>
                <dt className="t-small mt-3 text-steel">млн ₽ общая сумма</dt>
              </div>
              <div className="bg-panel p-6">
                <dd className="t-data text-teal">{activeContracts.length}</dd>
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

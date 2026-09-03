import type { Metadata } from 'next';
import { CtaBlock } from '@/components/blocks/CtaBlock';
import { PageHero } from '@/components/blocks/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { brands, company } from '@/content/company';
import { formatMillions, plural } from '@/lib/format';
import { projects, regions, totalAmount, totalContracts } from '@/lib/queries';
import { breadcrumbsJsonLd, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'О компании',
  description:
    'ГК «Биокат»: инженерный костяк в штате, бригадный подряд под задачу, собственное производство щитового оборудования в Мытищинском районе. Работаем с 2010 года.',
  path: '/about/',
});

const team = [
  { role: 'Генеральный директор', text: 'Договоры, обязательства, отношения с заказчиком.' },
  { role: 'Главный энергетик', text: 'Схемные решения, нагрузки, согласования с сетевыми организациями.' },
  { role: 'Главный инженер', text: 'Технические решения на объекте, надзор за качеством монтажа.' },
  { role: 'Начальник участка', text: 'График, бригады, снабжение, ежедневное ведение работ.' },
  { role: 'Юрист', text: 'Договорная работа, претензионная защита, документы для тендеров.' },
];

const principles = [
  'Не обещаем сроков, которые не выдержим.',
  'Не ставим оборудование, в котором не уверены.',
  'Если проект не подходит объекту — говорим об этом до монтажа, а не после.',
  'Документы готовим параллельно работам, а не в последнюю неделю перед сдачей.',
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbsJsonLd([{ name: 'О компании', path: '/about/' }]),
          ),
        }}
      />

      <PageHero
        label="Команда с 2010 года"
        title="Инженеры, а не посредники"
        lead={`Команда работает на инженерных системах с ${company.since} года. ООО «ГК «Биокат» создано в ${company.companySince} году и с тех пор исполнило ${totalContracts} ${plural(totalContracts, ['договор', 'договора', 'договоров'])} на ${formatMillions(totalAmount)} млн ₽.`}
        crumbs={[{ title: 'О компании' }]}
        aside={<Button href="/experience/">Реестр договоров</Button>}
      />

      <Section
        tone="panel"
        label="Модель"
        title="Инженерный костяк в штате, руки — под задачу"
        lead="Специалисты верхнего уровня закрывают всю ответственность за объект. Монтаж ведут проверенные бригады по подряду: от одной бригады до 85 человек в смену, в зависимости от графика."
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <Reveal key={member.role} delay={index * 50} className="h-full">
              <article className="h-full bg-panel p-6">
                <h3 className="t-h4 text-teal">{member.role}</h3>
                <p className="t-small mt-3 text-steel">{member.text}</p>
              </article>
            </Reveal>
          ))}
          <Reveal delay={team.length * 50} className="h-full">
            <article className="h-full bg-panel p-6">
              <h3 className="t-h4 text-teal">Бригадный подряд</h3>
              <p className="t-small mt-3 text-steel">
                База прорабов наработана за годы. Людей не учим на объекте.
              </p>
            </article>
          </Reveal>
        </div>
      </Section>

      <Section
        label="Производство"
        title="Щитовое оборудование собираем сами"
        lead="Производственная площадка находится по адресу, указанному в лицензии МЧС: Московская область, Мытищинский район, деревня Капустино, Дмитровское шоссе, 36."
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 leading-relaxed">
            <p>
              Собственное производство решает главную проблему подряда — сроки поставки
              щитов. Комплектацию подбираем по спецификации проекта, а не по складским
              остаткам, и сами отвечаем за то, что внутри шкафа.
            </p>
            <p>
              Каждое изделие уходит с паспортом и инструкцией по эксплуатации. Гарантия
              по умолчанию — 12 месяцев, по отдельным контрактам продлевается до пяти лет.
            </p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            <div className="py-4 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
              <dt className="text-steel">Комплектующие</dt>
              <dd className="mt-1 font-medium sm:mt-0 sm:text-right">{brands.join(' · ')}</dd>
            </div>
            <div className="py-4 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
              <dt className="text-steel">Гарантия</dt>
              <dd className="mt-1 font-medium sm:mt-0 sm:text-right">12 месяцев, до 5 лет</dd>
            </div>
            <div className="py-4 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
              <dt className="text-steel">Документация</dt>
              <dd className="mt-1 font-medium sm:mt-0 sm:text-right">Паспорт и инструкция на каждый шкаф</dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section
        tone="panel"
        label="География"
        title="Где работали"
        lead="От Санкт-Петербурга и Петрозаводска до Иркутска и Сочи. Сетевым заказчикам закрываем площадки в разных регионах по единому стандарту."
      >
        <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-panel p-6">
            <p className="t-data">{projects.length}</p>
            <p className="t-small mt-3 text-steel">объектов в портфеле</p>
          </div>
          <div className="bg-panel p-6">
            <p className="t-data text-teal">{regions.length}</p>
            <p className="t-small mt-3 text-steel">регионов присутствия</p>
          </div>
          <div className="bg-panel p-6">
            <p className="t-data">10</p>
            <p className="t-small mt-3 text-steel">городов в контракте с INDITEX</p>
          </div>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-steel">
          {regions.map((region) => (
            <li key={region}>{region}</li>
          ))}
        </ul>
      </Section>

      <Section label="Принципы" title="Чего от нас можно ждать">
        <ul className="divide-y divide-line border-y border-line">
          {principles.map((principle) => (
            <li key={principle} className="flex items-baseline gap-6 py-6">
              <span
                className="block h-px w-8 shrink-0 translate-y-[-6px] bg-teal"
                aria-hidden="true"
              />
              <span className="t-h4 font-normal">{principle}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBlock />
    </>
  );
}

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { brands } from '@/content/company';

const kinds = [
  { code: 'ВРУ', title: 'Вводно-распределительные устройства' },
  { code: 'ГРЩ', title: 'Главные распределительные щиты' },
  { code: 'ЩО', title: 'Щиты освещения' },
  { code: 'ЩАВР', title: 'Автоматический ввод резерва' },
  { code: 'ЩУВ', title: 'Управление вентиляцией' },
  { code: 'ЩЭ', title: 'Этажные щиты' },
  { code: 'ЩС', title: 'Силовые и групповые щиты' },
  { code: 'ША', title: 'Шкафы автоматики' },
];

export function SwitchboardsBlock() {
  return (
    <Section
      tone="panel"
      label="НКУ · Собственное производство"
      title="Щиты собираем сами — по спецификации проекта"
      lead="Производственная площадка в Мытищинском районе. Комплектуем под задачу, маркируем, проверяем и выдаём с паспортом, инструкцией и гарантией до пяти лет."
      headerAside={
        <Button href="/services/switchboards/">Отправить спецификацию</Button>
      }
    >
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {kinds.map((kind) => (
          <div key={kind.code} className="bg-panel p-6">
            <span className="font-mono text-lg font-medium text-teal">{kind.code}</span>
            <p className="t-small mt-2 text-steel">{kind.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Label>Работаем на комплектующих</Label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {brands.map((brand) => (
            <span key={brand} className="font-medium">
              {brand}
            </span>
          ))}
        </div>
        <p className="t-small text-steel">
          Если в проекте другой бренд — поставим его.
        </p>
      </div>
    </Section>
  );
}

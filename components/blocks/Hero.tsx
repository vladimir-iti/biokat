import { BusLabel } from '@/components/motion/BusLabel';
import { BusNode } from '@/components/motion/BusNode';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { company } from '@/content/company';

export function Hero() {
  return (
    <section className="overflow-hidden bg-paper hero-pt pb-20 md:pb-28 lg:pb-36">
      <Container>
        <div
          data-bus-row
          data-live="true"
          data-static="true"
          className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]">
          <div className="relative hidden lg:block" aria-hidden="true">
            <BusNode first />
          </div>

          <div>
            <BusLabel className="rise">
              ГК «Биокат» · Москва · с {company.since} года
            </BusLabel>

            <h1 className="t-display mt-6 max-w-[16ch]">
              <span className="rise block" style={{ animationDelay: '80ms' }}>
                Инженерные
              </span>
              <span className="rise block" style={{ animationDelay: '160ms' }}>
                системы объекта
              </span>
              <span
                className="rise block text-teal"
                style={{ animationDelay: '240ms' }}
              >
                полностью
              </span>
            </h1>

            <p
              className="t-lead measure rise mt-8 text-steel"
              style={{ animationDelay: '360ms' }}
            >
              Проектируем, производим щитовое оборудование и монтируем: электроснабжение,
              пожарная безопасность, слаботочные системы и автоматика. От однолинейной
              схемы до подписанного акта — одним подрядчиком.
            </p>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: '480ms' }}
            >
              {/* На телефоне кнопки стоят столбиком — одной ширины, во всю строку */}
              <Button href="/contacts/" data-lead className="w-full sm:w-auto">
                Обсудить задачу
              </Button>
              <Button href="/projects/" variant="secondary" className="w-full sm:w-auto">
                Смотреть объекты
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

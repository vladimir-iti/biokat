import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { services } from '@/content/services';
import { cn } from '@/lib/cn';

/** Содержимое строки чуть подаётся вправо — его «толкает» загоревшаяся шина */
const shift =
  'relative transition-[transform,color] duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-2 group-focus-visible:translate-x-2';

/*
 * Направления — не сетка карточек, а ведомость отходящих линий, как на
 * однолинейной схеме: одна рамка, строки во всю ширину, у каждой маркировка
 * (W1, F1, НКУ…), название, короткое описание и стрелка. Все строки стоят
 * по одним вертикалям, поэтому блок читается как один прямоугольник при любом
 * числе направлений — неполных рядов не бывает.
 *
 * Колонка маркировки — 6.5rem: ровно под самую длинную подпись
 * («Высоковольтка», ~100px), чтобы название стояло вплотную к коду.
 *
 * Колонки строки:
 *   от 1280px — маркировка | название | описание | стрелка
 *   768–1279px — маркировка | название над описанием | стрелка
 *                (на 1024px колонка описания вышла бы в 4–5 строк)
 *   телефон  — маркировка сверху, под ней название со стрелкой и описание
 *
 * Наведение — «ток пошёл по линии»: слева прорастает шина, следом ток
 * пробегает по нижней кромке, узел у маркировки загорается и даёт вспышку,
 * строку заливает бирюзовым градиентом, содержимое подаётся вправо, стрелка
 * вытягивается. Только transform и opacity — без раскладки и перерисовки
 * на каждом кадре (см. README, «Производительность прокрутки»).
 */
export function ServicesGrid() {
  return (
    <ul className="divide-y divide-line rounded-[2px] border border-line bg-panel">
      {services.map((service, index) => {
        const [code, tag] = service.label.split(' · ');

        return (
          <li key={service.slug}>
            <Reveal delay={Math.min(index * 50, 300)}>
              <Link
                href={`/services/${service.slug}/`}
                className="group relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 overflow-hidden px-6 py-7 focus-visible:outline-offset-[-2px] md:grid-cols-[6.5rem_minmax(0,1fr)_auto] md:gap-x-6 md:px-8 xl:grid-cols-[6.5rem_minmax(0,1.5fr)_minmax(0,1fr)_2.5rem] xl:items-center xl:py-8"
              >
                {/* Подсветка: бирюзовый градиент наплывает слева */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-0 -translate-x-8 bg-linear-to-r from-teal/[0.07] via-teal/[0.02] to-transparent opacity-0',
                    'transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)]',
                    'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                  )}
                />

                {/* Шина: прорастает сверху вниз */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-teal transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />

                {/* Ток: следом за шиной пробегает по нижней кромке строки */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-teal transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100 group-hover:delay-150 group-focus-visible:scale-x-100 group-focus-visible:delay-150"
                />

                <span
                  className={cn(
                    shift,
                    'col-span-2 row-start-1 flex items-baseline gap-3 md:col-span-1 md:col-start-1 md:row-span-2 md:flex-col md:gap-1 xl:row-span-1',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {/* Узел: загорается и даёт короткую вспышку-кольцо */}
                    <span
                      aria-hidden="true"
                      className="relative block size-[9px] shrink-0 border border-steel/40 bg-panel transition-colors duration-200 group-hover:border-teal group-hover:bg-teal group-focus-visible:border-teal group-focus-visible:bg-teal"
                    >
                      <span className="absolute -inset-[5px] border border-teal opacity-0 group-hover:animate-[node-ping_700ms_var(--ease-out-soft)_120ms_both] group-focus-visible:animate-[node-ping_700ms_var(--ease-out-soft)_120ms_both]" />
                    </span>
                    <span className="font-mono text-xl font-medium tracking-tight text-teal">
                      {code}
                    </span>
                  </span>
                  <span className="t-label-sm whitespace-nowrap text-steel">{tag}</span>
                </span>

                <h3
                  className={cn(
                    shift,
                    't-h3 col-start-1 row-start-2 group-hover:text-teal group-focus-visible:text-teal md:col-start-2 md:row-start-1 xl:col-start-2',
                  )}
                >
                  {service.title}
                </h3>

                <p
                  className={cn(
                    shift,
                    't-small col-span-2 row-start-3 text-steel md:col-span-1 md:col-start-2 md:row-start-2 xl:col-start-3 xl:row-start-1',
                  )}
                >
                  {service.short}
                </p>

                <span
                  aria-hidden="true"
                  className="relative col-start-2 row-start-2 flex items-center justify-end self-center text-teal md:col-start-3 md:row-span-2 md:row-start-1 xl:col-start-4 xl:row-span-1"
                >
                  <span className="block h-px w-6 bg-teal transition-[width] duration-300 ease-[var(--ease-out-soft)] group-hover:w-10 group-focus-visible:w-10" />
                  {/* Линия и наконечник сомкнуты: при наведении линия растёт
                      и выталкивает наконечник вправо одной стрелкой */}
                  <svg width="14" height="9" viewBox="0 0 16 10" fill="none" className="-ml-px">
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

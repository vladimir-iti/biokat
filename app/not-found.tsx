import Link from 'next/link';
import { BusLabel } from '@/components/motion/BusLabel';
import { BusNode } from '@/components/motion/BusNode';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { services } from '@/content/services';

export default function NotFound() {
  return (
    <section className="py-28 md:py-40">
      <Container>
        <div
          data-bus-row
          data-live="true"
          data-static="true"
          className="lg:grid lg:grid-cols-[var(--bus-offset)_minmax(0,1fr)]"
        >
          <div className="relative hidden lg:block" aria-hidden="true">
            <BusNode first />
          </div>

          <div>
            <BusLabel className="rise mb-6">Ошибка 404</BusLabel>
            <h1
              className="t-display rise max-w-[14ch]"
              style={{ animationDelay: '80ms' }}
            >
              Страница не найдена
            </h1>
            <p
              className="t-lead measure rise mt-8 text-steel"
              style={{ animationDelay: '200ms' }}
            >
              Такого адреса на сайте нет. Возможно, страницу переименовали — начните
              с направлений или посмотрите объекты.
            </p>

            <div className="rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: '320ms' }}>
              <Button href="/">На главную</Button>
              <Button href="/projects/" variant="secondary">
                Объекты
              </Button>
            </div>

            <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-steel">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}/`}
                    className="link-draw transition-colors hover:text-teal"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

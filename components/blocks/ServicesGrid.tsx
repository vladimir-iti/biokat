import { Reveal } from '@/components/motion/Reveal';
import { Card } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { services } from '@/content/services';
import { cn } from '@/lib/cn';

export function ServicesGrid({ exclude }: { exclude?: string }) {
  const list = services.filter((service) => service.slug !== exclude);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map((service, index) => (
        <Reveal
          key={service.slug}
          delay={Math.min(index * 60, 300)}
          className={cn(
            'h-full',
            // последняя карточка занимает остаток ряда, чтобы сетка не рвалась
            index === list.length - 1 && list.length % 3 === 1 && 'lg:col-span-3',
            index === list.length - 1 && list.length % 2 === 1 && 'md:col-span-2 lg:col-span-1',
            index === list.length - 1 &&
              list.length % 3 === 1 &&
              list.length % 2 === 1 &&
              'md:col-span-2 lg:col-span-3',
          )}
        >
          <Card href={`/services/${service.slug}/`} className="h-full">
            <div className="flex h-full flex-col p-6">
              <Label className="mb-6">{service.label}</Label>
              <h3 className="t-h3 mb-3 transition-colors duration-150 group-hover:text-teal">
                {service.title}
              </h3>
              <p className="t-small text-steel">{service.short}</p>
              <span
                aria-hidden="true"
                className="mt-auto flex items-center gap-3 pt-8 text-teal"
              >
                <span className="block h-px w-8 bg-teal transition-[width] duration-200 ease-[var(--ease-out-soft)] group-hover:w-14" />
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

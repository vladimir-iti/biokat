'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import type { NavItem } from '@/content/nav';

export interface ServiceLink {
  slug: string;
  title: string;
  short: string;
}

export function Header({
  nav,
  serviceLinks,
  phone,
  phoneHref,
}: {
  nav: NavItem[];
  serviceLinks: ServiceLink[];
  phone: string;
  phoneHref: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      setServicesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openServices = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setServicesOpen(true), 120);
  };
  const closeServices = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setServicesOpen(false), 240);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <>
    <header className="sticky top-0 z-50 h-20 border-b border-line bg-paper/95">
      <Container className="relative flex h-full items-center justify-between gap-6">
        {/* Подвод шины к логотипу: растёт снизу вверх при первой прокрутке
            и замыкается на вертикали знака. Геометрию задаёт BusRail. */}
        <span
          aria-hidden="true"
          className="bus-connector pointer-events-none absolute hidden w-px origin-bottom bg-teal lg:left-16 lg:block"
        />
        {/* Знак сдвинут влево ровно на свой внутренний отступ — его вертикаль
            ложится на линию шины пиксель в пиксель */}
        <Link
          href="/"
          aria-label="Биокат — на главную"
          className="shrink-0 lg:ml-[calc(-1*var(--logo-line-inset))]"
        >
          <Logo />
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {nav.map((item) =>
            item.href === '/services/' ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <Link
                  href={item.href}
                  aria-expanded={servicesOpen}
                  onFocus={() => setServicesOpen(true)}
                  className={cn(
                    'flex items-center gap-2 py-2 t-small font-medium whitespace-nowrap transition-colors duration-150',
                    isActive(item.href) ? 'text-teal' : 'hover:text-teal',
                  )}
                >
                  {item.title}
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
                    <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </Link>

                <div
                  className={cn(
                    'absolute left-0 top-full w-[min(620px,calc(100vw-4rem))] pt-3 transition-[opacity,transform] duration-200 ease-[var(--ease-out-soft)]',
                    servicesOpen
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-1 opacity-0',
                  )}
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-[2px] border border-line bg-panel p-4 shadow-[0_16px_40px_rgba(14,26,31,0.1)]">
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}/`}
                        className={cn(
                          'group rounded-[2px] p-3 transition-colors duration-150 hover:bg-paper',
                          index === serviceLinks.length - 1 &&
                            serviceLinks.length % 2 === 1 &&
                            'col-span-2',
                        )}
                      >
                        <span className="block font-semibold transition-colors group-hover:text-teal">
                          {service.title}
                        </span>
                        <span className="mt-1 block t-micro leading-snug text-steel">
                          {service.short}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'py-2 t-small font-medium whitespace-nowrap transition-colors duration-150',
                  isActive(item.href) ? 'text-teal' : 'hover:text-teal',
                )}
              >
                {item.title}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${phoneHref}`}
            className="hidden shrink-0 font-mono t-small font-medium whitespace-nowrap tracking-tight transition-colors duration-150 hover:text-teal md:block"
          >
            {phone}
          </a>
          <Link
            href="/contacts/"
            className="hidden h-11 shrink-0 items-center rounded-[2px] bg-teal px-6 t-small font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-teal-deep xl:inline-flex"
          >
            Обсудить задачу
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="flex size-11 items-center justify-center lg:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={cn(
                  'absolute left-0 block h-0.5 w-full bg-current transition-all duration-200',
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1.5 block h-0.5 w-full bg-current transition-opacity duration-200',
                  menuOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block h-0.5 w-full bg-current transition-all duration-200',
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </Container>

    </header>
        {/* Мобильное меню */}
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-ink text-paper transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)] lg:hidden',
            menuOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          <Container className="py-10">
            <div className="grid grid-cols-[24px_1fr] gap-x-4">
              <div className="relative" aria-hidden="true">
                <span className="absolute inset-y-0 left-3 w-px bg-paper/20" />
              </div>
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-3 text-2xl font-semibold tracking-tight"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-paper/20 pt-8">
              <p className="t-label text-paper/50">
                Направления
              </p>
              <ul className="mt-4 space-y-2">
                {serviceLinks.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}/`}
                      className="block py-2 text-paper/80"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`tel:${phoneHref}`}
              className="mt-10 block font-mono text-lg tracking-tight text-teal"
            >
              {phone}
            </a>
          </Container>
        </div>
    </>
  );
}

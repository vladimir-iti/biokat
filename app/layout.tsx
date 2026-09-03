import type { Metadata, Viewport } from 'next';
import { Golos_Text, JetBrains_Mono, Unbounded } from 'next/font/google';
import { BusRail } from '@/components/motion/BusRail';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { company } from '@/content/company';
import { mainNav } from '@/content/nav';
import { services } from '@/content/services';
import { organizationJsonLd } from '@/lib/seo';
import './globals.css';

const golos = Golos_Text({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-golos',
  display: 'swap',
});

const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600'],
  variable: '--font-unbounded',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(company.origin),
  title: {
    default: 'ГК «Биокат» — инженерные системы объектов',
    template: '%s',
  },
  description:
    'Электроснабжение, пожарная безопасность, слаботочные системы, автоматизация и производство низковольтных шкафов. 26 исполненных договоров, лицензия МЧС бессрочно.',
  applicationName: 'ГК «Биокат»',
  formatDetection: { telephone: true },
  // Превью на GitHub Pages не должно конкурировать с будущим сайтом в поиске
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? { robots: { index: false, follow: false } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#0e1a1f',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const serviceLinks = services.map((service) => ({
    slug: service.slug,
    title: service.title,
    short: service.short,
  }));

  return (
    <html lang="ru" suppressHydrationWarning className={`${golos.variable} ${unbounded.variable} ${jetbrains.variable}`}>
      <head>
        {/* Ставится до первой отрисовки: без JS ни один блок не должен быть спрятан */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.dataset.js='on'",
          }}
        />
      </head>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-[2px] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          К содержанию
        </a>
        <Header
          nav={mainNav}
          serviceLinks={serviceLinks}
          phone={company.phone}
          phoneHref={company.phoneHref}
        />
        <main id="content" className="relative">
          <BusRail />
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}

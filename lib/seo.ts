import type { Metadata } from 'next';
import { company } from '@/content/company';

const SITE = 'ГК «Биокат»';

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  /** true только для главной, где title не дополняется названием компании */
  bare?: boolean;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  bare = false,
  ogImage = '/og/default.png',
}: BuildMetadataArgs): Metadata {
  const fullTitle = bare ? title : `${title} — ${SITE}`;
  const url = `${company.origin}${path}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: SITE,
      title: fullTitle,
      description,
      url,
      images: [{ url: `${company.origin}${ogImage}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    alternateName: 'ГК «Биокат»',
    url: company.origin,
    telephone: company.phone,
    email: company.email,
    foundingDate: String(company.companySince),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressLocality: 'Москва',
      streetAddress: 'ул. Скобелевская, д. 22',
      postalCode: '117624',
    },
    identifier: [
      { '@type': 'PropertyValue', name: 'ОГРН', value: '1165029056400' },
      { '@type': 'PropertyValue', name: 'ИНН', value: '5029213177' },
    ],
    areaServed: 'RU',
    knowsAbout: [
      'электроснабжение',
      'электроосвещение',
      'системы пожарной безопасности',
      'слаботочные системы',
      'автоматизация и диспетчеризация',
      'производство низковольтных комплектных устройств',
      'высоковольтные работы',
    ],
  };
}

export function serviceJsonLd(title: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: `${company.origin}${path}`,
    provider: { '@type': 'Organization', name: company.legalName, url: company.origin },
    areaServed: 'RU',
  };
}

export function breadcrumbsJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${company.origin}${item.path}`,
    })),
  };
}

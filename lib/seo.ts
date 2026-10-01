import type { Metadata } from 'next';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { absolute } from '@/lib/asset';

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
  const url = absolute(path);
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
      images: [{ url: absolute(ogImage), width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absolute(ogImage)],
    },
  };
}

/**
 * Все написания названия, по которым компанию ищут и узнают.
 * Поисковики сопоставляют их с сайтом через alternateName.
 */
export const BRAND_NAMES = [
  'ГК «Биокат»',
  'ГК БИОКАТ',
  'Биокат',
  'БИОКАТ',
  'Группа компаний «Биокат»',
  company.legalNameShort,
];

const ORG_ID = `${absolute('/')}#organization`;

/**
 * Организация — на каждой странице. Кроме реквизитов несёт каталог всех
 * направлений со ссылками на их страницы: так поисковик видит, чем компания
 * занимается, даже по одной главной.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE,
    legalName: company.legalName,
    alternateName: BRAND_NAMES.filter((name) => name !== SITE),
    description: `${SITE} — инженерные системы объектов под ключ: ${services
      .map((service) => service.title.toLowerCase())
      .join(', ')}.`,
    url: absolute('/'),
    logo: absolute('/apple-icon.png'),
    image: absolute('/og/default.png'),
    telephone: company.phone,
    email: company.email,
    foundingDate: String(company.companySince),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressLocality: 'Москва',
      streetAddress: company.addressLegalStreet,
      postalCode: '117624',
    },
    location: [
      {
        '@type': 'Place',
        name: 'Офис',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RU',
          addressLocality: 'Москва',
          streetAddress: company.addressLegalStreet,
          postalCode: '117624',
        },
      },
      {
        '@type': 'Place',
        name: 'Производство низковольтных шкафов',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RU',
          addressRegion: 'Московская область',
          addressLocality: 'д. Капустино, Мытищинский район',
          streetAddress: company.addressProductionStreet,
          postalCode: '141051',
        },
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.phone,
      email: company.email,
      contactType: 'sales',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
    identifier: [
      { '@type': 'PropertyValue', name: 'ОГРН', value: '1165029056400' },
      { '@type': 'PropertyValue', name: 'ИНН', value: '5029213177' },
    ],
    areaServed: 'RU',
    knowsAbout: services.map((service) => service.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Направления',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.short,
          url: absolute(`/services/${service.slug}/`),
        },
      })),
    },
  };
}

/**
 * Сайт — только на главной. По name и alternateName поисковики подписывают
 * сайт в выдаче названием компании, а не доменом.
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE,
    alternateName: BRAND_NAMES.filter((name) => name !== SITE),
    url: absolute('/'),
    inLanguage: 'ru-RU',
    publisher: { '@id': ORG_ID },
  };
}

export function serviceJsonLd(title: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: absolute(path),
    serviceType: title,
    provider: { '@id': ORG_ID, '@type': 'Organization', name: SITE, url: absolute('/') },
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
      item: absolute(item.path),
    })),
  };
}

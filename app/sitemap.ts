import type { MetadataRoute } from 'next';
import { company } from '@/content/company';
import { projects } from '@/content/projects';
import { services } from '@/content/services';

export const dynamic = 'force-static';

/** Собирается из content/ — ни одна страница не потеряется при добавлении объекта. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.origin;

  const staticPages = [
    { path: '/', priority: 1 },
    { path: '/services/', priority: 0.9 },
    { path: '/projects/', priority: 0.9 },
    { path: '/experience/', priority: 0.8 },
    { path: '/about/', priority: 0.7 },
    { path: '/certificates/', priority: 0.7 },
    { path: '/contacts/', priority: 0.7 },
    { path: '/privacy/', priority: 0.2 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}/`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}

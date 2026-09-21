import type { MetadataRoute } from 'next';
import { company } from '@/content/company';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/form.php'],
    },
    // host Яндекс не поддерживает с 2018 года — остаётся только sitemap
    sitemap: `${company.origin}/sitemap.xml`,
  };
}

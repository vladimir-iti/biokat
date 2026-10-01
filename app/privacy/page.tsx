import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '@/components/blocks/LegalDocument';
import { privacyPolicy } from '@/content/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Политика обработки персональных данных',
  description:
    'Политика ООО «ГК «Биокат» в отношении обработки персональных данных: какие данные собираются через формы сайта, зачем, на каком основании, как защищаются и сколько хранятся.',
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      document={privacyPolicy}
      label="Правовое"
      lead="Как мы обрабатываем данные, которые вы оставляете в формах сайта."
      crumb="Политика обработки персональных данных"
      aside={
        <p className="mt-6 t-small text-steel">
          Согласие на обработку оформлено отдельным документом:{' '}
          <Link href="/consent/" className="link-draw text-teal">
            согласие на обработку персональных данных
          </Link>
          .
        </p>
      }
    />
  );
}

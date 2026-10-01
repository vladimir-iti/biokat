import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDocument } from '@/components/blocks/LegalDocument';
import { consentDocument } from '@/content/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Согласие на обработку персональных данных',
  description:
    'Текст согласия на обработку персональных данных, которое даётся при отправке формы на сайте ООО «ГК «Биокат».',
  path: '/consent/',
});

export default function ConsentPage() {
  return (
    <LegalDocument
      document={consentDocument}
      label="Правовое"
      lead="Что именно вы разрешаете, когда отмечаете согласие в форме заявки."
      crumb="Согласие на обработку персональных данных"
      aside={
        <p className="mt-6 t-small text-steel">
          Подробно о том, как мы обращаемся с данными, —{' '}
          <Link href="/privacy/" className="link-draw text-teal">
            в политике обработки персональных данных
          </Link>
          .
        </p>
      }
    />
  );
}

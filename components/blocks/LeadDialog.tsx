'use client';

import { useEffect, useRef, useState } from 'react';
import { ContactForm } from '@/components/blocks/ContactForm';
import { company } from '@/content/company';

type Variant = 'default' | 'spec';

const copy: Record<Variant, { title: string; lead: string }> = {
  default: {
    title: 'Расскажите о задаче',
    lead: 'Ответим в рабочее время. Для срочных вопросов — телефон: быстрее, чем форма.',
  },
  spec: {
    title: 'Отправьте спецификацию',
    lead: 'Приложите однолинейную схему или спецификацию — посчитаем щит и сроки изготовления.',
  },
};

/**
 * Попап с формой заявки — один на весь сайт, живёт в layout.
 *
 * Кнопки остаются обычными ссылками на /contacts/ с атрибутом data-lead:
 * без скриптов они ведут на страницу контактов, со скриптами клик
 * перехватывается здесь и открывает форму поверх страницы.
 * data-lead="spec" — вариант с полем для файла (щитовое оборудование).
 * Ссылку, открытую в новой вкладке (Cmd/Ctrl/Shift/средняя кнопка),
 * не перехватываем.
 *
 * <dialog> сам держит фокус внутри окна и закрывается по Esc.
 */
export function LeadDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [variant, setVariant] = useState<Variant>('default');
  // Новый ключ на каждое открытие — форма приходит чистой,
  // а не с прошлым «Заявка отправлена»
  const [session, setSession] = useState(0);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLElement>('[data-lead]');
      if (!link) return;
      event.preventDefault();
      setVariant(link.dataset.lead === 'spec' ? 'spec' : 'default');
      setSession((n) => n + 1);
      ref.current?.showModal();
    };
    // Фаза перехвата: next/link сам обрабатывает клик и уводит на страницу,
    // поэтому ловим событие раньше него. Увидев отменённое действие,
    // Link навигацию не запускает.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Страница под окном не прокручивается, пока оно открыто
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const lock = () => {
      document.documentElement.style.overflow = dialog.open ? 'hidden' : '';
    };
    const observer = new MutationObserver(lock);
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = '';
    };
  }, []);

  const { title, lead } = copy[variant];

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-dialog-title"
      // Клик по подложке: цель события — сам dialog, а не его содержимое
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="lead-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-x-hidden overflow-y-auto rounded-[2px] border border-line bg-panel p-0 text-ink shadow-[0_24px_60px_rgba(14,26,31,0.25)] backdrop:bg-ink/70"
    >
      <div className="relative p-6 md:p-10">
        {/* Маркировочная полоса сверху — как у карточек сайта */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-teal" />

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Закрыть"
          className="absolute top-4 right-4 flex size-11 items-center justify-center text-steel transition-colors duration-150 hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <p className="t-label text-teal">Заявка</p>
        <h2 id="lead-dialog-title" className="t-h3 mt-3 pr-10">
          {title}
        </h2>
        <p className="t-small mt-3 text-steel">{lead}</p>

        <div className="mt-8">
          <ContactForm
            key={`${variant}-${session}`}
            variant={variant}
            framed={false}
            phone={company.phone}
            phoneHref={company.phoneHref}
          />
        </div>
      </div>
    </dialog>
  );
}

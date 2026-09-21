'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { ActionButton } from '@/components/ui/Button';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';
import {
  caretAfterDigits,
  formatPhone,
  isPhoneComplete,
  phoneDigits,
} from '@/lib/phone';

type Status = 'idle' | 'sending' | 'success' | 'error';

// Путь к обработчику — сырой, next/link его не обрабатывает:
// на превью в подпапке префикс подставляет asset()
const ENDPOINT = asset('/form.php');

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block t-small font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 t-micro text-steel">{hint}</p>}
    </div>
  );
}

const inputClass =
  'h-13 w-full rounded-[2px] border border-line bg-panel px-4 outline-none transition-colors duration-150 placeholder:text-steel/60 focus:border-teal';

export function ContactForm({
  variant = 'default',
  tone = 'light',
  phone,
  phoneHref,
}: {
  variant?: 'default' | 'spec';
  tone?: 'light' | 'dark';
  phone: string;
  phoneHref: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [phoneValue, setPhoneValue] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const openedAt = useRef(Date.now());

  const isSpec = variant === 'spec';

  // Каретку ставим после перерисовки: маска меняет длину строки,
  // и без этого курсор улетал бы в конец при правке середины номера
  useLayoutEffect(() => {
    const input = phoneRef.current;
    if (!input || caretRef.current === null) return;
    input.setSelectionRange(caretRef.current, caretRef.current);
    caretRef.current = null;
  }, [phoneValue]);

  const onPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    let head = input.value.slice(0, caret);
    const tail = input.value.slice(caret);

    // Backspace на разделителе не убирает ни одной цифры: стираем ту,
    // что стоит перед ним, иначе клавиша срабатывала бы вхолостую
    const deleting =
      (event.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
    if (deleting && phoneDigits(head + tail).length === phoneDigits(phoneValue).length) {
      head = head.replace(/\d(?=\D*$)/, '');
    }

    const next = formatPhone(head + tail);
    caretRef.current = caretAfterDigits(next, phoneDigits(head).length);
    setPhoneValue(next);
    input.setCustomValidity(
      next === '' || isPhoneComplete(next) ? '' : 'Введите номер полностью: +7 и 10 цифр',
    );
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('elapsed', String(Math.round((Date.now() - openedAt.current) / 1000)));
    data.set('subject', isSpec ? 'Расчёт по спецификации' : 'Заявка с сайта');

    setStatus('sending');
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error ?? 'Не удалось отправить заявку');
      }
      setStatus('success');
      form.reset();
      setPhoneValue('');
    } catch (cause) {
      setStatus('error');
      setError(
        cause instanceof DOMException && cause.name === 'AbortError'
          ? 'Сервер не ответил за 15 секунд'
          : cause instanceof Error
            ? cause.message
            : 'Не удалось отправить заявку',
      );
    } finally {
      clearTimeout(timeout);
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-[2px] border p-8',
          tone === 'dark' ? 'border-paper/20 bg-paper/5' : 'border-line bg-panel',
        )}
      >
        <p className="t-h3">Заявка отправлена</p>
        <p className={cn('mt-4', tone === 'dark' ? 'text-paper/70' : 'text-steel')}>
          Ответим в рабочее время, с понедельника по пятницу с 09:00 до 18:00. Если
          вопрос срочный — звоните.
        </p>
        <a
          href={`tel:${phoneHref}`}
          className="mt-6 inline-block font-mono text-lg tracking-tight text-teal"
        >
          {phone}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate={false}
      className={cn(
        'rounded-[2px] border p-6 md:p-8',
        tone === 'dark' ? 'border-paper/20 bg-paper/5' : 'border-line bg-panel',
      )}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label="Имя">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Как к вам обращаться"
          />
        </Field>

        <Field id="phone" label="Телефон">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={18}
            value={phoneValue}
            onChange={onPhoneChange}
            ref={phoneRef}
            className={inputClass}
            placeholder="+7 (___) ___-__-__"
          />
        </Field>

        <Field id="email" label="E-mail" className={isSpec ? undefined : 'md:col-span-2'}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="Чтобы прислать расчёт"
          />
        </Field>

        {isSpec && (
          <Field id="file" label="Спецификация или однолинейная схема" hint="PDF, DWG, XLS, ZIP — до 10 МБ">
            <input
              id="file"
              name="file"
              type="file"
              accept=".pdf,.dwg,.xls,.xlsx,.zip,.rar,.7z"
              className="flex min-h-13 w-full items-center rounded-[2px] border border-line bg-panel px-4 py-3 t-small outline-none transition-colors duration-150 focus:border-teal file:mr-4 file:rounded-[2px] file:border-0 file:bg-paper file:px-3 file:py-2 file:t-micro file:font-medium"
            />
          </Field>
        )}
      </div>

      <div className="mt-6">
        <Field id="message" label="Задача">
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full rounded-[2px] border border-line bg-panel px-4 py-3 outline-none transition-colors duration-150 placeholder:text-steel/60 focus:border-teal"
            placeholder={
              isSpec
                ? 'Тип щита, номинал ввода, количество групп, сроки'
                : 'Объект, состав работ, сроки'
            }
          />
        </Field>
      </div>

      {/* Ловушка для ботов — скрыта от людей и от скринридеров */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Не заполняйте это поле</label>
        <input id="company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-6 flex items-start gap-3 t-micro leading-relaxed">
        <input
          type="checkbox"
          name="consent"
          required
          value="yes"
          className="mt-1 size-4 shrink-0 accent-[var(--color-teal)]"
        />
        <span className={tone === 'dark' ? 'text-paper/70' : 'text-steel'}>
          Согласен на обработку персональных данных в соответствии с{' '}
          <Link href="/privacy/" className="link-draw text-teal">
            политикой конфиденциальности
          </Link>
        </span>
      </label>

      {status === 'error' && error && (
        <p className="mt-6 rounded-[2px] border border-alert/40 bg-alert/5 px-4 py-3 t-small text-alert">
          {error}. Позвоните нам: {phone}
        </p>
      )}

      <ActionButton
        type="submit"
        disabled={status === 'sending'}
        withArrow={status !== 'sending'}
        className="mt-8 w-full sm:w-auto"
      >
        {status === 'sending' ? 'Отправляем…' : 'Отправить'}
      </ActionButton>
    </form>
  );
}

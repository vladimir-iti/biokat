'use client';

import Link from 'next/link';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { ActionButton } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  caretAfterDigits,
  formatPhone,
  isPhoneComplete,
  phoneDigits,
} from '@/lib/phone';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Заявки принимает общий сервис forms.genobiz.ru: проверка, антиспам
 * и отправка письма живут там, у сайта своей серверной части нет.
 * Ключ сайта заведён в его config/sites.php — он же решает, куда уйдёт
 * письмо и с каких доменов запрос вообще принимается.
 */
const ENDPOINT = 'https://forms.genobiz.ru/submit';
const SITE_KEY = 'biokat';

/** Форма отправляется как multipart: иначе к заявке не приложить файл. */
const unixSeconds = () => Math.floor(Date.now() / 1000);

/** То, что стоит в пустом поле телефона, пока в нём курсор */
const PHONE_PREFIX = '+7 (';

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

/*
 * Поля всегда белые, поэтому цвет текста и курсора задан явно: в тёмной
 * форме (tone="dark") иначе наследовался бы светлый текст блока — ни ввода,
 * ни курсора на белом не видно. Подсказка прячется уже при фокусе, а не
 * с первым символом.
 */
const fieldBase =
  'w-full rounded-[2px] border border-line bg-panel px-4 text-ink caret-teal outline-none transition-colors duration-150 placeholder:text-steel/60 focus:border-teal focus:placeholder:text-transparent';

const inputClass = `h-13 ${fieldBase}`;

export function ContactForm({
  variant = 'default',
  tone = 'light',
  framed = true,
  phone,
  phoneHref,
}: {
  variant?: 'default' | 'spec';
  tone?: 'light' | 'dark';
  /** false — без своей рамки и фона: форма стоит внутри попапа */
  framed?: boolean;
  phone: string;
  phoneHref: string;
}) {
  // Префикс id: на странице может быть две формы — внизу и в попапе,
  // и подписи полей не должны указывать на чужие поля
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const [status, setStatus] = useState<Status>('idle');
  const [phoneValue, setPhoneValue] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const openedAt = useRef(unixSeconds());

  const isSpec = variant === 'spec';

  // Каретку ставим после перерисовки: маска меняет длину строки,
  // и без этого курсор улетал бы в конец при правке середины номера
  useLayoutEffect(() => {
    const input = phoneRef.current;
    if (!input || caretRef.current === null) return;
    input.setSelectionRange(caretRef.current, caretRef.current);
    caretRef.current = null;
  }, [phoneValue]);

  const phoneMessage = (value: string) =>
    value === '' || isPhoneComplete(value) ? '' : 'Введите номер полностью: +7 и 10 цифр';

  const setPhone = (input: HTMLInputElement, value: string, caret: number) => {
    caretRef.current = caret;
    setPhoneValue(value);
    input.setCustomValidity(phoneMessage(value));
  };

  // В фокусе у пустого поля сразу стоит «+7 (»: код страны виден, и первая
  // набранная цифра — хоть 8, хоть 7 — идёт в номер, а не съедается как код
  const onPhoneFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (!phoneValue) {
      setPhoneValue(PHONE_PREFIX);
      input.setCustomValidity('');
    }
    // Курсор ставим после префикса уже после клика: браузер сам ставит его
    // туда, куда щёлкнули, и сделал бы это позже нас
    requestAnimationFrame(keepCaretAfterPrefix);
  };

  // Курсор не должен стоять внутри «+7 (» — иначе цифры встанут перед кодом
  const keepCaretAfterPrefix = () => {
    const input = phoneRef.current;
    if (!input || document.activeElement !== input) return;
    const start = input.selectionStart ?? 0;
    if (start === input.selectionEnd && start < PHONE_PREFIX.length) {
      const end = Math.max(PHONE_PREFIX.length, 0);
      input.setSelectionRange(end, end);
    }
  };

  // Ушли, ничего не набрав, — префикс убираем, поле снова пустое
  const onPhoneBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (phoneDigits(phoneValue).length > 1) return;
    setPhoneValue('');
    event.currentTarget.setCustomValidity('');
  };

  // Номер, вставленный целиком (8 900…, +7 900…, 900…), заменяет поле,
  // а не дописывается после «+7 (»
  const onPhonePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '');
    if (digits.length < 10) return;
    event.preventDefault();
    const next = formatPhone(digits);
    setPhone(event.currentTarget, next, next.length);
  };

  const onPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    let head = input.value.slice(0, caret);
    const tail = input.value.slice(caret);

    // Всё выделили и набрали поверх — «+7» в строке больше нет, и набранное
    // считается номером без кода страны, иначе первая 8 или 7 пропала бы
    if (!input.value.startsWith('+')) head = `+7${head}`;

    // Backspace на разделителе не убирает ни одной цифры: стираем ту,
    // что стоит перед ним, иначе клавиша срабатывала бы вхолостую
    const deleting =
      (event.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
    if (deleting && phoneDigits(head + tail).length === phoneDigits(phoneValue).length) {
      head = head.replace(/\d(?=\D*$)/, '');
    }

    // Набрали по привычке «8 900 123-45-67» после «+7 (»: номер вышел на цифру
    // длиннее, и лишняя 8 (или 7) в начале — это код страны, а не часть номера.
    // Номера на 800 не страдают: в них ровно десять цифр.
    const national = (head + tail).replace(/\D/g, '').slice(1);
    let headDigits = phoneDigits(head).length;
    let source = head + tail;
    if (national.length > 10 && /^[78]/.test(national)) {
      source = `7${national.slice(1)}`;
      // Считаем по всем цифрам до курсора: phoneDigits обрезает до 11
      headDigits = Math.min(head.replace(/\D/g, '').length - 1, 11);
    }

    const next = formatPhone(source);
    // Стёрли всё до кода страны — в фокусе оставляем «+7 (», а не пустоту
    if (phoneDigits(next).length <= 1) {
      setPhone(input, PHONE_PREFIX, PHONE_PREFIX.length);
      return;
    }
    setPhone(input, next, caretAfterDigits(next, headDigits));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('site', SITE_KEY);
    // Сервис отличает человека от бота по возрасту формы, а не по тому,
    // сколько секунд прошло: присылаем метку отрисовки, как он и ждёт.
    data.set('form_ts', String(openedAt.current));
    data.set('page_url', window.location.href);
    data.set('subject', isSpec ? 'Расчёт по спецификации' : 'Заявка с сайта');

    setStatus('sending');
    setError(null);

    // С вложением запрос идёт ровно столько, сколько занимает отдача файла:
    // на слабом канале 10 МБ в пятнадцать секунд не уложатся.
    const file = data.get('file');
    const hasFile = file instanceof File && file.size > 0;
    const limitMs = hasFile ? 120000 : 15000;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), limitMs);

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
      setFileName('');
    } catch (cause) {
      setStatus('error');
      setError(
        cause instanceof DOMException && cause.name === 'AbortError'
          ? `Сервер не ответил за ${Math.round(limitMs / 1000)} секунд`
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
          framed && 'rounded-[2px] border p-8',
          framed && (tone === 'dark' ? 'border-paper/20 bg-paper/5' : 'border-line bg-panel'),
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
        'relative',
        framed && 'rounded-[2px] border p-6 md:p-8',
        framed && (tone === 'dark' ? 'border-paper/20 bg-paper/5' : 'border-line bg-panel'),
      )}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field id={fid('name')} label="Имя">
          <input
            id={fid('name')}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Как к вам обращаться"
          />
        </Field>

        <Field id={fid('phone')} label="Телефон">
          <input
            id={fid('phone')}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            // 18 — полный номер, +1 — чтобы по привычке набранная 8 в начале
            // не упиралась в предел и её можно было отбросить
            maxLength={19}
            value={phoneValue}
            onChange={onPhoneChange}
            onFocus={onPhoneFocus}
            onClick={keepCaretAfterPrefix}
            onKeyUp={keepCaretAfterPrefix}
            onBlur={onPhoneBlur}
            onPaste={onPhonePaste}
            ref={phoneRef}
            className={inputClass}
            placeholder="+7 (___) ___-__-__"
          />
        </Field>

        <Field id={fid('email')} label="E-mail" className="md:col-span-2">
          <input
            id={fid('email')}
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="Чтобы прислать расчёт"
          />
        </Field>

        {isSpec && (
          <Field
            id={fid('file')}
            className="md:col-span-2"
            label="Спецификация или схема" hint="Однолинейная схема или спецификация: PDF, DWG, XLS, ZIP — до 10 МБ">
            {/* Системное поле спрятано (но доступно с клавиатуры и скринридеру):
                его «Файл не выбран» не переводится и выглядит чужим. Вместо него —
                своя кнопка и имя выбранного файла. */}
            <div className="flex min-h-13 items-center gap-3 rounded-[2px] border border-line bg-panel p-2 transition-colors duration-150 focus-within:border-teal">
              <input
                ref={fileRef}
                id={fid('file')}
                name="file"
                type="file"
                accept=".pdf,.dwg,.dxf,.xls,.xlsx,.zip,.rar,.7z"
                onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? '')}
                className="peer sr-only"
              />
              <label
                htmlFor={fid('file')}
                className="group/file inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[2px] bg-paper px-4 py-2 t-small font-medium text-ink transition-[background-color,color,transform] duration-200 ease-[var(--ease-out-soft)] select-none hover:bg-teal hover:text-white active:scale-[0.97] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="overflow-visible">
                  {/* Стрелка подпрыгивает вверх, лоток стоит на месте */}
                  <path
                    d="M7 9V1.5M3.5 5L7 1.5 10.5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/file:-translate-y-[2px]"
                  />
                  <path d="M1.5 9.5v3h11v-3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {fileName ? 'Заменить' : 'Выберите файл'}
              </label>
              {fileName && (
                <>
                  <span className="min-w-0 flex-1 truncate t-small text-ink" title={fileName}>
                    {fileName}
                  </span>
                  <button
                    type="button"
                    aria-label="Убрать файл"
                    onClick={() => {
                      if (fileRef.current) fileRef.current.value = '';
                      setFileName('');
                    }}
                    className="flex size-9 shrink-0 items-center justify-center text-steel transition-colors duration-150 hover:text-alert"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </Field>
        )}
      </div>

      <div className="mt-6">
        <Field id={fid('message')} label="Задача">
          <textarea
            id={fid('message')}
            name="message"
            rows={2}
            className={cn(fieldBase, 'py-3')}
            placeholder={
              isSpec
                ? 'Тип щита, номинал ввода, количество групп, сроки'
                : 'Объект, состав работ, сроки'
            }
          />
        </Field>
      </div>

      {/* Ловушка для ботов — скрыта от людей и от скринридеров.
          Имя поля задаёт сервис: он ищет именно website */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fid('website')}>Не заполняйте это поле</label>
        <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* С 1.09.2025 согласие оформляется отдельно от иных документов
          (ст. 9 152-ФЗ): галочка даёт именно согласие и ведёт на его текст,
          а ссылка на политику стоит отдельно, вне подписи галочки.
          Документы открываются в новой вкладке — введённое в форме не теряется. */}
      <label className="mt-6 flex items-start gap-3 t-micro leading-relaxed">
        <input
          type="checkbox"
          name="consent"
          required
          value="да"
          className="mt-1 size-4 shrink-0 accent-[var(--color-teal)]"
        />
        <span className={tone === 'dark' ? 'text-paper/70' : 'text-steel'}>
          Даю{' '}
          <Link href="/consent/" target="_blank" className="link-draw text-teal">
            согласие на обработку персональных данных
          </Link>
        </span>
      </label>
      <p className={cn('mt-2 pl-7 t-micro leading-relaxed', tone === 'dark' ? 'text-paper/50' : 'text-steel')}>
        Как мы обращаемся с данными — в{' '}
        <Link href="/privacy/" target="_blank" className="link-draw text-teal">
          политике обработки персональных данных
        </Link>
      </p>

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

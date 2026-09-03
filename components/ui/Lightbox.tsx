'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Просмотр документа. Триггером служит серверная разметка (children),
 * поэтому превью остаётся в HTML и без JS открывается ссылкой на PDF.
 */
export function Lightbox({
  src,
  alt,
  file,
  children,
}: {
  src: string;
  alt: string;
  file?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === 'Tab') {
        // В оверлее два фокусируемых элемента — держим фокус внутри
        event.preventDefault();
        const nodes = document.querySelectorAll<HTMLElement>('[data-lightbox-focus]');
        const list = Array.from(nodes);
        if (list.length === 0) return;
        const index = list.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey
          ? list[(index - 1 + list.length) % list.length]
          : list[(index + 1) % list.length];
        next.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group block w-full cursor-zoom-in text-left"
        aria-label={`Открыть: ${alt}`}
      >
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-100 flex flex-col bg-ink/95 p-4 md:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
            <p className="t-label text-paper/70">
              {alt}
            </p>
            <div className="flex items-center gap-3">
              {file && (
                <a
                  href={file}
                  data-lightbox-focus
                  className="rounded-[2px] border border-paper/30 px-4 py-2 t-small text-paper transition-colors hover:border-teal hover:text-teal"
                >
                  Скачать PDF
                </a>
              )}
              <button
                ref={closeRef}
                data-lightbox-focus
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[2px] border border-paper/30 px-4 py-2 t-small text-paper transition-colors hover:border-teal hover:text-teal"
              >
                Закрыть
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto">
            <img
              src={src}
              alt={alt}
              className="h-auto w-auto max-w-[min(100%,900px)] bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}

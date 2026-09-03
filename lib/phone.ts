/**
 * Маска российского номера: +7 (999) 123-45-67.
 *
 * Ввод приводится к одному виду: 8 в начале заменяется на 7, а если человек
 * начал с кода оператора — семёрка подставляется сама. Так вставка номера
 * из письма или таблицы работает в любом из привычных написаний.
 */

const BLOCKS = [
  { at: 1, open: ' (' },
  { at: 4, open: ') ' },
  { at: 7, open: '-' },
  { at: 9, open: '-' },
];

/** Только цифры, приведённые к формату 7XXXXXXXXXX */
export function phoneDigits(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (!digits) return '';
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  else if (digits[0] !== '7') digits = `7${digits}`;
  return digits.slice(0, 11);
}

export function formatPhone(input: string): string {
  const digits = phoneDigits(input);
  if (!digits) return '';

  let out = '+7';
  for (let i = 1; i < digits.length; i += 1) {
    const block = BLOCKS.find((b) => b.at === i);
    if (block) out += block.open;
    out += digits[i];
  }
  return out;
}

export function isPhoneComplete(input: string): boolean {
  return phoneDigits(input).length === 11;
}

/** Позиция каретки после n-й цифры отформатированной строки */
export function caretAfterDigits(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === count) return i + 1;
    }
  }
  return formatted.length;
}

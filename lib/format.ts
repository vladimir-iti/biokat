/** Суммы в реестре хранятся в тысячах рублей — ровно как в справке о компании. */

export function formatThousands(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** 27796.8 (тыс.) → «27,8 млн» */
export function formatMillions(amountThousands: number, digits = 1): string {
  const millions = amountThousands / 1000;
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(millions);
}

export function formatInt(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/** plural(26, ['договор', 'договора', 'договоров']) → 'договоров' */
export function plural(count: number, forms: [string, string, string]): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

/** '09.07.2016' → 2016 */
export function yearOf(date: string): number | null {
  const match = date.match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

/**
 * В реестре у большинства строк одинаковое начало
 * («Электромонтажные и слаботочные работы, изготовление НКУ для …»).
 * В таблице оно съедает всю ширину, поэтому в интерфейсе показываем объект.
 */
export function contractObject(description: string): string {
  const trimmed = description.replace(
    /^(Электромонтажные и слаботочные работы, изготовление НКУ для\s+|Изготовление НКУ с шеф-монтажными работами для\s+|Проектные и слаботочные работы,\s+)/i,
    '',
  );
  if (trimmed === description) return description;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** «2023–2023» читается странно — для одного года показываем один год */
export function yearRange(from: string, to: string): string {
  const start = yearOf(from);
  const end = yearOf(to);
  if (!start) return '—';
  if (!end || start === end) return String(start);
  return `${start}–${end}`;
}

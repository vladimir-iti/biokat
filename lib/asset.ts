/**
 * Префикс пути.
 *
 * На своём домене сайт лежит в корне и префикс пустой. На GitHub Pages он
 * живёт в подпапке репозитория — тогда сюда приходит её имя, и все ссылки
 * на файлы в public/ получают правильный путь.
 *
 * next/link и next/image подставляют basePath сами; префикс нужен только
 * сырым src и href.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  return `${basePath}${path}`;
}

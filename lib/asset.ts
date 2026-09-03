import { company } from '@/content/company';

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

/**
 * Origin, от которого считаются canonical и картинка для соцсетей.
 *
 * На своём домене это домен компании. На превью в GitHub Pages ссылки
 * ведут туда же, где лежит превью, иначе мессенджер пошёл бы за картинкой
 * на ещё не запущенный сайт и показал бы ссылку без изображения.
 */
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? company.origin;

/** Абсолютный адрес страницы или файла — с учётом подпапки превью */
export function absolute(path: string): string {
  return `${siteOrigin}${asset(path)}`;
}

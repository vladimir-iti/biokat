/**
 * Сообщает Яндексу (и другим поисковикам с IndexNow) об адресах сайта —
 * без Яндекс.Вебмастера. Запускать после выкладки:
 *
 *     npm run indexnow            — все адреса из out/sitemap.xml
 *     npm run indexnow -- /contacts/ /services/   — только перечисленные
 *
 * Как это работает: в корне сайта лежит файл <ключ>.txt с самим ключом
 * (public/RAXoveBcpgBQdQSc6jAxBNldTpdUEaxN.txt). Яндекс скачивает его и убеждается, что адреса
 * присылает владелец сайта. Ключ публичный по замыслу протокола — секрета
 * в нём нет, но менять его без нужды не стоит.
 *
 * Ответ 200 — адреса приняты, 202 — ключ ещё проверяется (повторить позже).
 * IndexNow — подсказка «обойди эти страницы», а не гарантия индексации.
 */
import { readFile } from 'node:fs/promises';

const KEY = 'RAXoveBcpgBQdQSc6jAxBNldTpdUEaxN';
const HOST = 'xn--80abvit0a.xn--p1ai';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://yandex.com/indexnow';

async function urlsFromSitemap(): Promise<string[]> {
  const xml = await readFile(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((path) => new URL(path, ORIGIN).toString())
  : await urlsFromSitemap();

if (urlList.length === 0) {
  console.error('Нет адресов: соберите сайт (npm run build) или передайте пути аргументами');
  process.exit(1);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});

const text = await response.text();
console.log(`IndexNow: ${response.status} ${response.statusText}, адресов: ${urlList.length}`);
if (text) console.log(text);
if (!response.ok) process.exit(1);

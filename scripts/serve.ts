/**
 * Локальная отдача собранной статики из out/ — так же, как её будет
 * отдавать Apache на Beget: индексный файл каталога, свой 404,
 * длинный кэш для хэшированных ассетов.
 *
 * Нужен только для проверки продакшен-сборки. На хостинг не выкладывается.
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'out');
const PORT = Number(process.env.PORT ?? 3000);

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.php': 'text/plain; charset=utf-8',
};

async function resolve(pathname: string): Promise<string | null> {
  const decoded = decodeURIComponent(pathname);
  const target = path.join(ROOT, path.normalize(decoded).replace(/^(\.\.[/\\])+/, ''));
  if (!target.startsWith(ROOT)) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = path.join(target, 'index.html');
      await stat(index);
      return index;
    }
    return target;
  } catch {
    try {
      const html = `${target.replace(/\/$/, '')}.html`;
      await stat(html);
      return html;
    } catch {
      return null;
    }
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const file = await resolve(url.pathname);

  if (!file) {
    const notFound = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    createReadStream(notFound).pipe(res);
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const immutable = file.includes(`${path.sep}_next${path.sep}static${path.sep}`);

  res.writeHead(200, {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Продакшен-статика из out/ — http://localhost:${PORT}`);
});

/**
 * Подготовка изображений на сборке.
 *
 * При output: 'export' рантайм-оптимизации нет, поэтому варианты готовим здесь:
 * реальные фотографии кладём в assets/photos/<slug>.jpg — они имеют приоритет;
 * если фотографии ещё нет, генерируется схематичная обложка объекта,
 * построенная на том же языке, что и вся страница.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PHOTOS = path.join(ROOT, 'assets', 'photos');
const OUT = path.join(ROOT, 'public', 'images', 'projects');
const DOCS = path.join(ROOT, 'public', 'images', 'documents');

const WIDTHS = [640, 960, 1440];
const RATIO = 10 / 16;

const INK = '#0e1a1f';
const PAPER = '#f2f4f4';
const TEAL = '#0f7a8e';
const LINE = '#c9d5d8';

type Seeded = () => number;

function seeded(slug: string): Seeded {
  const hash = createHash('sha1').update(slug).digest();
  let i = 0;
  return () => {
    const value = hash[i % hash.length] + hash[(i + 7) % hash.length] * 256;
    i += 1;
    return (value % 1000) / 1000;
  };
}

/** Схематичная обложка: сетка листа, шина, отводы, узлы. */
function coverSvg(slug: string, width: number): string {
  const height = Math.round(width * RATIO);
  const rand = seeded(slug);
  const scale = width / 1440;

  const cells: string[] = [];
  const step = 40;
  for (let x = step; x < 1440; x += step) {
    cells.push(`<line x1="${x}" y1="0" x2="${x}" y2="900" stroke="${LINE}" stroke-width="1" opacity="0.35"/>`);
  }
  for (let y = step; y < 900; y += step) {
    cells.push(`<line x1="0" y1="${y}" x2="1440" y2="${y}" stroke="${LINE}" stroke-width="1" opacity="0.35"/>`);
  }

  const busX = 170;
  const branches: string[] = [];

  // Число отводов и вертикальный размах одинаковы у всех обложек:
  // иначе в сетке одни карточки выглядят заметно пустее других.
  const COUNT = 6;
  const TOP = 150;
  const BOTTOM = 760;
  const STEP = (BOTTOM - TOP) / (COUNT - 1);

  // Суммарная длина отводов у всех обложек одна и та же — меняется только
  // её распределение. Так рисунок остаётся разным, а вес пятна одинаковым.
  const TOTAL = 4200;
  const weights = Array.from({ length: COUNT }, () => 0.5 + rand());
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const lengths = weights.map((wgt) =>
    Math.min(1150, Math.max(300, Math.round((wgt / weightSum) * TOTAL))),
  );

  for (let i = 0; i < COUNT; i += 1) {
    const y = Math.round(TOP + STEP * i + (rand() - 0.5) * 34);
    const len = lengths[i];
    const modules = 1 + Math.floor(rand() * 3);
    const parts: string[] = [
      `<line x1="${busX}" y1="${y}" x2="${busX + len}" y2="${y}" stroke="${TEAL}" stroke-width="3"/>`,
      `<rect x="${busX - 5}" y="${y - 5}" width="10" height="10" fill="${INK}"/>`,
      `<rect x="${busX + len - 6}" y="${y - 6}" width="12" height="12" fill="${TEAL}"/>`,
    ];
    for (let m = 0; m < modules; m += 1) {
      const mx = busX + 60 + Math.floor(rand() * Math.max(60, len - 140));
      const mh = 26 + Math.floor(rand() * 22);
      parts.push(
        `<rect x="${mx}" y="${y - mh / 2}" width="34" height="${mh}" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>`,
      );
    }
    if (rand() > 0.35) {
      const drop = 34 + Math.floor(rand() * 40);
      parts.push(
        `<line x1="${busX + len}" y1="${y}" x2="${busX + len}" y2="${y + drop}" stroke="${TEAL}" stroke-width="2" opacity="0.45"/>`,
        `<line x1="${busX + len - 14}" y1="${y + drop}" x2="${busX + len + 14}" y2="${y + drop}" stroke="${TEAL}" stroke-width="2" opacity="0.45"/>`,
      );
    }
    branches.push(...parts);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1440 900">
  <rect width="1440" height="900" fill="${PAPER}"/>
  <g>${cells.join('')}</g>
  <line x1="${busX}" y1="90" x2="${busX}" y2="810" stroke="${INK}" stroke-width="3"/>
  <g>${branches.join('')}</g>
  <rect x="0" y="0" width="1440" height="900" fill="none" stroke="${LINE}" stroke-width="${Math.max(2, 2 / scale)}"/>
</svg>`;
}

async function emit(buffer: Buffer, slug: string, width: number) {
  const base = path.join(OUT, `${slug}-${width}`);
  // Единая тональная обработка запекается здесь, а не задаётся CSS-фильтром:
  // фильтр в браузере пересчитывается при каждой перерисовке кадра.
  const resized = sharp(buffer)
    .resize(width, Math.round(width * RATIO), { fit: 'cover' })
    .modulate({ saturation: 0.9 })
    .linear(1.03, -0.03 * 128);
  await Promise.all([
    resized.clone().avif({ quality: 55 }).toFile(`${base}.avif`),
    resized.clone().webp({ quality: 76 }).toFile(`${base}.webp`),
    resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}.jpg`),
  ]);
}

async function buildProjects() {
  await mkdir(OUT, { recursive: true });
  const { projects } = (await import('../content/projects.ts')) as {
    projects: { slug: string; title: string; region: string }[];
  };

  const photos = existsSync(PHOTOS) ? await readdir(PHOTOS) : [];
  const photoBySlug = new Map(
    photos.map((file) => [path.parse(file).name, path.join(PHOTOS, file)]),
  );

  for (const project of projects) {
    const photo = photoBySlug.get(project.slug);
    for (const width of WIDTHS) {
      const source = photo
        ? await readFile(photo)
        : Buffer.from(coverSvg(project.slug, width));
      await emit(source, project.slug, width);
    }
    console.log(`${photo ? 'фото ' : 'схема'}  ${project.slug}`);
  }
}

async function buildDocuments() {
  if (!existsSync(DOCS)) return;
  const files = await readdir(DOCS);
  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    const name = path.parse(file).name;
    const input = path.join(DOCS, file);
    const image = sharp(input).resize(900, null, { withoutEnlargement: true });
    await Promise.all([
      image.clone().avif({ quality: 58 }).toFile(path.join(DOCS, `${name}.avif`)),
      image.clone().webp({ quality: 80 }).toFile(path.join(DOCS, `${name}.webp`)),
    ]);
    console.log(`документ ${name}`);
  }
}

async function buildOg() {
  const dir = path.join(ROOT, 'public', 'og');
  await mkdir(dir, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <line x1="120" y1="0" x2="120" y2="630" stroke="${TEAL}" stroke-width="2" opacity="0.5"/>
  <rect x="114" y="300" width="12" height="12" fill="${TEAL}"/>
  <line x1="120" y1="306" x2="300" y2="306" stroke="${TEAL}" stroke-width="2"/>
  <text x="120" y="250" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="${PAPER}" letter-spacing="-2">БИОКАТ</text>
  <text x="120" y="400" font-family="ui-monospace, monospace" font-size="30" fill="${TEAL}" letter-spacing="4">ИНЖЕНЕРНЫЕ СИСТЕМЫ ОБЪЕКТОВ</text>
  <text x="120" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${PAPER}" opacity="0.6">Электроснабжение · Пожарная безопасность · НКУ · Автоматика</text>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, 'default.png'));
  await writeFile(path.join(dir, '.gitkeep'), '');
  console.log('og  default');
}

await buildProjects();
await buildDocuments();
await buildOg();

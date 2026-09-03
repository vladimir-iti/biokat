import type { NextConfig } from 'next';

// На своём домене пусто, на GitHub Pages — имя репозитория
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Статический экспорт: на Beget нет Node-процесса, только Apache + PHP.
  output: 'export',
  // Apache отдаёт /projects/sochi/index.html только по адресу со слешем на конце.
  trailingSlash: true,
  // При output: 'export' рантайм-оптимизация недоступна — варианты картинок
  // готовит scripts/images.ts, разметку отдаёт <picture>.
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};

export default nextConfig;

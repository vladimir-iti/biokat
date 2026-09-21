import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

// next lint объявлен устаревшим и исчезнет в Next.js 16, поэтому правила
// подключаются напрямую через ESLint CLI. FlatCompat нужен, пока
// eslint-config-next публикуется в старом формате.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'Биокат/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Картинки готовит scripts/images.ts: при output: 'export'
      // next/image не оптимизирует, разметку отдаёт <picture>
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;

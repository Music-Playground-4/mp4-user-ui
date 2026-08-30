import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// ESLint 9 flat config. eslint-config-next 는 아직 eslintrc 형식이라
// FlatCompat 으로 감싸서 불러옵니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    // .next-verify 는 dev 서버와 충돌하지 않게 따로 빌드할 때 쓰는 산출물 폴더다.
    ignores: ['.next/**', '.next-verify/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;

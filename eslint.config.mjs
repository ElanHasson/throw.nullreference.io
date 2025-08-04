import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'
import testingLibrary from 'eslint-plugin-testing-library'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      'react/no-unescaped-entities': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*'],
    plugins: {
      jest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },
    languageOptions: {
      globals: {
        jest: true,
        expect: true,
        test: true,
        describe: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
        it: true,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...jestDom.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
    },
  },
]

export default eslintConfig

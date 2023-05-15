/* eslint-env node */
require('@rushstack/eslint-patch/lib/modern-module-resolution');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('node:path');

/** @type {import('eslint').Linter.Config */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },

  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [__dirname, resolve(__dirname, '.svelte-kit')],
      },
      node: true,
      'eslint-import-resolver-custom-alias': {
        alias: {
          $lib: './src/lib',
          $app: './.svelte-kit/runtime/app',
          '@sveltejs': './.svelte-kit/dev',
        },
        extensions: ['.ts', '.js', '.svelte'],
      },
    },
    'import/extensions': ['*.ts', '*.svelte'],

    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },

  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.svelte'],
    tsconfigRootDir: [__dirname, resolve(__dirname, '.svelte-kit')],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    'import/order': 'warn',
    'import/default': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default-member': 'off',
  },
};

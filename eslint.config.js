const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const checkFile = require('eslint-plugin-check-file');
const tsParser = require('@typescript-eslint/parser');

const { fixupConfigRules } = require('@eslint/compat');

const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  ...compat.config({
    extends: ['next'],
  }),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    extends: compat.extends('eslint:recommended'),

    plugins: {
      'check-file': checkFile,
    },
  },
  globalIgnores([
    'node_modules/*',
    'public/mockServiceWorker.js',
    'generators/*',
    '.next/*',
  ]),
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:tailwindcss/recommended',
      ),
    ),

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      '@typescript-eslint/explicit-module-boundary-types': ['off'],
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],

      'prettier/prettier': ['error'],

      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    plugins: {
      'check-file': checkFile,
    },

    files: ['src/**/!(__tests__)/*'],

    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },
]);

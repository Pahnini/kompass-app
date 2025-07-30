// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  // Base configuration
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'dist/**',
      'dev-dist/**',
      'build/**',
      'node_modules/**',
      '*.min.js',
      'coverage/**',
      '.next/**',
      '.nuxt/**',
      '.vscode/**',
      '.idea/**',
      '*.log',
      '**/sw.js',
      '**/workbox-*.js',
    ],
  },

  // JavaScript configuration
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-duplicate-props': 'error',
      'react/no-unescaped-entities': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-duplicate-props': 'error',
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

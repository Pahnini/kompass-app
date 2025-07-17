// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default [
  // Base configuration for all files
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '*.min.js',
      'coverage/**',
      '.next/**',
      '.nuxt/**',
      '.vscode/**',
      '.idea/**',
      '*.log',
    ],
  },

  // Configuration for JavaScript files (including config files)
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

  // TypeScript configuration - only apply to TypeScript files
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  // Override configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
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
];

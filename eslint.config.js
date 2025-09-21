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
      '.turbo/**',
      '.cache/**',
      'public/build/**',
      'storybook-static/**',
      '**/*.d.ts',
      '.env*',
      '*.tsbuildinfo',
      '.DS_Store',
      'Thumbs.db',
      // Development and testing scripts
      'scripts/**',
      // Supabase configuration and migrations
      'supabase/**',
      // Configuration files that cause parsing issues
      'vitest.config.ts',
      'vite.config.ts',
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

      // Enhanced TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-exports': 'error',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      // Disable some strict rules for test files
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off',
    },
  },
];

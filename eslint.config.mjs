import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
      'playwright/.cache/',
      'playwright/.auth/',
      'perf-results/',
      'isolation-results/',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // Zero Hardcode and clean terminal: no debug output in the code.
      'no-console': 'error',
      // No unused variables.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // No silent failures: empty catch blocks are forbidden.
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-useless-catch': 'error',
      // Safe comparisons and clean declarations.
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  {
    files: ['src/**/*.js', 'config/**/*.js'],
    plugins: { jsdoc },
    rules: {
      // Mandatory JSDoc for every exported function and class.
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: { cjs: true, esm: true },
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/require-returns-description': 'error',
    },
  },

  {
    // Playwright fixtures have a fixed signature ({ ...fixtures }, use) defined by the framework,
    // so their parameters are not documented one by one. The fixtures are described by comments.
    files: ['src/fixtures/**/*.js'],
    rules: {
      'jsdoc/require-param': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns-description': 'off',
    },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
];

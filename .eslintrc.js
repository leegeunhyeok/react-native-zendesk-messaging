const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
  ],
  parserOptions: {
    project,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
    {
      files: ['**/?(*.)+(spec|test).ts?(x)'],
      extends: [require.resolve('@vercel/style-guide/eslint/jest')],
    },
    {
      files: ['examples/**/*.js?(x)', 'examples/**/*.ts?(x)'],
      rules: {
        'no-console': 'off',
        'import/no-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
        'unicorn/filename-case': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
      },
    },
  ],
};

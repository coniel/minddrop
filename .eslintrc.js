module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['custom'],
  plugins: ['prettier'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'any', prev: '*', next: 'export' },
    ],
  },
};

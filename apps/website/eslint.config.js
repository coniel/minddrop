import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { config } from '@minddrop/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  ...astro.configs.recommended,
  {
    // The site builds and renders in Node, so Node's globals are all in scope
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Astro's generated types and the build output are not ours to lint
    ignores: ['.astro/**', 'dist/**'],
  },
];

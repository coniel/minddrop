import { readFileSync } from 'node:fs';

/*
 * The repository's shared options, read rather than duplicated so this config
 * only has to state what is different here.
 */
const rootConfig = JSON.parse(
  readFileSync(new URL('../../.prettierrc', import.meta.url), 'utf8'),
);

/** @type {import("prettier").Config} */
export default {
  ...rootConfig,
  // Astro files need their own parser, which the root config has no reason to load
  plugins: [...rootConfig.plugins, 'prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};

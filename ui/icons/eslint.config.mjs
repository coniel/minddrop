import { config } from '@minddrop/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: [
      'src/content-icons.min.json',
      'src/content-icons.min.tsx',
      'src/ui-icons.min.tsx',
    ],
  },
];

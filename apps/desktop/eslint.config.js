import { config } from '@minddrop/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['src-tauri/gen/**', 'src-tauri/target/**'],
  },
];

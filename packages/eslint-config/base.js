import js from '@eslint/js';
import onlyWarn from 'eslint-plugin-only-warn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import { minddropPlugin } from './plugin.js';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      minddrop: minddropPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      // Switch to 'error' once the existing violations have been
      // swept with `eslint --fix`. Around 1,600 comments across the
      // repo predate the convention, and lint runs with
      // --max-warnings 0, so turning it on before the sweep fails
      // every package.
      'minddrop/multiline-comment-period': 'off',
      // Switch to 'error' once the existing violations have been
      // swept. Around 75 solo-wrapped directories across the repo
      // predate the convention; the fixes move files, so the sweep
      // waits for a moment with no unmerged worktree work.
      'minddrop/companion-directory': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '_',
          varsIgnorePattern: '_',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              message:
                "Use the Icon or ContentIcon components from '@minddrop/ui-primitives'. The root module statically imports every icon, which puts the whole set in the module graph. 'lucide-react/dynamic' loads them one at a time and stays allowed.",
            },
          ],
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'any', prev: '*', next: 'export' },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/**', '*.min.*'],
  },
];

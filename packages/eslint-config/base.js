import js from '@eslint/js';
import onlyWarn from 'eslint-plugin-only-warn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

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
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
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

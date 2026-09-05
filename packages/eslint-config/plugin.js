import { multilineCommentPeriod } from './rules/multiline-comment-period.js';

/**
 * The repository's own ESLint rules, enforcing conventions from
 * `dev/docs/commenting.md`.
 *
 * @type {import("eslint").ESLint.Plugin}
 */
export const minddropPlugin = {
  rules: {
    'multiline-comment-period': multilineCommentPeriod,
  },
};

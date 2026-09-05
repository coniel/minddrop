import { companionDirectory } from './rules/companion-directory.js';
import { multilineCommentPeriod } from './rules/multiline-comment-period.js';

/**
 * The repository's own ESLint rules, enforcing the repository's
 * commenting and file structure conventions.
 *
 * @type {import("eslint").ESLint.Plugin}
 */
export const minddropPlugin = {
  rules: {
    'companion-directory': companionDirectory,
    'multiline-comment-period': multilineCommentPeriod,
  },
};

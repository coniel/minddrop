import { TokenList } from '../types';

/**
 * Converts tokens into a markdown document.
 *
 * @param tokens - A token list.
 * @returns Markdown document.
 */
export function tokensToMarkdown(tokens: TokenList): string {
  // Combine token raw strings to form markdown text
  return tokens.map((token) => token.raw).join('');
}

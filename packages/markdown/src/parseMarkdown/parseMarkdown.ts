import { marked } from 'marked';
import { TokenList } from '../types';

marked.use({
  gfm: true,
});

/**
 * Parses markdown into tokens.
 *
 * @param markdown - The markdown to parse.
 * @returns A token list.
 */
export function parseMarkdown(markdown: string): TokenList {
  return marked.lexer(markdown);
}

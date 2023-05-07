import { Fs } from '@minddrop/core';
import { TokenList } from '../types';
import { tokensToMarkdown } from '../tokensToMarkdown';

/**
 * Converts tokens into a markdown document and writes
 * it to a file.
 *
 * @param path - The markdown file path.
 * @param tokens - A token list.
 */
export async function writeMarkdownFile(
  path: string,
  tokens: TokenList,
): Promise<void> {
  // Convert tokens to markdown
  const md = tokensToMarkdown(tokens);

  // Write markdown to file
  await Fs.writeTextFile(path, md);
}

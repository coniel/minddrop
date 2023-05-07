import { Fs, InvalidParameterError } from '@minddrop/core';
import { parseMarkdown } from '../parseMarkdown';
import { TokenList } from '../types';

/**
 * Parses a markdown file's content into tokens.
 *
 * @param path - The path to the markdown file.
 * @returns A token list.
 */
export async function parseMarkdownFile(path: string): Promise<TokenList> {
  // Ensure file exists
  if (!(await Fs.exists(path))) {
    throw new InvalidParameterError(`markdown file '${path}' does not exist`);
  }

  // Get file contents
  const md = await Fs.readTextFile(path);

  // Return parsed contents
  return parseMarkdown(md);
}

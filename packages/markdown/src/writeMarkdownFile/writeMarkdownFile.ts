import { Fs } from '@minddrop/core';
import { RootContent } from '../types';
import { mdastNodesToMarkdown } from '../mdastNodesToMarkdown';

/**
 * Converts tokens into a markdown document and writes
 * it to a file.
 *
 * @param path - The markdown file path.
 * @param tokens - A token list.
 */
export async function writeMarkdownFile(
  path: string,
  nodes: RootContent[],
): Promise<void> {
  // Convert tokens to markdown
  const md = mdastNodesToMarkdown(nodes);

  // Write markdown to file
  await Fs.writeTextFile(path, md);
}

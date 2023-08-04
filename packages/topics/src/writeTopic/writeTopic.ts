import { Fs } from '@minddrop/core';
import { ensureTopicExists } from '../ensureTopicExists';
import { getTopicMarkdownFilePath } from '../getTopicMarkdownFilePath';

/**
 * Writes the provided markdown to a topic's markdown file.
 *
 * @param path - The topic path.
 * @param markdown - The topic markdown.
 */
export async function writeTopic(
  path: string,
  markdown: string,
): Promise<void> {
  // Ensure that the topic exists
  await ensureTopicExists(path);

  // Get the path to the topic's markdown file path
  const mdFilePath = getTopicMarkdownFilePath(path);

  // Write the markdown to the markdown file
  Fs.writeTextFile(mdFilePath, markdown);
}

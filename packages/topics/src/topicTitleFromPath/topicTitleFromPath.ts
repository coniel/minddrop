/**
 * Parses the topic title from it's path.
 *
 * @param path - The topic path.
 * @returns The topic title.
 */
export function topicTitleFromPath(path: string): string {
  const filename = path.split('/').slice(-1)[0];

  // Remove markdown file extension if present
  if (filename.endsWith('.md')) {
    return filename.slice(0, -3);
  }

  return filename;
}

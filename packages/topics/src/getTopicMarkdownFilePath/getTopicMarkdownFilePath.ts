/**
 * Returns the path to a topic's markdown file. Does **not**
 * check for the existence of the file.
 *
 * @param path - The topic path.
 * @returns The path to the topic's markdown file.
 */
export function getTopicMarkdownFilePath(path: string): string {
  // If the topic path is a markdown file path,
  // return it as is.
  if (path.endsWith('.md')) {
    return path;
  }

  // Create the topic's markdown file path
  return `${path}/${path.split('/').slice(-1)[0]}.md`;
}

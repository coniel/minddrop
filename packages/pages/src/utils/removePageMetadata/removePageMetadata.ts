/**
 * Removes the YAML front matter from a page's content.
 *
 * @param content - The page content.
 * @returns The page content without metadata.
 */
export function removePageMetadata(content: string): string {
  const YAMLFrontMatter = /---[\r\n].*?[\r\n]---[\r\n][\r\n]/s;

  // If content does not start with YAML front matter
  // delimiter, return it as is.
  if (!content.startsWith('---')) {
    return content;
  }

  // Remove YAML front matter
  return content.replace(YAMLFrontMatter, '');
}

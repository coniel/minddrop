/**
 * Removes the YAML front matter from a document's content.
 *
 * @param content - The document content.
 * @returns The document content without metadata.
 */
export function removeDocumentMetadata(content: string): string {
  const YAMLFrontMatter = /---[\r\n].*?[\r\n]---[\r\n][\r\n]/s;

  // If content does not start with YAML front matter
  // delimiter, return it as is.
  if (!content.startsWith('---')) {
    return content;
  }

  // Remove YAML front matter
  return content.replace(YAMLFrontMatter, '');
}

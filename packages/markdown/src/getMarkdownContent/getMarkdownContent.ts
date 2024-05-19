import { removeFrontmatter } from '../removeFrontmatter';

/**
 * Returns the pure markdown content without potential frontmatter.
 *
 * @param content - The file content.
 * @returns The pure markdown content.
 */
export function getMarkdownContent(content: string): string {
  // Remove frontmatter from the content
  return removeFrontmatter(content);
}

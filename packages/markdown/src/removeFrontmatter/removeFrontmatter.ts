import { parseFrontmatter } from '../utils';

/**
 * Remove frontmatter from a markdown string.
 *
 * @param content - The markdown content.
 * @returns The markdown content without frontmatter.
 */
export function removeFrontmatter(content: string): string {
  return parseFrontmatter(content).body;
}

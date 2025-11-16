/**
 * Remove frontmatter from a markdown string.
 * Supports frontmatter with or without a trailing newline.
 *
 * @param content - The markdown content.
 * @returns The markdown content without frontmatter.
 */
export function removeFrontmatter(content: string): string {
  // If the content doesn't start with frontmatter, return it as is
  if (!content.startsWith('---')) {
    return content;
  }

  // Remove frontmatter
  const markdown = content.replace(/---[\s\S]*?---/, '').replace(/\n/, '');

  // Remove possible leading newline
  if (markdown.startsWith('\n')) {
    return markdown.slice(1);
  }

  return markdown;
}

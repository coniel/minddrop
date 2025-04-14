import { stringify } from 'yaml';
import { getMarkdownContent } from '../getMarkdownContent';

/**
 * Adds the provided properties as frontmatter to the given markdown content.
 * Removes any existing frontmatter.
 *
 * If the properties object is empty, no frontmatter will be added, and any existing
 * frontmatter will be removed.
 *
 * @param markdown - The markdown content to which the properties will be added.
 * @param properties - The properties to be added as frontmatter.
 * @returns The markdown content with the properties added as frontmatter.
 */
export function setPropertiesOnMarkdown(
  markdown: string,
  properties: Record<string, unknown>,
): string {
  const frontmatter = stringify(properties);

  // If the properties object is empty, remove the frontmatter
  // and return the markdown content.
  if (!Object.keys(properties).length) {
    return getMarkdownContent(markdown);
  }

  // Add the frontmatter to the markdown content
  return `---\n${frontmatter}---\n\n${getMarkdownContent(markdown)}`;
}

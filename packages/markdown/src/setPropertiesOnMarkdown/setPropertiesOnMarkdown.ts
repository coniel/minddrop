import { stringify } from 'yaml';
import { getMarkdownContent } from '../getMarkdownContent';

/**
 * Adds the provided properties as frontmatter to the given markdown content.
 * Removes any existing frontmatter.
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

  return `---\n${frontmatter}---\n\n${getMarkdownContent(markdown)}`;
}

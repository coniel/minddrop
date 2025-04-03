import { parse } from 'yaml';
import { FrontmatterParseError } from '../errors';

/**
 * Returns the properties from a markdown document.
 *
 * @param markdown - The markdown content.
 * @returns The properties from the frontmatter.
 */
export function getPropertiesFromMarkdown(
  markdown: string,
): Record<string, string> {
  // Extract front matter
  const match = markdown.match(/^---\n([\s\S]+?)\n---/);

  // If there is no front matter, return empty properties
  if (!match) {
    return {};
  }

  try {
    // Parse front matter
    return parse(match[1]);
  } catch (error) {
    console.error(error);

    throw new FrontmatterParseError(markdown);
  }
}

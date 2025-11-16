import {
  Properties,
  PropertiesSchema,
  PropertyMap,
} from '@minddrop/properties';
import { FrontmatterParseError } from '../errors';

/**
 * Returns the properties from a markdown document.
 *
 * @param schema - The properties schema.
 * @param markdown - The markdown content.
 * @returns The properties from the frontmatter.
 */
export function getPropertiesFromMarkdown(
  schema: PropertiesSchema,
  markdown: string,
): PropertyMap {
  // Extract front matter
  const match = markdown.match(/^---\n([\s\S]+?)\n---/);

  // If there is no front matter, return empty properties
  if (!match) {
    return {};
  }

  try {
    // Parse front matter
    return Properties.fromYaml(schema, match[1]);
  } catch (error) {
    console.error(error);

    throw new FrontmatterParseError(markdown);
  }
}

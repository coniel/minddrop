import {
  Properties,
  PropertiesSchema,
  PropertyMap,
} from '@minddrop/properties';
import { FrontmatterParseError } from '../errors';
import { parseFrontmatter } from '../utils';

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
  const { source } = parseFrontmatter(markdown);

  // If there is no front matter, return empty properties
  if (source === null) {
    return {};
  }

  try {
    // Parse front matter
    return Properties.fromYaml(schema, source);
  } catch (error) {
    console.error(error);

    throw new FrontmatterParseError(markdown);
  }
}

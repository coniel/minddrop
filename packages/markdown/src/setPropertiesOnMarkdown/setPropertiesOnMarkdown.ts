import {
  Properties,
  PropertiesSchema,
  PropertyMap,
} from '@minddrop/properties';
import { parseFrontmatter } from '../utils';

export interface SetPropertiesOnMarkdownOptions {
  /**
   * The entry's current file content. Its frontmatter is merged into rather
   * than replaced, so anything MindDrop does not model survives.
   */
  existingContent?: string;
}

/**
 * Applies the provided properties to the given markdown content as frontmatter.
 *
 * When the entry's current file content is provided, its frontmatter is edited
 * in place: comments, key order, quoting style, block scalars and keys absent
 * from the schema all survive. Otherwise the frontmatter is generated fresh.
 *
 * @param schema - The properties schema.
 * @param properties - The properties to write as frontmatter.
 * @param markdown - The markdown content to which the properties will be added.
 * @param options - Options for preserving the existing frontmatter.
 * @returns The markdown content with the properties applied as frontmatter.
 */
export function setPropertiesOnMarkdown(
  schema: PropertiesSchema,
  properties: PropertyMap,
  markdown: string,
  options: SetPropertiesOnMarkdownOptions = {},
): string {
  // The frontmatter currently on disk, which is merged into rather than
  // regenerated so that unmodelled keys and formatting are not destroyed
  const existingFrontmatter = options.existingContent
    ? parseFrontmatter(options.existingContent).source
    : null;

  const frontmatter =
    existingFrontmatter === null
      ? Properties.toYaml(schema, properties)
      : Properties.mergeYaml(schema, properties, existingFrontmatter);

  const body = parseFrontmatter(markdown).body;

  // A document with no keys left serializes to an empty flow map. Omit the
  // block entirely rather than writing `{}` between a pair of fences.
  if (!frontmatter.trim() || frontmatter.trim() === '{}') {
    return body;
  }

  return `---\n${frontmatter}---\n\n${body}`;
}

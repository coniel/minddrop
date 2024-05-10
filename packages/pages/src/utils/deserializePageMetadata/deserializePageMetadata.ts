import { parse } from 'yaml';
import { PageMetadata, SerializedPageMetadata } from '../../types';
import { parseIconMetadata } from '../parseIconMetadata';
import { DefaultPageMetadata } from '../../constants';

/**
 * Parses and deserializes a page's metadata from its content.
 *
 * @param pageContent - The page content.
 * @returns Page metadata.
 */
export function deserializePageMetadata(pageContent: string): PageMetadata {
  // If page does not start with ---, it has no metadata
  if (!pageContent.startsWith('---')) {
    return DefaultPageMetadata;
  }

  const yamlLines: string[] = [];
  const lines = pageContent.split('\n');
  let frontMatterDelimiters = 0;
  let index = 0;

  // Gather all lines in between two --- delimiter lines
  while (frontMatterDelimiters < 2 && index < lines.length) {
    const line = lines[index];

    if (line === '---') {
      frontMatterDelimiters += 1;
    }

    if (frontMatterDelimiters === 1) {
      yamlLines.push(line);
    }

    index += 1;
  }

  // Parse the YAML string into SerializedPageMetadata
  const serializedMetadata = (parse(yamlLines.join('\n')) ||
    {}) as SerializedPageMetadata;

  // Deserialize metadata
  return {
    ...serializedMetadata,
    icon: parseIconMetadata(serializedMetadata.icon),
  };
}

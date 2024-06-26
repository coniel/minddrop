import { parse } from 'yaml';
import { DocumentProperties } from '@minddrop/documents';
import { DefaultNoteProperties } from '../constants';

/**
 * Parses a note's properties from its file text content.
 * Adds default properties if not present.
 *
 * @param fileTextContent - The note file text content.
 * @returns Note properties.
 */
export function parseNoteProperties(
  fileTextContent: string,
): DocumentProperties {
  const yamlLines: string[] = [];
  const lines = fileTextContent.split('\n');
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

  // Parse the YAML string into DocumentProperties
  const properties = (parse(yamlLines.join('\n')) || {}) as DocumentProperties;

  return {
    ...DefaultNoteProperties,
    ...properties,
  };
}

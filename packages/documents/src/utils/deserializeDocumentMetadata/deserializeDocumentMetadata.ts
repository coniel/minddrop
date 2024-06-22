import { parse } from 'yaml';
import { DocumentProperties, SerializedDocumentMetadata } from '../../types';
import { DefaultDocumentMetadata } from '../../constants';

/**
 * Parses and deserializes a document's metadata from its content.
 *
 * @param documentContent - The document content.
 * @returns Document metadata.
 */
export function deserializeDocumentMetadata(
  documentContent: string,
): DocumentProperties {
  // If document does not start with ---, it has no metadata
  if (!documentContent.startsWith('---')) {
    return DefaultDocumentMetadata;
  }

  const yamlLines: string[] = [];
  const lines = documentContent.split('\n');
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

  // Parse the YAML string into SerializedDocumentMetadata
  const serializedMetadata = (parse(yamlLines.join('\n')) ||
    {}) as SerializedDocumentMetadata;

  // Deserialize metadata
  return {
    ...DefaultDocumentMetadata,
    ...serializedMetadata,
  };
}

import { DefaultDocumentIconString } from '../../constants';
import { DocumentProperties, SerializedDocumentMetadata } from '../../types';
import { stringify } from 'yaml';

/**
 * Serializes and stringifies document metadata into YAML front
 * matter. If no metadata beyond default values is present,
 * returns an empty string.
 *
 * @param metadata - The document metadata.
 * @returns Stringified serialized metadata.
 */
export function serializeDocumentMetadata(
  metadata: DocumentProperties,
): string {
  const serializedMetadata: SerializedDocumentMetadata = {};

  // Only include non-default icon in serialized metadata
  if (metadata.icon !== DefaultDocumentIconString) {
    serializedMetadata.icon = metadata.icon;
  }

  // If there is no metadata, don't generate serialized
  // version.
  if (!Object.keys(serializedMetadata).length) {
    return '';
  }

  return `---\n${stringify(serializedMetadata)}---\n\n`;
}

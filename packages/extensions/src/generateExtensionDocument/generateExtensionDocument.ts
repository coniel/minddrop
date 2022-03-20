import { generateId } from '@minddrop/utils';
import { ExtensionDocument } from '../types';

/**
 * Generates a ExtensionDocument for a given extension.
 * The generated extension document is enabled and has no topics.
 *
 * @param extensionId The ID of the extension.
 * @returns An extension document.
 */
export function generateExtensionDocument(
  extensionId: string,
): ExtensionDocument {
  return {
    id: generateId(),
    extension: extensionId,
    enabled: true,
    topics: [],
  };
}

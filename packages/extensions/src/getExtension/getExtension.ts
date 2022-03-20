import { Extension } from '../types';
import { getExtensionConfig } from '../getExtensionConfig';
import { getExtensionDocument } from '../getExtensionDocument';

/**
 * Returns an extension by ID. Throws an ExtensionNotRegisteredError
 * if the extension is not registered.
 *
 * @param extensionId The ID of the extension to retrieve.
 */
export function getExtension(extensionId: string): Extension {
  // Get the extension config
  const config = getExtensionConfig(extensionId);

  // Get the extension document
  const document = getExtensionDocument(extensionId);

  return {
    ...document,
    ...config,
    document: document.id,
  };
}

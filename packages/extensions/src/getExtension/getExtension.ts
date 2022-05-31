import { Extension } from '../types';
import { getExtensionConfig } from '../getExtensionConfig';
import { ExtensionsResource } from '../ExtensionsResource';

/**
 * Returns an extension by ID. Throws a `ExtensionNotRegisteredError`
 * if the extension is not registered.
 *
 * @param extensionId - The ID of the extension to retrieve.
 * @returns The requested extension.
 *
 * @throws ExtensionNotRegisteredError
 * Thrown if the extension is not registered.
 */
export function getExtension(extensionId: string): Extension {
  // Get the extension config
  const config = getExtensionConfig(extensionId);

  // Get the extension document
  const document = Object.values(ExtensionsResource.getAll()).find(
    (doc) => doc.extension === extensionId,
  );

  return {
    ...document,
    ...config,
    document: document.id,
  };
}

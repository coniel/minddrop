import { Extension } from '../types';
import { ExtensionNotRegisteredError } from '../errors';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Returns an extension by ID. Throws an ExtensionNotRegisteredError
 * if the extension is not registered.
 *
 * @param extensionId The ID of the extension to retrieve.
 */
export function getExtension(extensionId: string): Extension {
  const extension = useExtensionsStore.getState().extensions[extensionId];

  if (!extension) {
    throw new ExtensionNotRegisteredError(extensionId);
  }

  return extension;
}

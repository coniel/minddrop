import { normalizeFileExtension } from '@minddrop/utils';
import { FileExtensionToPropertyType } from '../../constants';
import { FileBasedPropertyType } from '../../types';

/**
 * Resolves the file based property type supporting a file extension.
 *
 * @param extension - The file extension, with or without a leading dot.
 * @returns The property type, `file` when no specific type supports the
 *   extension.
 */
export function resolveFilePropertyType(
  extension: string,
): FileBasedPropertyType {
  // Normalize the extension
  const normalizedExtension = normalizeFileExtension(extension);

  // Look up the extension's property type. Fall back to the catch-all type.
  return FileExtensionToPropertyType[normalizedExtension] ?? 'file';
}

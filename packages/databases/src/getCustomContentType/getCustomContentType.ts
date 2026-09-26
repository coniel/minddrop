import { CustomContentTypeNotFoundError } from '../errors';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { CustomContentType } from '../types';

/**
 * Retrieves a custom content type by ID.
 *
 * @param id - The ID of the custom content type.
 * @param throwOnNotFound - Whether to throw when the type does not exist.
 * @returns The custom content type, or null when it does not exist and `throwOnNotFound` is false.
 *
 * @throws {CustomContentTypeNotFoundError} If the type does not exist and `throwOnNotFound` is true.
 */
export function getCustomContentType(
  id: string,
  throwOnNotFound?: true,
): CustomContentType;
export function getCustomContentType(
  id: string,
  throwOnNotFound: false,
): CustomContentType | null;
export function getCustomContentType(
  id: string,
  throwOnNotFound = true,
): CustomContentType | null {
  // Find the type
  const customType = getDatabaseContentDefaults().customTypes.find(
    (type) => type.id === id,
  );

  // Throw if the type does not exist, unless specified not to
  if (!customType && throwOnNotFound) {
    throw new CustomContentTypeNotFoundError(id);
  }

  return customType ?? null;
}

import { SpacesStore } from '../SpacesStore';
import { SpaceNotFoundError } from '../errors';
import { Space } from '../types';

/**
 * Retrieves a space from the store by ID.
 *
 * @param id - The ID of the space.
 * @param throwOnNotFound - Whether to throw an error if the space is not found.
 * @returns The space object.
 *
 * @throws {SpaceNotFoundError} If the space does not exist.
 */
export function getSpace(id: string): Space;
export function getSpace(id: string, throwOnNotFound: false): Space | null;
export function getSpace(id: string, throwOnNotFound = true): Space | null {
  // Get the space from the store
  const space = SpacesStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!space && throwOnNotFound) {
    throw new SpaceNotFoundError(id);
  } else if (!space && !throwOnNotFound) {
    return null;
  }

  return space;
}

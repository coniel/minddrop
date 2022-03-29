import { ParentReference } from '../../types';

/**
 * Generates a parent reference given a parent type
 * and ID.
 *
 * @param type The parent type.
 * @param id The parent ID.
 * @returns A parent reference.
 */
export function generateParentReference(
  type: string,
  id: string,
): ParentReference {
  return { type, id };
}

import { ResourceReference } from '../types';

/**
 * Generates a resource reference given a resource type
 * and document ID.
 *
 * @param resource The resource type.
 * @param id The document ID.
 * @returns A resource reference.
 */
export function generateResourceReference(
  resource: string,
  id: string,
): ResourceReference {
  return { resource, id };
}

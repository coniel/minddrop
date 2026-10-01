import { shortId } from '../shortId';

/**
 * Generates a short ID which none of the existing IDs equals.
 *
 * @param existingIds - The IDs the generated one must differ from.
 * @param length - The number of characters. Defaults to 8.
 * @returns The generated ID.
 */
export function uniqueShortId(existingIds: string[], length = 8): string {
  // Generate a candidate ID
  let id = shortId(length);

  // Regenerate the ID until no existing ID equals it
  while (existingIds.includes(id)) {
    id = shortId(length);
  }

  return id;
}

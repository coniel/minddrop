/**
 * Generates the deterministic ID for a virtual collection
 * based on the entry ID and property name.
 *
 * @param entryId - The database entry ID.
 * @param propertyName - The collection property name.
 * @returns The virtual collection ID.
 */
export function virtualCollectionId(
  entryId: string,
  propertyName: string,
): string {
  return `${entryId}:${propertyName}`;
}

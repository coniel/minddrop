/**
 * Generates the display name for a virtual collection based
 * on the database name, entry title, and property name.
 *
 * @param databaseName - The database name.
 * @param entryTitle - The entry title.
 * @param propertyName - The collection property name.
 * @returns The virtual collection name.
 */
export function virtualCollectionName(
  databaseName: string,
  entryTitle: string,
  propertyName: string,
): string {
  return `${databaseName} - ${entryTitle} - ${propertyName}`;
}

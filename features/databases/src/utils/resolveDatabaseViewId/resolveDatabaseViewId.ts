/**
 * Resolves the view instance id of a database's view, used to match
 * the view in tabs.
 *
 * @param databaseId - The id of the database.
 * @returns The database view's instance id.
 */
export function resolveDatabaseViewId(databaseId: string): string {
  return `databases:database:${databaseId}`;
}

/**
 * Resolves the view instance id of a database entry's view, used to
 * match the view in tabs.
 *
 * @param entryId - The id of the entry.
 * @returns The entry view's instance id.
 */
export function resolveDatabaseEntryViewId(entryId: string): string {
  return `databases:entry:${entryId}`;
}

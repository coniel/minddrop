/**
 * Generates the deterministic ID for a virtual view based on
 * the entry ID, layout ID, and property name. Layout-specific
 * because different designs can render the same collection
 * property with a different view type. The property name comes
 * last because the entry and layout IDs cannot contain colons,
 * keeping the ID unambiguous for any property name.
 *
 * @param entryId - The database entry ID.
 * @param layoutId - The layout ID.
 * @param propertyName - The collection property name.
 * @returns The virtual view ID.
 */
export function virtualViewId(
  entryId: string,
  layoutId: string,
  propertyName: string,
): string {
  return `${entryId}:${layoutId}:${propertyName}`;
}

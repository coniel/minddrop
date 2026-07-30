/**
 * Generates the deterministic ID for a virtual view based on
 * the entry ID, property name, and layout ID. Layout-specific
 * because different designs can render the same collection
 * property with a different view type.
 *
 * @param entryId - The database entry ID.
 * @param propertyName - The collection property name.
 * @param layoutId - The layout ID.
 * @returns The virtual view ID.
 */
export function virtualViewId(
  entryId: string,
  propertyName: string,
  layoutId: string,
): string {
  return `${entryId}:${propertyName}:${layoutId}`;
}

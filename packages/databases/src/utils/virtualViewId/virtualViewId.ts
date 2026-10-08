/**
 * Generates the deterministic ID of the virtual view a design
 * element embeds for a virtual collection.
 *
 * @param collectionId - The virtual collection ID.
 * @param elementId - The ID of the design element embedding the view.
 * @param viewType - The view's type.
 * @returns The virtual view ID.
 */
export function virtualViewId(
  collectionId: string,
  elementId: string,
  viewType: string,
): string {
  return `${collectionId}:${elementId}:${viewType}`;
}

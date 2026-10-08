/**
 * Generates the key an embedded view's config is saved under in its
 * entry's metadata.
 *
 * @param elementId - The ID of the design element embedding the view.
 * @param viewType - The view's type.
 * @returns The config key.
 */
export function embeddedViewConfigKey(
  elementId: string,
  viewType: string,
): string {
  return `${elementId}:${viewType}`;
}

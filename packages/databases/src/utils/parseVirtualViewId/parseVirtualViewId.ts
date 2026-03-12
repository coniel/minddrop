/**
 * Parsed components of a virtual view ID.
 */
export interface ParsedVirtualViewId {
  /**
   * The database entry ID (workspace-relative path).
   */
  entryId: string;

  /**
   * The collection property name.
   */
  propertyName: string;

  /**
   * The design ID.
   */
  designId: string;
}

/**
 * Parses a virtual view ID into its components.
 *
 * Virtual view IDs have the format `entryId:propertyName:designId`,
 * where entryId may itself contain colons (e.g. path separators
 * are not colons, but entry IDs like `Books/Some Book.md` are safe).
 *
 * Since the property name and design ID are the last two colon-separated
 * segments, we split from the right.
 *
 * @param viewId - The virtual view ID.
 * @returns The parsed components, or null if the ID is invalid.
 */
export function parseVirtualViewId(viewId: string): ParsedVirtualViewId | null {
  // Split from the right to extract designId and propertyName
  const lastColon = viewId.lastIndexOf(':');

  if (lastColon === -1) {
    return null;
  }

  const designId = viewId.slice(lastColon + 1);
  const rest = viewId.slice(0, lastColon);
  const secondLastColon = rest.lastIndexOf(':');

  if (secondLastColon === -1) {
    return null;
  }

  const propertyName = rest.slice(secondLastColon + 1);
  const entryId = rest.slice(0, secondLastColon);

  if (!entryId || !propertyName || !designId) {
    return null;
  }

  return { entryId, propertyName, designId };
}

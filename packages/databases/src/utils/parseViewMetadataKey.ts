/**
 * Parses a view metadata key into its property name and layout ID
 * components. Returns null if the key is not in the expected
 * propertyName:layoutId format.
 *
 * @param key - The metadata key to parse.
 * @returns The parsed property name and layout ID, or null.
 */
export function parseViewMetadataKey(
  key: string,
): { propertyName: string; layoutId: string } | null {
  const colonIndex = key.indexOf(':');

  if (colonIndex === -1) {
    return null;
  }

  const propertyName = key.slice(0, colonIndex);
  const layoutId = key.slice(colonIndex + 1);

  if (!propertyName || !layoutId) {
    return null;
  }

  return { propertyName, layoutId };
}

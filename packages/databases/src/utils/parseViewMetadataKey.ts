/**
 * Parses a view metadata key into its property name and design ID
 * components. Returns null if the key is not in the expected
 * propertyName:designId format.
 *
 * @param key - The metadata key to parse.
 * @returns The parsed property name and design ID, or null.
 */
export function parseViewMetadataKey(
  key: string,
): { propertyName: string; designId: string } | null {
  const colonIndex = key.indexOf(':');

  if (colonIndex === -1) {
    return null;
  }

  const propertyName = key.slice(0, colonIndex);
  const designId = key.slice(colonIndex + 1);

  if (!propertyName || !designId) {
    return null;
  }

  return { propertyName, designId };
}

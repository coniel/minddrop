/**
 * Generates the metadata key used to store a virtual view's
 * config in an entry's metadata. Uses propertyName:layoutId
 * format, consistent with the virtual view ID structure.
 *
 * @param propertyName - The collection property name.
 * @param layoutId - The layout ID.
 * @returns The metadata key.
 */
export function viewMetadataKey(
  propertyName: string,
  layoutId: string,
): string {
  return `${propertyName}:${layoutId}`;
}

/**
 * Generates the metadata key used to store a virtual view's
 * config in an entry's metadata. Uses propertyName:designId
 * format, consistent with the virtual view ID structure.
 *
 * @param propertyName - The collection property name.
 * @param designId - The design ID.
 * @returns The metadata key.
 */
export function viewMetadataKey(
  propertyName: string,
  designId: string,
): string {
  return `${propertyName}:${designId}`;
}

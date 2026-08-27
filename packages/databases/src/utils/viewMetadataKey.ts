/**
 * Generates the metadata key used to store a virtual view's
 * config in an entry's metadata. The layout ID comes first
 * because it cannot contain a colon, keeping the key
 * unambiguous for any property name.
 *
 * @param layoutId - The layout ID.
 * @param propertyName - The collection property name.
 * @returns The metadata key.
 */
export function viewMetadataKey(
  layoutId: string,
  propertyName: string,
): string {
  return `${layoutId}:${propertyName}`;
}

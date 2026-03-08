/**
 * Parses a virtual collection ID into its entry ID and property
 * name components.
 *
 * @param collectionId - The virtual collection ID.
 * @returns An object containing the entry ID and property name.
 */
export function parseVirtualCollectionId(collectionId: string): {
  entryId: string;
  propertyName: string;
} {
  const separatorIndex = collectionId.lastIndexOf(':');

  return {
    entryId: collectionId.substring(0, separatorIndex),
    propertyName: collectionId.substring(separatorIndex + 1),
  };
}

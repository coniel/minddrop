import { DatabaseEntryMetadata } from '../../types';

/**
 * Returns an entry's metadata without the metadata of the given
 * properties. The properties map is dropped when it is left empty.
 *
 * @param metadata - The entry's metadata.
 * @param propertyNames - The names of the properties to drop the metadata of.
 * @returns The metadata without the properties' metadata.
 */
export function omitEntryPropertyMetadata(
  metadata: DatabaseEntryMetadata,
  propertyNames: string[],
): DatabaseEntryMetadata {
  // Split the property metadata off the rest of the metadata
  const { properties, ...rest } = metadata;

  // Check if any of the properties has metadata. If not, there is
  // nothing to drop.
  if (!properties || !propertyNames.some((name) => name in properties)) {
    return metadata;
  }

  // Filter out the properties' metadata
  const remaining = Object.fromEntries(
    Object.entries(properties).filter(
      ([name]) => !propertyNames.includes(name),
    ),
  );

  // Drop the map when no property metadata remains
  if (Object.keys(remaining).length === 0) {
    return rest;
  }

  // Put the remaining property metadata back
  return { ...rest, properties: remaining };
}

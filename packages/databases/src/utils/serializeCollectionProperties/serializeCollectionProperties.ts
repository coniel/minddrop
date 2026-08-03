import { PropertyMap } from '@minddrop/properties';
import { Database } from '../../types';
import { entryIdsToAddresses } from '../entryIdsToAddresses';

/**
 * Converts collection property values from entry IDs to durable
 * workspace-relative addresses for disk serialization. IDs that
 * do not resolve are dropped. Non-collection properties pass
 * through untouched.
 *
 * @param properties - The entry properties to convert.
 * @param database - The entry's database.
 * @returns A new properties object with converted collection values.
 */
export function serializeCollectionProperties(
  properties: PropertyMap,
  database: Database,
): PropertyMap {
  const converted: PropertyMap = { ...properties };

  // Convert values of schema-typed collection properties
  database.properties.forEach((property) => {
    if (property.type !== 'collection') {
      return;
    }

    const value = properties[property.name];

    // Skip missing or non-array values
    if (!Array.isArray(value)) {
      return;
    }

    converted[property.name] = entryIdsToAddresses(value);
  });

  return converted;
}

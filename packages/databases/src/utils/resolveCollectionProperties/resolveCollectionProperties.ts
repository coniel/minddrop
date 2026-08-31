import { PropertyMap } from '@minddrop/properties';
import { Database } from '../../types';

/**
 * Resolves collection property values from durable entry addresses back
 * to entry IDs using the given address index. Addresses that do not
 * resolve are dropped. Non-collection properties pass through untouched.
 *
 * @param properties - The entry properties to resolve.
 * @param database - The entry's database.
 * @param entryIdByAddress - Map of lowercased entry address to entry ID.
 * @returns A new properties object with resolved collection values.
 */
export function resolveCollectionProperties(
  properties: PropertyMap,
  database: Database,
  entryIdByAddress: Map<string, string>,
): PropertyMap {
  const resolved: PropertyMap = { ...properties };

  // Resolve values of schema-typed collection properties
  database.properties.forEach((property) => {
    if (property.type !== 'collection') {
      return;
    }

    const value = properties[property.name];

    // Skip missing or non-array values
    if (!Array.isArray(value)) {
      return;
    }

    // Resolve each address, dropping unresolvable ones
    resolved[property.name] = value.flatMap((address) => {
      const entryId = entryIdByAddress.get(address.toLowerCase());

      return entryId ? [entryId] : [];
    });
  });

  return resolved;
}

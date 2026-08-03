import { PropertyMap } from '@minddrop/properties';
import { Database } from '../../types';
import { databaseEntryPathFromAddress } from '../databaseEntryPathFromAddress';

/**
 * Resolves collection property values from durable workspace-relative
 * addresses back to entry IDs using the given path index. Addresses
 * that do not resolve are dropped. Non-collection properties pass
 * through untouched.
 *
 * @param properties - The entry properties to resolve.
 * @param database - The entry's database.
 * @param entryIdByPath - Map of absolute entry path to entry ID.
 * @returns A new properties object with resolved collection values.
 */
export function resolveCollectionProperties(
  properties: PropertyMap,
  database: Database,
  entryIdByPath: Map<string, string>,
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
      const entryId = entryIdByPath.get(databaseEntryPathFromAddress(address));

      return entryId ? [entryId] : [];
    });
  });

  return resolved;
}

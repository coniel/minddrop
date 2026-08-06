import { PropertyMap } from '@minddrop/properties';

/**
 * Removes empty values from a property map. A value is considered
 * empty if it is `undefined`, `null`, an empty string, or an empty
 * array. `false` and `0` are real values and are kept.
 *
 * @param properties - The property map to prune.
 *
 * @returns A new property map without the empty values.
 */
export function pruneEmptyPropertyValues(properties: PropertyMap): PropertyMap {
  return Object.fromEntries(
    // Keep only entries with a non-empty value
    Object.entries(properties).filter(([, value]) => {
      // Drop unset values
      if (value === undefined || value === null) {
        return false;
      }

      // Drop empty strings
      if (value === '') {
        return false;
      }

      // Drop empty arrays
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      return true;
    }),
  );
}

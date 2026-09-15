import { DatabaseEntry } from '@minddrop/databases';
import { SelectPropertySchema } from '@minddrop/properties';
import { NO_VALUE_COLUMN } from '../../constants';

/**
 * Resolves the column an entry belongs to from its value for the
 * group property. Multi-select values are grouped by their first
 * value matching a declared option, and values which match no
 * declared option belong to the no-value column.
 *
 * @param entry - The entry to resolve the column of.
 * @param property - The select property the columns are generated from.
 * @param valueAliases - Old option values mapped to their new values. Used to match entries which an in-flight rename has not rewritten yet.
 * @returns The option value keying the entry's column, empty for the no-value column.
 */
export function resolveEntryColumnValue(
  entry: DatabaseEntry,
  property: SelectPropertySchema,
  valueAliases: Record<string, string> = {},
): string {
  // The entry's value for the group property
  const value = entry.properties[property.name];

  // The option values the property declares
  const optionValues = new Set(property.options.map((option) => option.value));

  // Match a value to the option it names. While a rename is in
  // flight, an entry may still hold the old value, so map it to its
  // new name before matching.
  const resolveValue = (item: unknown): string | null => {
    // Check that the value is a select value
    if (typeof item !== 'string') {
      return null;
    }

    // Map the value to its new name when a rename is in flight
    const aliased = valueAliases[item] ?? item;

    // Match the value to a declared option
    return optionValues.has(aliased) ? aliased : null;
  };

  // Check if the entry holds a list of values. If so, the first
  // value naming a declared option decides its column.
  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = resolveValue(item);

      if (resolved !== null) {
        return resolved;
      }
    }

    return NO_VALUE_COLUMN;
  }

  // Fall back to the no-value column for values which name no
  // declared option.
  return resolveValue(value) ?? NO_VALUE_COLUMN;
}

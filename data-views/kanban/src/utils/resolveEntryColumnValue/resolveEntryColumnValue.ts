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
 * @returns The option value keying the entry's column, empty for the no-value column.
 */
export function resolveEntryColumnValue(
  entry: DatabaseEntry,
  property: SelectPropertySchema,
): string {
  // The entry's value for the group property
  const value = entry.properties[property.name];

  // The option values the property declares
  const optionValues = new Set(property.options.map((option) => option.value));

  // Check if the entry holds a list of values. If so, the first
  // declared option among them decides its column.
  if (Array.isArray(value)) {
    return value.find((item) => optionValues.has(item)) ?? NO_VALUE_COLUMN;
  }

  // Check if the single value is a declared option. If so, it
  // keys the entry's column.
  if (typeof value === 'string' && optionValues.has(value)) {
    return value;
  }

  // Fall back to the no-value column
  return NO_VALUE_COLUMN;
}

import { PropertyValue, SelectPropertySchema } from '@minddrop/properties';
import { NO_VALUE_COLUMN } from '../../constants';

/**
 * Resolves the property value an entry takes when moved into a
 * column. Multi-select entries keep the values which do not
 * decide their column, so the move swaps out only the value the
 * board groups them by.
 *
 * @param currentValue - The entry's current value for the group property.
 * @param property - The select property the columns are generated from.
 * @param columnValue - The option value keying the target column.
 * @returns The entry's new value for the group property.
 */
export function applyColumnValue(
  currentValue: PropertyValue,
  property: SelectPropertySchema,
  columnValue: string,
): PropertyValue {
  // Check if the property takes a single value. If so, the
  // column's value replaces whatever the entry holds.
  if (!property.multiselect) {
    return columnValue === NO_VALUE_COLUMN ? null : columnValue;
  }

  // The option values the property declares
  const optionValues = new Set(property.options.map((option) => option.value));

  // The entry's current values, empty when it has none
  const values = Array.isArray(currentValue) ? currentValue : [];

  // The position of the value deciding the entry's current
  // column, which the move replaces.
  const groupedIndex = values.findIndex((value) => optionValues.has(value));

  // Check if the entry is moving to the no-value column. If so,
  // only the value it is grouped by is cleared.
  if (columnValue === NO_VALUE_COLUMN) {
    return values.filter((_, index) => index !== groupedIndex);
  }

  // Filter out the column's value where the entry already holds
  // it elsewhere, so that it does not end up in two places.
  const withoutTarget = values.filter(
    (value, index) => value !== columnValue || index === groupedIndex,
  );

  // The position the column's value is written to
  const targetIndex = withoutTarget.findIndex((value) =>
    optionValues.has(value),
  );

  // Check if the entry holds a declared option. If not, the
  // column's value is added on top of what it already holds.
  if (targetIndex === -1) {
    return [...withoutTarget, columnValue];
  }

  // Swap out the value the entry was grouped by
  return withoutTarget.map((value, index) =>
    index === targetIndex ? columnValue : value,
  );
}

import { PropertyFilterDateValue, PropertyFilterValue } from '../types';

/**
 * Checks whether a filter value is a date value object.
 *
 * @param value - The filter value to check.
 *
 * @returns Whether the value is a date value.
 */
export function isPropertyFilterDateValue(
  value: PropertyFilterValue | undefined,
): value is PropertyFilterDateValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

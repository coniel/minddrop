import { isSameValue } from '@minddrop/utils';
import { PropertyValue } from '../types';

/**
 * Checks whether two property values are equal.
 *
 * @param value - The first value.
 * @param other - The second value.
 * @returns Whether the values are equal.
 */
export function isEqualPropertyValue(
  value: PropertyValue | undefined,
  other: PropertyValue | undefined,
): boolean {
  return isSameValue(value, other);
}

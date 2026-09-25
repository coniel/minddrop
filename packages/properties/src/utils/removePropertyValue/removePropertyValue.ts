import { PropertyValue } from '../../types';

/**
 * Removes a member from a list property value. Any other value is
 * returned as is.
 *
 * @param value - The property value.
 * @param member - The member to remove.
 * @returns The value without the member.
 */
export function removePropertyValue(
  value: PropertyValue,
  member: string,
): PropertyValue {
  // Leave a non-list value as it is
  if (!Array.isArray(value)) {
    return value;
  }

  // Drop the member from the list
  return value.filter((candidate) => candidate !== member);
}

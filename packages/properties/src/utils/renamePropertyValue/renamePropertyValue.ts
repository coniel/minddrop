import { PropertyValue } from '../../types';

/**
 * Renames a member of a property value. A list value has the member
 * renamed in place. A duplicate of the new name is collapsed into
 * one. Any other value is returned as is.
 *
 * @param value - The property value.
 * @param oldName - The member to rename.
 * @param newName - The new name.
 * @returns The value with the member renamed.
 */
export function renamePropertyValue(
  value: PropertyValue,
  oldName: string,
  newName: string,
): PropertyValue {
  // Rename a single value which is the member
  if (value === oldName) {
    return newName;
  }

  // Leave every other non-list value as it is
  if (!Array.isArray(value)) {
    return value;
  }

  // Leave a list which does not contain the member as it is
  if (!value.includes(oldName)) {
    return value;
  }

  // Rename the member in the list. The new name may already be
  // present, so duplicates are dropped.
  return [
    ...new Set(value.map((member) => (member === oldName ? newName : member))),
  ];
}

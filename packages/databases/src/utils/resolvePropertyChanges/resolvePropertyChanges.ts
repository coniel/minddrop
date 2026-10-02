import { PropertyChange } from '@minddrop/history';
import {
  Properties,
  PropertiesSchema,
  PropertyMap,
} from '@minddrop/properties';

/**
 * Works out which of an entry's properties changed, in the form its
 * history records them. Timestamp properties are left out.
 *
 * @param schema - The database's properties schema.
 * @param original - The entry's property values before the change.
 * @param updated - The entry's property values after the change.
 * @returns The properties whose values differ.
 */
export function resolvePropertyChanges(
  schema: PropertiesSchema,
  original: PropertyMap,
  updated: PropertyMap,
): PropertyChange[] {
  // Get the names of the properties whose values differ
  const changedPropertyNames = Properties.resolveChangedNames(
    schema,
    original,
    updated,
  );

  // Pair each changed property with its value either side of the change
  return changedPropertyNames.map((name) => ({
    property: name,
    from: original[name] ?? null,
    to: updated[name] ?? null,
  }));
}

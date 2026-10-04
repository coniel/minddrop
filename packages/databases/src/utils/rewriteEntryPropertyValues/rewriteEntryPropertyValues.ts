import { PropertyChange } from '@minddrop/history';
import { Properties, PropertyValue } from '@minddrop/properties';
import { Entry } from '../../types';

export interface RewrittenEntryPropertyValues {
  /**
   * The entry with the values rewritten.
   */
  entry: Entry;

  /**
   * The properties whose values the rewrite changed.
   */
  changes: PropertyChange[];
}

/**
 * Rewrites the values an entry has for the named properties.
 *
 * @param entry - The entry to rewrite.
 * @param propertyNames - The names of the properties to rewrite.
 * @param rewrite - Returns a property value's replacement.
 * @returns The rewritten entry and the changes made, or null when no value changed.
 */
export function rewriteEntryPropertyValues(
  entry: Entry,
  propertyNames: string[],
  rewrite: (value: PropertyValue) => PropertyValue,
): RewrittenEntryPropertyValues | null {
  // The properties whose values changed
  const changes: PropertyChange[] = [];
  // Copy the entry's values to rewrite
  const properties = { ...entry.properties };

  // Rewrite each named property's value
  for (const propertyName of propertyNames) {
    // Skip properties the entry has no value for
    if (!(propertyName in properties)) {
      continue;
    }

    // Rewrite the value
    const value = properties[propertyName];
    const rewritten = rewrite(value);

    // Skip values the rewrite left as they were
    if (Properties.isEqualValue(value, rewritten)) {
      continue;
    }

    // Replace the value and note the change
    properties[propertyName] = rewritten;
    changes.push({ property: propertyName, from: value, to: rewritten });
  }

  // Check whether any value changed
  if (!changes.length) {
    return null;
  }

  // Return the rewritten entry and the changes
  return { entry: { ...entry, properties }, changes };
}

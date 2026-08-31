import { PropertyValue } from '@minddrop/properties';
import { DatabaseEntry } from '../../types';

export interface EntrySortOptions {
  /**
   * Whether the entries are sorted by one of their properties or
   * by their metadata. Defaults to 'metadata'.
   */
  by?: 'property' | 'metadata';

  /**
   * The name of the sorted property, or the sorted metadata type
   * when sorting by metadata. Defaults to 'created'.
   */
  property?: string;

  /**
   * The direction to sort the entries in. Defaults to
   * 'descending', listing the newest entries first when sorting
   * on the created date.
   */
  direction?: 'ascending' | 'descending';
}

/**
 * Orders entries by the value of the sorted property, defaulting
 * to their created date, newest first. Entries missing a value
 * sort last regardless of direction, and ties break on the entry
 * title.
 *
 * @param entries - The entries to sort.
 * @param sort - The sort options.
 * @returns The sorted entries.
 */
export function sortDatabaseEntries(
  entries: DatabaseEntry[],
  sort: EntrySortOptions = {},
): DatabaseEntry[] {
  // Descending sorts invert the comparison
  const modifier = sort.direction === 'ascending' ? 1 : -1;

  // Resolve the sorted value of each entry up front, so that the
  // comparator does not repeat the lookup on every comparison
  const values = new Map<string, PropertyValue>(
    entries.map((entry) => [entry.id, resolveSortValue(entry, sort)]),
  );

  return [...entries].sort((entryA, entryB) => {
    const valueA = values.get(entryA.id) ?? null;
    const valueB = values.get(entryB.id) ?? null;
    const missingA = isMissingValue(valueA);
    const missingB = isMissingValue(valueB);

    // Entries missing a value sort last in either direction
    if (missingA !== missingB) {
      return missingA ? 1 : -1;
    }

    const result = comparePropertyValues(valueA, valueB) * modifier;

    // Break ties on the title so that the order is stable
    if (result !== 0) {
      return result;
    }

    return compareText(entryA.title, entryB.title);
  });
}

/**
 * Returns the value an entry is sorted on.
 */
function resolveSortValue(
  entry: DatabaseEntry,
  sort: EntrySortOptions,
): PropertyValue {
  // Property sorts read the entry's own properties by name
  if (sort.by === 'property') {
    return sort.property ? (entry.properties[sort.property] ?? null) : null;
  }

  return resolveMetadataValue(entry, sort.property);
}

/**
 * Returns the entry metadata value of the given metadata property
 * type, defaulting to the entry's created date.
 */
function resolveMetadataValue(
  entry: DatabaseEntry,
  type: string | undefined,
): PropertyValue {
  // The entry title, which is derived from its file name
  if (type === 'title') {
    return entry.title;
  }

  // The last time the entry was modified in the app
  if (type === 'last-modified') {
    return entry.lastModified;
  }

  return entry.created;
}

/**
 * Compares two property values by their runtime type, falling
 * back to a case insensitive text comparison.
 */
function comparePropertyValues(a: PropertyValue, b: PropertyValue): number {
  // Dates compare by timestamp
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Numbers compare numerically
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Toggles sort unchecked before checked
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  return compareText(String(a), String(b));
}

/**
 * Compares two strings case insensitively.
 */
function compareText(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

/**
 * Checks whether a property value counts as missing, and
 * therefore sorts last.
 */
function isMissingValue(value: PropertyValue): boolean {
  // Unset values are missing
  if (value === null || value === undefined) {
    return true;
  }

  // Empty text is missing
  if (value === '') {
    return true;
  }

  // Empty multi-value properties are missing
  return Array.isArray(value) && value.length === 0;
}

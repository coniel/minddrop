import { DatabaseEntry, DatabaseEntryCoreProperties } from '../types';

/**
 * Returns the core properties of an entry.
 *
 * @param entry - The entry.
 *
 * @returns The entry's core properties.
 */
export function entryCoreProperties(
  entry: DatabaseEntry,
): DatabaseEntryCoreProperties {
  return {
    id: entry.id,
    title: entry.title,
    created: entry.created,
    lastModified: entry.lastModified,
  };
}

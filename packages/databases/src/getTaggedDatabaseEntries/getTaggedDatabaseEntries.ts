import { Properties } from '@minddrop/properties';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { getAllDatabases } from '../getAllDatabases';
import { DatabaseEntry } from '../types';

/**
 * Retrieves the database entries referencing a tag name in one of
 * their database's tags properties.
 *
 * @param tagName - The name of the tag.
 * @returns The entries referencing the tag.
 */
export function getTaggedDatabaseEntries(tagName: string): DatabaseEntry[] {
  return getAllDatabases().flatMap((database) => {
    // Resolve the names of the database's tags properties
    const tagsPropertyNames = Properties.resolveNamesOfType(
      database.properties,
      'tags',
    );

    // Skip databases without tags properties
    if (tagsPropertyNames.length === 0) {
      return [];
    }

    // The database's entries referencing the tag
    return getAllDatabaseEntries(database.id).filter((entry) =>
      tagsPropertyNames.some((propertyName) => {
        const value = entry.properties[propertyName];

        return Array.isArray(value) && value.includes(tagName);
      }),
    );
  });
}

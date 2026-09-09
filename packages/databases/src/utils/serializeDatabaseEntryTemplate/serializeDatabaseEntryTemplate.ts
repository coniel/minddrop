import {
  DatabaseEntryTemplate,
  StoredDatabaseEntryTemplate,
} from '../../types';

/**
 * Serializes an entry template into its stored form, stripping the
 * field derived from its database.
 *
 * @param template - The entry template to serialize.
 * @returns The stored form of the entry template.
 */
export function serializeDatabaseEntryTemplate(
  template: DatabaseEntryTemplate,
): StoredDatabaseEntryTemplate {
  // The template file sits inside its database, so the database ID is
  // not persisted.
  const { database: _database, ...stored } = template;

  return stored;
}

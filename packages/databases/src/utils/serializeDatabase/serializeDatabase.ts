import { Database, StoredDatabase } from '../../types';

/**
 * Serializes a database into its stored form, stripping the fields
 * derived from the directory it sits in.
 *
 * @param database - The database to serialize.
 * @returns The stored form of the database.
 */
export function serializeDatabase(database: Database): StoredDatabase {
  // The name is the database directory's name and the path is where
  // the config file was found, so neither is persisted.
  const { path: _path, name: _name, ...stored } = database;

  return stored;
}

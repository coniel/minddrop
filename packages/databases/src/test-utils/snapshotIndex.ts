import { sqlGetAllDatabases } from '../sql/sqlGetAllDatabases';
import { sqlGetEntriesFull } from '../sql/sqlGetEntriesFull';

/**
 * Returns the IDs of the indexed databases and entries, keyed by
 * where they live: a database by its path, an entry by its database's
 * path and its own.
 *
 * @returns The indexed IDs, keyed by location.
 */
export function snapshotIndex(): Record<string, string> {
  // Get the indexed databases
  const databases = sqlGetAllDatabases();

  // Look up each database's path by ID
  const databasePaths = new Map(
    databases.map((database) => [database.id, database.path]),
  );

  // Key the indexed IDs by location
  return Object.fromEntries([
    // The databases, keyed by path
    ...databases.map((database) => [database.path, database.id]),
    // The entries, keyed by their database's path and their own
    ...sqlGetEntriesFull().map((record) => [
      `${databasePaths.get(record.databaseId)}/${record.path}`,
      record.id,
    ]),
  ]);
}

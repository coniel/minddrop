import type { Database } from '@minddrop/databases';
import {
  DatabaseEntries,
  DatabaseEntrySerializers,
  Databases,
} from '@minddrop/databases';
import { Sql } from '@minddrop/sql';
import { initializeSearchIndex, rebuildSearchIndex } from './searchIndex';

/**
 * Back-end only. Initializes the search system for a
 * workspace. Reads entries from disk using the FS adapter
 * and populates SQL and MiniSearch.
 *
 * @param workspaceId - The workspace to initialize search for.
 * @param databases - The databases to index.
 */
export async function initializeSearchData(
  workspaceId: string,
  databases: Database[],
): Promise<void> {
  console.log(
    `[search] Initializing search for workspace ${workspaceId} with ${databases.length} databases`,
  );

  // Ensure core entry serializers are available for reading
  // entry files from disk
  DatabaseEntrySerializers.loadCoreSerializers();

  // Open or create the SQL database.
  // If the schema version changed, the database was recreated
  // and all data needs to be re-indexed.
  const dbPath = `${Sql.getConfigPath()}/${workspaceId}/data.db`;
  const { schemaChanged } = await Sql.open(dbPath, {
    schema: Databases.sql.SCHEMA_SQL,
    version: Databases.sql.SCHEMA_VERSION,
  });

  // Populate SQL with database and entry data
  for (const database of databases) {
    // Upsert the database record
    Databases.sql.upsertDatabase({
      id: database.id,
      name: database.name,
      path: database.path,
      icon: database.icon,
    });

    // Read entries from disk
    const rawEntries = await DatabaseEntries.readFiles(database);

    // Convert to SQL entry record format
    const entries = rawEntries.map((entry) =>
      Databases.convertEntryToSqlRecord(entry, database),
    );

    if (schemaChanged) {
      // Schema changed, index everything
      if (entries.length > 0) {
        Databases.sql.upsertEntries(entries);
      }

      console.log(
        `[search] Database "${database.name}": ${entries.length} entries indexed (full rebuild)`,
      );
    } else {
      // Incremental update, skip unchanged entries
      const existingTimestamps = Databases.sql.getEntryTimestamps(database.id);

      // Find entries that are new or have been modified
      const changedEntries = entries.filter((entry) => {
        const existingTimestamp = existingTimestamps.get(entry.id);

        return (
          existingTimestamp === undefined ||
          existingTimestamp !== entry.lastModified
        );
      });

      // Find entries that have been deleted
      const freshIds = new Set(entries.map((entry) => entry.id));
      const deletedIds = [...existingTimestamps.keys()].filter(
        (id) => !freshIds.has(id),
      );

      // Upsert changed entries
      if (changedEntries.length > 0) {
        Databases.sql.upsertEntries(changedEntries);
      }

      // Remove deleted entries
      if (deletedIds.length > 0) {
        Databases.sql.deleteEntries(deletedIds);
      }

      console.log(
        `[search] Database "${database.name}": ${changedEntries.length} updated, ${deletedIds.length} deleted, ${entries.length - changedEntries.length} unchanged`,
      );
    }
  }

  // Initialize MiniSearch. Force a rebuild if the schema changed,
  // otherwise load from disk if the persisted index is still valid.
  if (schemaChanged) {
    await rebuildSearchIndex(workspaceId);
  } else {
    await initializeSearchIndex(workspaceId);
  }

  console.log(
    `[search] Search initialization complete for workspace ${workspaceId}`,
  );
}

import { Sql } from '@minddrop/sql';
import { loadCoreSerializers } from '../../DatabaseEntrySerializers';
import { readDatabaseEntryFiles } from '../../readDatabaseEntryFiles';
import type { Database } from '../../types';
import { convertEntryToSqlRecord } from '../../utils';
import { SCHEMA_SQL, SCHEMA_VERSION } from '../schema';
import { sqlDeleteEntries } from '../sqlDeleteEntries';
import { sqlGetEntryTimestamps } from '../sqlGetEntryTimestamps';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';

export interface SqlInitializeResult {
  /**
   * Whether the SQL schema changed, requiring a full
   * search index rebuild.
   */
  schemaChanged: boolean;

  /**
   * Entries that were added or modified since the last
   * run. Empty when schemaChanged is true (full rebuild
   * covers everything).
   */
  changedEntries: { id: string; title: string; databaseId: string }[];

  /**
   * IDs of entries that were deleted since the last run.
   * Empty when schemaChanged is true.
   */
  deletedEntryIds: string[];
}

/**
 * Initializes the SQL database for a workspace. Opens the
 * database, populates it with database and entry data, and
 * returns the schema change flag plus any incrementally
 * changed or deleted entries (for search sync).
 */
export async function sqlInitialize(
  workspaceId: string,
  databases: Database[],
): Promise<SqlInitializeResult> {
  // Ensure core entry serializers are available for reading
  // entry files from disk
  loadCoreSerializers();

  // Open or create the SQL database.
  // If the schema version changed, the database was recreated
  // and all data needs to be re-indexed.
  const dbPath = `${Sql.getConfigPath()}/${workspaceId}/data.db`;
  const { schemaChanged } = await Sql.open(dbPath, {
    schema: SCHEMA_SQL,
    version: SCHEMA_VERSION,
  });

  // Collect incrementally changed/deleted entries across
  // all databases so the caller can sync search
  const allChangedEntries: SqlInitializeResult['changedEntries'] = [];
  const allDeletedEntryIds: string[] = [];

  // Populate SQL with database and entry data
  for (const database of databases) {
    // Upsert the database record (silent during init)
    sqlUpsertDatabase(
      {
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
      },
      { silent: true },
    );

    // Read entries from disk
    const rawEntries = await readDatabaseEntryFiles(database);

    // Convert to SQL entry record format
    const entries = rawEntries.map((entry) =>
      convertEntryToSqlRecord(entry, database),
    );

    if (schemaChanged) {
      // Schema changed, index everything
      if (entries.length > 0) {
        sqlUpsertEntries(database.id, entries, { silent: true });
      }
    } else {
      // Incremental update, skip unchanged entries
      const existingTimestamps = sqlGetEntryTimestamps(database.id);

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
        sqlUpsertEntries(database.id, changedEntries, { silent: true });
      }

      // Remove deleted entries
      if (deletedIds.length > 0) {
        sqlDeleteEntries(database.id, deletedIds, { silent: true });
      }

      // Collect for search sync
      for (const entry of changedEntries) {
        allChangedEntries.push({
          id: entry.id,
          title: entry.title,
          databaseId: entry.databaseId,
        });
      }

      allDeletedEntryIds.push(...deletedIds);
    }
  }

  return {
    schemaChanged,
    changedEntries: allChangedEntries,
    deletedEntryIds: allDeletedEntryIds,
  };
}

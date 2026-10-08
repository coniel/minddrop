import { readDatabaseConfig } from '../../readDatabaseConfig';
import { readEntryFilePaths } from '../../readEntryFilePaths';
import type {
  BackgroundSyncChangeset,
  Database,
  EntryFileChange,
} from '../../types';
import {
  hashDatabaseProperties,
  resolveDatabaseConfigFilePath,
  resolveDatabasePath,
} from '../../utils';
import { backgroundSyncDatabases } from '../backgroundSyncDatabases';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { syncEntryFiles } from '../syncEntryFiles';

/**
 * Re-indexes the databases whose configs changed outside of the app.
 * Reads only those databases' configs, and their entries only when
 * their property schema changed. Scans the whole workspace instead
 * when a config was removed, moved, or changes how entries are stored.
 *
 * @param workspaceId - The ID of the workspace the databases belong to.
 * @param workspacePath - The absolute path to the workspace root.
 * @param databases - The databases as currently loaded.
 * @param databaseIds - The IDs of the databases whose configs changed.
 * @returns The changeset of upserted databases and entries, or the
 *   workspace scan's changeset.
 */
export async function syncDatabaseConfigs(
  workspaceId: string,
  workspacePath: string,
  databases: Database[],
  databaseIds: string[],
): Promise<BackgroundSyncChangeset> {
  // Index the databases' SQL records by ID
  const records = new Map(
    sqlGetAllDatabases(workspaceId).map((record) => [record.id, record]),
  );

  // The configs read from disk, with whether their schema changed
  const read: { config: Database; schemaChanged: boolean }[] = [];

  // Read each changed config before writing anything. A database
  // needing a scan leaves the index for the scan to diff.
  for (const id of new Set(databaseIds)) {
    // Get the database's SQL record
    const record = records.get(id);
    // Get the loaded database
    const database = databases.find((current) => current.id === id);

    // Check the database is indexed and loaded. If not, scan.
    if (!record || !database) {
      return backgroundSyncDatabases(workspaceId, workspacePath);
    }

    // Resolve the database's config file path
    const configPath = resolveDatabaseConfigFilePath(
      resolveDatabasePath(database, workspacePath),
    );

    // Read the config
    const configRead = await readDatabaseConfig(workspacePath, configPath);

    // Check if the config is gone. If so, scan. The database was
    // removed or moved.
    if (configRead.status === 'missing') {
      return backgroundSyncDatabases(workspaceId, workspacePath);
    }

    // Skip a config which exists but cannot be read. The database is
    // left at its indexed state.
    if (configRead.status === 'unreadable') {
      continue;
    }

    // Get the read config
    const config = configRead.value;

    // Check if the config claims another ID or changes where entry
    // files live. If so, scan.
    if (
      config.id !== database.id ||
      config.entrySerializer !== database.entrySerializer ||
      config.propertyFileStorage !== database.propertyFileStorage
    ) {
      return backgroundSyncDatabases(workspaceId, workspacePath);
    }

    // Stage the config, with whether its schema differs from the indexed one
    read.push({
      config,
      schemaChanged:
        record.propertiesHash !== hashDatabaseProperties(config.properties),
    });
  }

  // Upsert each read config to SQL
  read.forEach(({ config }) => {
    sqlUpsertDatabase(
      {
        id: config.id,
        name: config.name,
        path: config.path,
        icon: config.icon,
        properties: config.properties,
      },
      { silent: true },
      workspaceId,
    );
  });

  // Get the configs whose schema changed
  const schemaChangedConfigs = read
    .filter((staged) => staged.schemaChanged)
    .map((staged) => staged.config);

  // List every entry of the databases whose schema changed, as sidecar
  // changes. These are re-read whatever their indexed hash.
  const changes: EntryFileChange[] = (
    await Promise.all(
      schemaChangedConfigs.map(async (config) =>
        (await readEntryFilePaths(config, { workspacePath })).map(
          (path): EntryFileChange => ({
            databaseId: config.id,
            path,
            file: 'metadata',
          }),
        ),
      ),
    )
  ).flat();

  // Build the changeset of the upserted databases
  const changeset: BackgroundSyncChangeset = {
    workspaceId,
    hasChanges: read.length > 0,
    upsertedDatabases: read.map((staged) => staged.config),
    deletedDatabaseIds: [],
    upsertedEntries: [],
    deletedEntryIds: [],
  };

  // Check if any schema changed. If not, no entry needs re-indexing.
  if (!changes.length) {
    return changeset;
  }

  // Re-index the entries against their database's new schema
  const entryChangeset = await syncEntryFiles(
    workspaceId,
    workspacePath,
    schemaChangedConfigs,
    changes,
  );

  // Add the re-indexed entries to the changeset
  return {
    ...changeset,
    hasChanges: changeset.hasChanges || entryChangeset.hasChanges,
    upsertedEntries: entryChangeset.upsertedEntries,
    deletedEntryIds: entryChangeset.deletedEntryIds,
  };
}

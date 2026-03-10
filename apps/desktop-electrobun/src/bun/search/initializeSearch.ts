import { DatabaseEntrySerializers } from '@minddrop/databases';
import type { Database, DatabaseEntry } from '@minddrop/databases';
import type { SearchEntryData, SearchEntryProperty } from '@minddrop/search';
import {
  deleteEntries,
  getEntryTimestamps,
  openSearchDb,
  upsertDatabase,
  upsertEntries,
} from './searchDb';
import {
  readDatabaseConfigs,
  readDatabaseEntries,
  readWorkspaceId,
  readWorkspacePaths,
  registerBunFileSystemAdapter,
} from './searchFileReader';
import { initializeSearchIndex, rebuildSearchIndex } from './searchIndex';

/**
 * Initializes the search system for all configured workspaces.
 * Called from the Bun process after the browser window is created.
 *
 * Registers a minimal file system adapter and loads core entry
 * serializers so the databases package can read files directly.
 *
 * For each workspace:
 * 1. Opens/creates the SQLite database
 * 2. Reads database configs and entries via the databases package
 * 3. Populates SQLite with the data
 * 4. Initializes the MiniSearch index (loads from disk or rebuilds)
 */
export async function initializeSearch(): Promise<void> {
  console.log('[search] Starting search initialization');

  // Register a Bun-native file system adapter so the databases
  // package can read files without the renderer's RPC layer
  registerBunFileSystemAdapter();

  // Load core entry serializers so entries can be deserialized
  DatabaseEntrySerializers.loadCoreSerializers();

  // Read workspace paths from the app config
  const workspacePaths = await readWorkspacePaths();

  if (workspacePaths.length === 0) {
    console.log('[search] No workspaces configured, skipping initialization');

    return;
  }

  // Initialize search for each workspace
  await Promise.all(
    workspacePaths.map((workspacePath) =>
      initializeWorkspaceSearch(workspacePath),
    ),
  );

  console.log('[search] Search initialization complete');
}

/**
 * Initializes search for a single workspace.
 */
async function initializeWorkspaceSearch(workspacePath: string): Promise<void> {
  // Read the workspace ID
  const workspaceId = await readWorkspaceId(workspacePath);

  if (!workspaceId) {
    console.warn(
      `[search] Skipping workspace at ${workspacePath} (no workspace ID)`,
    );

    return;
  }

  console.log(
    `[search] Initializing search for workspace ${workspaceId} at ${workspacePath}`,
  );

  // Open or create the SQLite database.
  // If the schema version changed, the database was recreated
  // and all data needs to be re-indexed.
  const { schemaChanged } = await openSearchDb(workspaceId);

  // Read database configs using the databases package
  const databaseConfigs = await readDatabaseConfigs(workspacePath);

  console.log(
    `[search] Found ${databaseConfigs.length} databases in workspace ${workspaceId}`,
  );

  // Populate SQLite with database and entry data
  for (const config of databaseConfigs) {
    // Upsert the database record
    upsertDatabase(workspaceId, {
      id: config.id,
      name: config.name,
      path: config.path,
      icon: config.icon,
    });

    // Read entries using the databases package
    const entries = await readDatabaseEntries(config);

    if (schemaChanged) {
      // Schema changed, index everything
      if (entries.length > 0) {
        const searchEntries = entries.map((entry) =>
          convertToSearchEntry(entry, config),
        );

        upsertEntries(workspaceId, searchEntries);
      }

      console.log(
        `[search] Database "${config.name}": ${entries.length} entries indexed (full rebuild)`,
      );
    } else {
      // Incremental update, skip unchanged entries
      const existingTimestamps = getEntryTimestamps(workspaceId, config.id);

      // Find entries that are new or have been modified
      const changedEntries = entries.filter((entry) => {
        const existingTimestamp = existingTimestamps.get(entry.id);

        return (
          existingTimestamp === undefined ||
          existingTimestamp !== entry.lastModified.getTime()
        );
      });

      // Find entries that have been deleted from disk
      const freshIds = new Set(entries.map((entry) => entry.id));
      const deletedIds = [...existingTimestamps.keys()].filter(
        (id) => !freshIds.has(id),
      );

      // Upsert changed entries
      if (changedEntries.length > 0) {
        const searchEntries = changedEntries.map((entry) =>
          convertToSearchEntry(entry, config),
        );

        upsertEntries(workspaceId, searchEntries);
      }

      // Remove deleted entries
      if (deletedIds.length > 0) {
        deleteEntries(workspaceId, deletedIds);
      }

      console.log(
        `[search] Database "${config.name}": ${changedEntries.length} updated, ${deletedIds.length} deleted, ${entries.length - changedEntries.length} unchanged`,
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
}

/**
 * Converts a DatabaseEntry to a SearchEntryData object for
 * indexing in SQLite.
 */
function convertToSearchEntry(
  entry: DatabaseEntry,
  database: Database,
): SearchEntryData {
  const properties: SearchEntryProperty[] = [];

  // Convert each property using the database schema for type info
  for (const schema of database.properties) {
    const value = entry.properties[schema.name];

    if (value === null || value === undefined) {
      continue;
    }

    properties.push({
      name: schema.name,
      type: schema.type,
      value: normalizePropertyValue(schema.type, value),
    });
  }

  return {
    id: entry.id,
    databaseId: entry.database,
    path: entry.path,
    title: entry.title,
    created: entry.created.getTime(),
    lastModified: entry.lastModified.getTime(),
    properties,
  };
}

/**
 * Normalizes a property value for the search entry format.
 */
function normalizePropertyValue(
  type: string,
  value: unknown,
): string | number | boolean | string[] | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (type === 'collection' && Array.isArray(value)) {
    return value.map(String);
  }

  if (type === 'toggle') {
    return Boolean(value);
  }

  if (type === 'number') {
    return Number(value);
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (type === 'date' || type === 'created' || type === 'last-modified') {
    if (typeof value === 'number') {
      return value;
    }

    return new Date(String(value)).getTime();
  }

  return String(value);
}

import type {
  DatabaseCreatedEventData,
  DatabaseDeletedEventData,
  DatabaseEntry,
  DatabaseEntryCreatedEventData,
  DatabaseEntryDeletedEventData,
  DatabaseEntryRenamedEventData,
  DatabaseEntryUpdatedEventData,
  DatabasePropertyAddedEventData,
  DatabasePropertyRemovedEventData,
  DatabasePropertyRenamedEventData,
  DatabaseRenamedEventData,
  DatabaseUpdatedEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { PropertyType } from '@minddrop/properties';
import type { SearchEntryData, SearchEntryProperty } from '@minddrop/search';
import { Workspaces } from '@minddrop/workspaces';

// Database event names
const ENTRY_CREATED = 'databases:entry:created';
const ENTRY_UPDATED = 'databases:entry:updated';
const ENTRY_DELETED = 'databases:entry:deleted';
const ENTRY_RENAMED = 'databases:entry:renamed';
const DATABASE_CREATED = 'databases:database:created';
const DATABASE_UPDATED = 'databases:database:updated';
const DATABASE_DELETED = 'databases:database:deleted';
const DATABASE_RENAMED = 'databases:database:renamed';
const PROPERTY_ADDED = 'databases:property:added';
const PROPERTY_REMOVED = 'databases:property:removed';
const PROPERTY_RENAMED = 'databases:property:renamed';

/**
 * Registers event listeners that forward database entry CRUD events
 * to the Bun process via RPC for incremental search index sync.
 */
export function initializeSearchSync(rpc: {
  request: {
    searchSync: (params: {
      workspaceId: string;
      action: 'upsert' | 'delete';
      entries?: SearchEntryData[];
      entryIds?: string[];
    }) => Promise<void>;
    searchDatabaseSync: (params: {
      workspaceId: string;
      action: 'upsert' | 'delete';
      database: { id: string; name: string; path: string; icon: string };
    }) => Promise<void>;
    searchReindexDatabase: (params: {
      workspaceId: string;
      databaseId: string;
    }) => Promise<void>;
    searchRenameProperty: (params: {
      workspaceId: string;
      databaseId: string;
      oldName: string;
      newName: string;
    }) => Promise<void>;
  };
}): void {
  // Forward entry created events
  Events.on<DatabaseEntryCreatedEventData>(
    ENTRY_CREATED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = convertEntryToSearchData(data);

      rpc.request.searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward entry updated events
  Events.on<DatabaseEntryUpdatedEventData>(
    ENTRY_UPDATED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = convertEntryToSearchData(data.updated);

      rpc.request.searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward entry deleted events
  Events.on<DatabaseEntryDeletedEventData>(
    ENTRY_DELETED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchSync({
        workspaceId,
        action: 'delete',
        entryIds: [data.id],
      });
    },
  );

  // Forward entry renamed events
  Events.on<DatabaseEntryRenamedEventData>(
    ENTRY_RENAMED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = convertEntryToSearchData(data.updated);

      rpc.request.searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward database created events
  Events.on<DatabaseCreatedEventData>(
    DATABASE_CREATED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchDatabaseSync({
        workspaceId,
        action: 'upsert',
        database: {
          id: data.id,
          name: data.name,
          path: data.path,
          icon: data.icon,
        },
      });
    },
  );

  // Forward database updated events (name, icon, etc.)
  Events.on<DatabaseUpdatedEventData>(
    DATABASE_UPDATED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchDatabaseSync({
        workspaceId,
        action: 'upsert',
        database: {
          id: data.updated.id,
          name: data.updated.name,
          path: data.updated.path,
          icon: data.updated.icon,
        },
      });
    },
  );

  // Forward database deleted events
  Events.on<DatabaseDeletedEventData>(
    DATABASE_DELETED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchDatabaseSync({
        workspaceId,
        action: 'delete',
        database: {
          id: data.id,
          name: data.name,
          path: data.path,
          icon: data.icon,
        },
      });
    },
  );

  // Forward database renamed events
  Events.on<DatabaseRenamedEventData>(
    DATABASE_RENAMED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchDatabaseSync({
        workspaceId,
        action: 'upsert',
        database: {
          id: data.updated.id,
          name: data.updated.name,
          path: data.updated.path,
          icon: data.updated.icon,
        },
      });
    },
  );

  // Forward property added events (re-index all entries in the database)
  Events.on<DatabasePropertyAddedEventData>(
    PROPERTY_ADDED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchReindexDatabase({
        workspaceId,
        databaseId: data.database.id,
      });
    },
  );

  // Forward property removed events (re-index all entries in the database)
  Events.on<DatabasePropertyRemovedEventData>(
    PROPERTY_REMOVED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchReindexDatabase({
        workspaceId,
        databaseId: data.database.id,
      });
    },
  );

  // Forward property renamed events (rename in SQLite + re-index MiniSearch)
  Events.on<DatabasePropertyRenamedEventData>(
    PROPERTY_RENAMED,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      rpc.request.searchRenameProperty({
        workspaceId,
        databaseId: data.database.id,
        oldName: data.oldName,
        newName: data.newName,
      });
    },
  );
}

/**
 * Returns the current workspace ID. Resolved lazily at
 * event time since workspaces may not be loaded when the
 * listeners are first registered.
 */
function getWorkspaceId(): string | null {
  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return null;
  }

  // Use the first workspace for now
  return workspaces[0].id;
}

/**
 * Converts a DatabaseEntry to a SearchEntryData object for
 * the search sync RPC.
 */
function convertEntryToSearchData(entry: DatabaseEntry): SearchEntryData {
  const properties: SearchEntryProperty[] = [];

  // Convert each property to the search format
  for (const [name, value] of Object.entries(entry.properties)) {
    if (value === null || value === undefined) {
      continue;
    }

    // Infer the property type from the value
    const type = inferPropertyType(value);

    properties.push({
      name,
      type,
      value: normalizeValue(type, value),
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
 * Infers the property type from a value for the search entry.
 */
function inferPropertyType(value: unknown): PropertyType {
  if (Array.isArray(value)) {
    return 'collection';
  }

  if (typeof value === 'boolean') {
    return 'toggle';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (value instanceof Date) {
    return 'date';
  }

  return 'text';
}

/**
 * Normalizes a property value for the search sync format.
 */
function normalizeValue(
  type: PropertyType,
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

  return String(value);
}

import type {
  DatabaseCreatedEventData,
  DatabaseDeletedEventData,
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
import type { DatabaseEntry } from '@minddrop/databases';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';
import type { SearchEntryData } from './types';
import { convertEntryToSearchData } from './utils';

/**
 * Registers event listeners that forward database entry CRUD events
 * to the back-end via the search adapter for incremental search
 * index sync.
 */
export function initializeSearchSync(): void {
  // Forward entry created events
  Events.on<DatabaseEntryCreatedEventData>(
    DatabaseEntries.events.created,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = toSearchEntry(data);

      if (!entry) {
        return;
      }

      getSearchAdapter().searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward entry updated events
  Events.on<DatabaseEntryUpdatedEventData>(
    DatabaseEntries.events.updated,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = toSearchEntry(data.updated);

      if (!entry) {
        return;
      }

      getSearchAdapter().searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward entry deleted events
  Events.on<DatabaseEntryDeletedEventData>(
    DatabaseEntries.events.deleted,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchSync({
        workspaceId,
        action: 'delete',
        entryIds: [data.id],
      });
    },
  );

  // Forward entry renamed events
  Events.on<DatabaseEntryRenamedEventData>(
    DatabaseEntries.events.renamed,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      const entry = toSearchEntry(data.updated);

      if (!entry) {
        return;
      }

      getSearchAdapter().searchSync({
        workspaceId,
        action: 'upsert',
        entries: [entry],
      });
    },
  );

  // Forward database created events
  Events.on<DatabaseCreatedEventData>(
    Databases.events.created,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchDatabaseSync({
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
    Databases.events.updated,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchDatabaseSync({
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
    Databases.events.deleted,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchDatabaseSync({
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
    Databases.events.renamed,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchDatabaseSync({
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
    Databases.events.propertyAdded,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchReindexDatabase({
        workspaceId,
        databaseId: data.database.id,
      });
    },
  );

  // Forward property removed events (re-index all entries in the database)
  Events.on<DatabasePropertyRemovedEventData>(
    Databases.events.propertyRemoved,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchReindexDatabase({
        workspaceId,
        databaseId: data.database.id,
      });
    },
  );

  // Forward property renamed events (rename in SQLite + re-index MiniSearch)
  Events.on<DatabasePropertyRenamedEventData>(
    Databases.events.propertyRenamed,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      getSearchAdapter().searchRenameProperty({
        workspaceId,
        databaseId: data.database.id,
        oldName: data.oldName,
        newName: data.newName,
      });
    },
  );
}

// TODO: Use Workspaces.getCurrent() instead of getWorkspaceId() once it's available
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
 * Converts a DatabaseEntry to SearchEntryData by looking up
 * the database from the store. Returns null if the database
 * is not found.
 */
function toSearchEntry(entry: DatabaseEntry): SearchEntryData | null {
  const database = Databases.get(entry.database);

  if (!database) {
    return null;
  }

  return convertEntryToSearchData(entry, database);
}

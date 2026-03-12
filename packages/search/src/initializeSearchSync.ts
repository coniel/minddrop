import { Databases } from '@minddrop/databases';
import type {
  DatabaseEntriesSqlSyncedEventData,
  DatabasePropertySqlSyncedEventData,
  DatabaseSqlReindexedEventData,
  DatabaseSqlSyncedEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';

/**
 * Registers event listeners that respond to database SQL
 * sync events by forwarding MiniSearch updates to the
 * backend via the search adapter.
 *
 * The databases package handles all SQL operations; the
 * search adapter only needs to update the MiniSearch
 * full-text index.
 */
export function initializeSearchSync(): void {
  // Handle entry sync (upsert/delete)
  Events.on<DatabaseEntriesSqlSyncedEventData>(
    Databases.events.entriesSqlSynced,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      if (data.action === 'upsert' && data.entries?.length) {
        getSearchAdapter().searchSync({
          workspaceId,
          action: 'upsert',
          entries: data.entries.map((entry) => ({
            id: entry.id,
            title: entry.title,
            databaseId: entry.databaseId,
          })),
        });
      }

      if (data.action === 'delete' && data.entryIds.length > 0) {
        getSearchAdapter().searchSync({
          workspaceId,
          action: 'delete',
          entryIds: data.entryIds,
        });
      }
    },
  );

  // Handle database sync (upsert/delete)
  Events.on<DatabaseSqlSyncedEventData>(
    Databases.events.databaseSqlSynced,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      if (data.action === 'upsert' && data.database) {
        getSearchAdapter().searchDatabaseSync({
          workspaceId,
          action: 'upsert',
          database: data.database,
        });
      }

      if (data.action === 'delete') {
        getSearchAdapter().searchDatabaseSync({
          workspaceId,
          action: 'delete',
          database: {
            id: data.databaseId,
            name: '',
            path: '',
            icon: '',
          },
        });
      }
    },
  );

  // Handle property rename (re-index MiniSearch)
  Events.on<DatabasePropertySqlSyncedEventData>(
    Databases.events.propertySqlSynced,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      // SQL rename is already done; just re-index MiniSearch
      // with updated property data
      getSearchAdapter().searchReindexDatabase({
        workspaceId,
        databaseId: data.databaseId,
      });
    },
  );

  // Handle database reindex (property added/removed)
  Events.on<DatabaseSqlReindexedEventData>(
    Databases.events.databaseSqlReindexed,
    'search:sync',
    ({ data }) => {
      const workspaceId = getWorkspaceId();

      if (!workspaceId) {
        return;
      }

      // SQL re-index is already done; just re-index MiniSearch
      getSearchAdapter().searchReindexDatabase({
        workspaceId,
        databaseId: data.databaseId,
      });
    },
  );
}

// TODO: Use Workspaces.getCurrent() once available
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

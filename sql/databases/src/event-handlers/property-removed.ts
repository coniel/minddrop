import type { DatabasePropertyRemovedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseSqlReindexedEvent } from '../events';
import type { DatabaseSqlReindexedEventData } from '../events';
import { reindexDatabaseEntries } from '../reindex';

/**
 * Handles property removed events by re-indexing all entries
 * in the database and dispatching a reindexed event.
 */
export function onRemoveProperty(data: DatabasePropertyRemovedEventData): void {
  // Re-index all entries in the database
  reindexDatabaseEntries(data.database);

  // Dispatch reindexed event
  Events.dispatch<DatabaseSqlReindexedEventData>(DatabaseSqlReindexedEvent, {
    databaseId: data.database.id,
  });
}

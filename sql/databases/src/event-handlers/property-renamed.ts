import type { DatabasePropertyRenamedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabasePropertySqlSyncedEvent } from '../events';
import type { DatabasePropertySqlSyncedEventData } from '../events';
import { renameProperty } from '../operations';

/**
 * Handles property renamed events by renaming the property
 * in SQL and dispatching a synced event.
 */
export function onRenameProperty(data: DatabasePropertyRenamedEventData): void {
  // Rename in SQL
  renameProperty(data.database.id, data.oldName, data.newName);

  // Dispatch synced event
  Events.dispatch<DatabasePropertySqlSyncedEventData>(DatabasePropertySqlSyncedEvent, {
    action: 'rename',
    databaseId: data.database.id,
    oldName: data.oldName,
    newName: data.newName,
  });
}

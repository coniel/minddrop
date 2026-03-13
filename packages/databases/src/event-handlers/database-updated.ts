import { DatabaseUpdatedEventData } from '../events';
import { sqlUpsertDatabase } from '../sql';

/**
 * Called when a database is updated. Syncs the updated
 * metadata to SQL.
 */
export function onUpdateDatabase(data: DatabaseUpdatedEventData): void {
  sqlUpsertDatabase({
    id: data.updated.id,
    name: data.updated.name,
    path: data.updated.path,
    icon: data.updated.icon,
  });
}

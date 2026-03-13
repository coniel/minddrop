import { Views } from '@minddrop/views';
import { DatabaseCreatedEventData } from '../../events';
import { sqlUpsertDatabase } from '../../sql';

/**
 * Called when a database is created. Syncs to SQL and
 * creates a default table view.
 */
export function onCreateDatabase(data: DatabaseCreatedEventData) {
  // Sync to SQL
  sqlUpsertDatabase({
    id: data.id,
    name: data.name,
    path: data.path,
    icon: data.icon,
  });

  // Create a new view for the database
  Views.create('table', {
    type: 'database',
    id: data.id,
  });
}

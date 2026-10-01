import { ContentViews } from '@minddrop/content-views';
import { entityId } from '@minddrop/utils';
import { DatabaseCreatedEventData } from '../../events';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { sqlUpsertDatabase } from '../../sql';

/**
 * Called when a database is created. Sets up the state derived from
 * it.
 *
 * @param data - The created database's data.
 */
export async function onCreateDatabase(
  data: DatabaseCreatedEventData,
): Promise<void> {
  // Create a virtual view for the database
  ContentViews.createVirtual({
    id: entityId(ContentViews.constants.EntityType),
    type: 'table',
    dataSource: { type: 'database', id: data.id },
    owner: data.id,
  });

  // Sync to SQL
  sqlUpsertDatabase({
    id: data.id,
    name: data.name,
    path: data.path,
    icon: data.icon,
  });

  // Open the database's history
  await recordDatabaseHistory(data, { kind: 'created' });
}

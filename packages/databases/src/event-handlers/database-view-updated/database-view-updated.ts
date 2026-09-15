import { ContentViewUpdatedEventData } from '@minddrop/content-views';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseView } from '../../writeDatabaseView';

/**
 * Called when a view is updated. If the view is owned by a
 * database, writes it to the database's views directory.
 */
export async function onDatabaseViewUpdated(
  data: ContentViewUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  if (updated.owner && isEntityId(updated.owner, 'database')) {
    await writeDatabaseView(updated);
  }
}

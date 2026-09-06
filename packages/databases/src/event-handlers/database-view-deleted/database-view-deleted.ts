import { DataViewDeletedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { getDatabase } from '../../getDatabase';
import { removeDatabaseViewFile } from '../../removeDatabaseViewFile';
import { updateDatabase } from '../../updateDatabase';

/**
 * Called when a view is deleted. If the view was owned by a
 * database, deletes its file from the database's views directory
 * and removes it from the database's view ID list.
 */
export async function onDatabaseViewDeleted(
  data: DataViewDeletedEventData,
): Promise<void> {
  if (!data.owner || !isEntityId(data.owner, 'database')) {
    return;
  }

  // Delete the view's file
  await removeDatabaseViewFile(data);

  // Get the owning database
  const database = getDatabase(data.owner);

  // Remove the view from the database's view ID list if present
  if (database.views.includes(data.id)) {
    await updateDatabase(database.id, {
      views: database.views.filter((id) => id !== data.id),
    });
  }
}

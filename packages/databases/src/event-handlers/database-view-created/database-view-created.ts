import { DataViewCreatedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { getDatabase } from '../../getDatabase';
import { updateDatabase } from '../../updateDatabase';
import { writeDatabaseView } from '../../writeDatabaseView';

/**
 * Called when a view is created. If the view is owned by a
 * database, writes it to the database's views directory and adds
 * it to the database's view ID list.
 */
export async function onDatabaseViewCreated(
  data: DataViewCreatedEventData,
): Promise<void> {
  if (!data.owner || !isEntityId(data.owner, 'database')) {
    return;
  }

  // Write the view to its file
  await writeDatabaseView(data);

  // Get the owning database
  const database = getDatabase(data.owner);

  // Add the view to the database's view ID list if not already
  // present.
  if (!database.views.includes(data.id)) {
    await updateDatabase(database.id, { views: [...database.views, data.id] });
  }
}

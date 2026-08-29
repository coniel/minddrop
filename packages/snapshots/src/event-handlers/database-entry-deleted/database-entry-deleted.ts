import { DatabaseEntryDeletedEventData, Databases } from '@minddrop/databases';
import { isUntitledTitle } from '@minddrop/utils';
import { retractRenameChainEnd } from '../../retractRenameChainEnd';

/**
 * Called when a database entry is deleted. Retracts the rename
 * chain ending at a deleted untitled entry's address, so a future
 * untitled entry cannot falsely continue it.
 */
export async function onDatabaseEntryDeleted(
  data: DatabaseEntryDeletedEventData,
): Promise<void> {
  // Only untitled entries can leave a falsely continuable chain
  if (!isUntitledTitle(data.title)) {
    return;
  }

  // Get the database for its name, the entry's address prefix
  const database = Databases.get(data.database);

  // Retract the chain ending at the deleted entry's address
  await retractRenameChainEnd(`${database.name}/${data.title}`, 'entry');
}

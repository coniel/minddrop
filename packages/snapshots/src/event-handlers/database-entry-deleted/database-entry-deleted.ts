import { DatabaseEntryDeletedEventData, Databases } from '@minddrop/databases';
import { isUntitledTitle } from '@minddrop/utils';
import { deleteSnapshotHistory } from '../../deleteSnapshotHistory';
import { retractRenameChainEnd } from '../../retractRenameChainEnd';

/**
 * Called when a database entry is deleted. Erases what the deleted
 * entry leaves under its untitled address: the rename chain ending
 * there, and the history captured under it.
 */
export async function onDatabaseEntryDeleted(
  data: DatabaseEntryDeletedEventData,
): Promise<void> {
  // Only an untitled entry frees its address for another entry,
  // titles otherwise being the user's to reuse or not
  if (!isUntitledTitle(data.title)) {
    return;
  }

  // Get the database for its name, the entry's address prefix
  const database = Databases.get(data.database);

  // Retract the chain ending at the deleted entry's address
  await retractRenameChainEnd(`${database.name}/${data.title}`, 'entry');

  // Drop the history captured under the title, which the next
  // untitled entry would otherwise inherit
  await deleteSnapshotHistory({
    ownerPath: database.path,
    subjectKey: data.title,
  });
}

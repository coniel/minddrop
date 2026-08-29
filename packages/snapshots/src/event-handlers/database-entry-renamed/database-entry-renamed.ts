import { DatabaseEntryRenamedEventData, Databases } from '@minddrop/databases';
import { isUntitledTitle } from '@minddrop/utils';
import { isRenameChainEnd } from '../../isRenameChainEnd';
import { recordRename } from '../../recordRename';

/**
 * Called when a database entry is renamed. Records the rename in
 * the rename ledger under the entry's layout-independent address.
 */
export async function onDatabaseEntryRenamed(
  data: DatabaseEntryRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Get the database for its name, the entry's address prefix
  const database = Databases.get(updated.database);

  // The entry's address before the rename
  const oldAddress = `${database.name}/${original.title}`;

  // Renames away from a default untitled title are only recorded
  // when a recorded chain ends at the untitled address, continuing
  // the chain of an entry which was temporarily untitled while
  // keeping first namings of new entries unrecorded
  const recordInLedger =
    !isUntitledTitle(original.title) ||
    (await isRenameChainEnd(oldAddress, 'entry'));

  // Record the rename in the rename ledger
  if (recordInLedger) {
    await recordRename({
      from: oldAddress,
      to: `${database.name}/${updated.title}`,
      kind: 'entry',
    });
  }
}

import { DatabaseRenamedEventData } from '@minddrop/databases';
import { recordRename } from '../../recordRename';

/**
 * Called when a database is renamed. Records the rename in the
 * rename ledger under the database's name.
 */
export async function onDatabaseRenamed(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Record the rename in the rename ledger
  await recordRename({
    from: original.name,
    to: updated.name,
    kind: 'database',
  });
}

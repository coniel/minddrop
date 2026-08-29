import { DatabasePropertyRenamedEventData } from '@minddrop/databases';
import { recordRename } from '../../recordRename';

/**
 * Called when a database property is renamed. Records the rename in
 * the rename ledger under the property's address.
 */
export async function onDatabasePropertyRenamed(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  const { database, oldName, newName } = data;

  // Record the rename in the rename ledger
  await recordRename({
    from: `${database.name}/${oldName}`,
    to: `${database.name}/${newName}`,
    kind: 'property',
  });
}

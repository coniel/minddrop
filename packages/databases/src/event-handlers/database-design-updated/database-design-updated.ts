import { DesignUpdatedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseDesign } from '../../writeDatabaseDesign';

/**
 * Called when a design is updated. If the design is owned by a
 * database, writes it to the database's designs directory.
 */
export async function onDatabaseDesignUpdated(
  data: DesignUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  if (updated.owner && isEntityId(updated.owner, 'database')) {
    await writeDatabaseDesign(updated);
  }
}

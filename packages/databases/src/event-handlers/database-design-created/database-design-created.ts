import { DesignCreatedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { getDatabase } from '../../getDatabase';
import { updateDatabase } from '../../updateDatabase';
import { writeDatabaseDesign } from '../../writeDatabaseDesign';

/**
 * Called when a design is created. If the design is owned by a
 * database, writes it to the database's designs directory and adds
 * it to the database's design ID list.
 */
export async function onDatabaseDesignCreated(
  data: DesignCreatedEventData,
): Promise<void> {
  if (!data.owner || !isEntityId(data.owner, 'database')) {
    return;
  }

  // Write the design to its file
  await writeDatabaseDesign(data);

  // Get the owning database
  const database = getDatabase(data.owner);

  // Add the design to the database's design ID list if not already
  // present.
  if (!database.designs.includes(data.id)) {
    await updateDatabase(database.id, {
      designs: [...database.designs, data.id],
    });
  }
}

import { DesignDeletedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { getDatabase } from '../../getDatabase';
import { removeDatabaseDesignFile } from '../../removeDatabaseDesignFile';
import { UpdateDatabaseData, updateDatabase } from '../../updateDatabase';

/**
 * Called when a design is deleted. If the design was owned by a
 * database, removes it from the database's design ID list and
 * default design pins, and deletes its file from the database's
 * designs directory.
 */
export async function onDatabaseDesignDeleted(
  data: DesignDeletedEventData,
): Promise<void> {
  if (!data.owner || !isEntityId(data.owner, 'database')) {
    return;
  }

  // Get the owning database
  const database = getDatabase(data.owner);

  const update: UpdateDatabaseData = {};

  // Remove the design from the database's design ID list if present
  if (database.designs.includes(data.id)) {
    update.designs = database.designs.filter((id) => id !== data.id);
  }

  // Remove the default design pins pointing at the deleted design
  const pinnedContexts = Object.entries(database.defaultDesigns ?? {}).filter(
    ([, designId]) => designId !== data.id,
  );

  if (
    pinnedContexts.length !== Object.keys(database.defaultDesigns ?? {}).length
  ) {
    update.defaultDesigns = Object.fromEntries(pinnedContexts);
  }

  if (Object.keys(update).length > 0) {
    await updateDatabase(data.owner, update);
  }

  // Delete the design's file
  await removeDatabaseDesignFile(data);
}

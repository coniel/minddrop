import { DesignDeletedEventData } from '@minddrop/designs-next';
import { isEntityId } from '@minddrop/utils';
import { DatabasesStore } from '../../DatabasesStore';
import { updateDatabase } from '../../updateDatabase';
import { writeDatabaseDesigns } from '../../writeDatabaseDesigns';

/**
 * Called when a design is deleted. If the design was owned by a
 * database, unpins it from the database's default designs and
 * persists the remaining designs to the database config.
 */
export async function onDatabaseDesignDeleted(
  data: DesignDeletedEventData,
): Promise<void> {
  if (!data.owner || !isEntityId(data.owner, 'database')) {
    return;
  }

  // Get the database from the store, return early if it no
  // longer exists (handles deletion race).
  const database = DatabasesStore.get(data.owner);

  if (!database) {
    return;
  }

  // Drop the default design pins pointing at the deleted design
  const pinnedContexts = Object.entries(database.defaultDesigns ?? {}).filter(
    ([, designId]) => designId !== data.id,
  );

  if (
    pinnedContexts.length !== Object.keys(database.defaultDesigns ?? {}).length
  ) {
    await updateDatabase(data.owner, {
      defaultDesigns: Object.fromEntries(pinnedContexts),
    });
  }

  // Persist the remaining designs
  await writeDatabaseDesigns(data.owner);
}

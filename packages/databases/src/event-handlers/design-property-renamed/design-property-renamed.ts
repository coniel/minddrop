import { DesignPropertyRenamedEventData } from '@minddrop/designs';
import { DatabasesStore } from '../../DatabasesStore';
import { updateDatabase } from '../../updateDatabase';

/**
 * Called when a design property is renamed. Remaps the design
 * property map keys of every database that uses the design so
 * they reference the new property name.
 */
export async function onRenameDesignProperty(
  data: DesignPropertyRenamedEventData,
): Promise<void> {
  const { design, oldName, newName } = data;

  // Get all databases that use the renamed design
  const databases = DatabasesStore.getAllArray().filter(
    (database) => database.designId === design.id,
  );

  // Remap the map keys for each affected database
  await Promise.all(
    databases.map(async (database) => {
      // Skip databases that don't map the renamed property
      if (!(oldName in database.designPropertyMap)) {
        return;
      }

      // Rebuild the map with the key renamed, preserving order
      const designPropertyMap = renameMapKey(
        database.designPropertyMap,
        oldName,
        newName,
      );

      await updateDatabase(database.id, { designPropertyMap });
    }),
  );
}

/**
 * Returns a copy of the map with the `oldKey` entry renamed to
 * `newKey`, preserving insertion order.
 */
function renameMapKey(
  map: Record<string, string>,
  oldKey: string,
  newKey: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]): [string, string] =>
      key === oldKey ? [newKey, value] : [key, value],
    ),
  );
}

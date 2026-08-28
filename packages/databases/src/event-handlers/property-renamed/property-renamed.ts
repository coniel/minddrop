import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyRenamedEventData } from '../../events';
import { sqlRenameProperty } from '../../sql';
import { Database } from '../../types';
import { updateDatabase } from '../../updateDatabase';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database property is renamed. Renames in SQL,
 * remaps the design property map, and updates virtual collection
 * IDs and names.
 */
export async function onRenameProperty(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  const { database, oldName, newName } = data;

  // Rename in SQL
  sqlRenameProperty(database.id, oldName, newName);

  const update: Partial<Database> = {};

  // Remap the design property map so any values pointing at the
  // renamed property use the new name
  const remappedDesignPropertyMap = remapPropertyMapValues(
    database.designPropertyMap,
    oldName,
    newName,
  );

  if (remappedDesignPropertyMap) {
    update.designPropertyMap = remappedDesignPropertyMap;
  }

  // Follow the rename when the property colors the entries
  if (database.colorProperty === oldName) {
    update.colorProperty = newName;
  }

  if (Object.keys(update).length) {
    await updateDatabase(database.id, update);
  }

  // Check if the renamed property is a collection property
  const property = database.properties.find((p) => p.name === newName);

  if (!property || property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Update virtual collection IDs and names
  await Promise.all(
    entries.map(async (entry) => {
      const oldCollectionId = virtualCollectionId(entry.id, oldName);

      // Only update if the collection exists in the store
      if (!Collections.get(oldCollectionId, false)) {
        return;
      }

      const newCollectionId = virtualCollectionId(entry.id, newName);
      const name = virtualCollectionName(database.name, entry.title, newName);

      await Collections.update(oldCollectionId, { id: newCollectionId, name });
    }),
  );
}

/**
 * Returns a copy of the property map with any values equal to
 * `oldName` replaced by `newName`, or null if nothing matched.
 */
function remapPropertyMapValues(
  propertyMap: Record<string, string>,
  oldName: string,
  newName: string,
): Record<string, string> | null {
  let changed = false;

  const remapped = Object.fromEntries(
    Object.entries(propertyMap).map(([key, value]): [string, string] => {
      if (value === oldName) {
        changed = true;

        return [key, newName];
      }

      return [key, value];
    }),
  );

  return changed ? remapped : null;
}

import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs-next';
import { Properties } from '@minddrop/properties';
import { DatabasePropertyRenamedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { renameDatabaseEntriesProperty } from '../../renameDatabaseEntriesProperty';
import { renameDatabaseEntryTemplatesProperty } from '../../renameDatabaseEntryTemplatesProperty';
import { renamePropertyFileDir } from '../../renamePropertyFileDir';
import { sqlRenameProperty } from '../../sql';
import { updateDatabaseDesignsElements } from '../../updateDatabaseDesignsElements';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database property is renamed. Renames it in
 * everything keyed by the old name.
 *
 * @param data - The renamed property's event data.
 */
export async function onRenameProperty(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  const { original, updated: database, oldName, newName, action } = data;

  // Record the rename against the database's history
  await recordDatabaseHistory(database, {
    kind: 'rename',
    target: 'property',
    from: oldName,
    to: newName,
    action,
  });

  // Rename in SQL
  sqlRenameProperty(database.id, oldName, newName);

  // Re-key the property's value in the database's entry templates
  // that have one.
  await renameDatabaseEntryTemplatesProperty(database.id, oldName, newName);

  // Remap the property in the database's design elements
  await updateDatabaseDesignsElements(database.id, (elements) =>
    Designs.remapElementProperties(elements, oldName, newName),
  );

  // Find the property under its old name
  const oldProperty = original.properties.find(
    (property) => property.name === oldName,
  );

  // Check the database declared the renamed property
  if (!oldProperty) {
    return;
  }

  // Re-key the property's value in the database's entries that
  // have one.
  const renamedEntries = await renameDatabaseEntriesProperty(
    database.id,
    oldProperty,
    newName,
  );

  // Record the rename against each entry which had a value for the
  // property.
  await Promise.all(
    renamedEntries.map((entry) =>
      recordDatabaseEntryHistory(database, entry, {
        kind: 'rename',
        target: 'property',
        from: oldName,
        to: newName,
        action,
      }),
    ),
  );

  // Move the property's file directory, which only file based
  // properties have.
  if (Properties.isFileBased(oldProperty)) {
    await renamePropertyFileDir(database.id, oldProperty, newName);
  }

  // Check the renamed property is a collection property. If not,
  // there is nothing left to do.
  if (oldProperty.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = getAllDatabaseEntries(database.id);

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

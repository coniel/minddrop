import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs-next';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { clearDatabaseEntriesProperty } from '../../clearDatabaseEntriesProperty';
import { clearDatabaseEntryTemplatesProperty } from '../../clearDatabaseEntryTemplatesProperty';
import { DatabasePropertyRemovedEventData } from '../../events';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { sqlReindexDatabaseEntries } from '../../sql';
import { updateDatabaseDesignsElements } from '../../updateDatabaseDesignsElements';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a property is removed from a database. Clears the
 * property from everything that has or maps it.
 */
export async function onRemoveProperty(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  const { updated: database, property, action } = data;

  // Drop the property's value from the database's entries. The files
  // a file based property stored for them are deliberately left in
  // place.
  const cleared = await clearDatabaseEntriesProperty(database.id, property);

  // Re-index all entries in SQL without the removed property
  sqlReindexDatabaseEntries(database);

  // Record the value dropped from each entry
  await Promise.all(
    cleared.map(({ entry, value }) =>
      recordDatabaseEntryHistory(database, entry, {
        kind: 'property',
        changes: [{ property: property.name, from: value, to: null }],
        action,
      }),
    ),
  );

  // Drop the property's value from the database's entry templates
  await clearDatabaseEntryTemplatesProperty(database.id, property);

  // Unmap the property from the database's design elements
  await updateDatabaseDesignsElements(database.id, (elements) =>
    Designs.unmapElementProperties(elements, property.name),
  );

  // Only handle collection properties for virtual collections
  if (property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Delete virtual collections for each entry
  await Promise.all(
    entries.map((entry) => {
      const collectionId = virtualCollectionId(entry.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.get(collectionId, false)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );
}

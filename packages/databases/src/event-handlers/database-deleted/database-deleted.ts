import { Collections } from '@minddrop/collections';
import { ContentViews } from '@minddrop/content-views';
import { Designs } from '@minddrop/designs-next';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseEntryTemplatesStore } from '../../DatabaseEntryTemplatesStore';
import { DatabaseDeletedEventData } from '../../events';
import { getDatabaseEntryTemplates } from '../../getDatabaseEntryTemplates';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { recordWorkspaceDatabaseLedger } from '../../recordWorkspaceDatabaseLedger';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteDatabase } from '../../sql';
import { unsetDatabaseContentDefaults } from '../../unsetDatabaseContentDefaults';
import { virtualCollectionId } from '../../utils';

/**
 * Cleans up after a deleted database.
 *
 * @param data - The deleted database's data.
 */
export async function onDeleteDatabase(
  data: DatabaseDeletedEventData,
): Promise<void> {
  // Close the database's history
  await recordDatabaseHistory(data, { kind: 'deleted', action: data.action });

  // Record the deletion in the workspace's databases ledger, after the
  // database's own history is closed.
  await recordWorkspaceDatabaseLedger({
    kind: 'deleted',
    subject: { key: data.name, id: data.id },
    action: data.action,
  });

  // Delete from SQL
  sqlDeleteDatabase(data.id);

  // Unset the content defaults set to the database
  unsetDatabaseContentDefaults(data.id);

  // Delete all views belonging to this database
  const databaseViews = ContentViews.getByDataSource('database', data.id);

  // Delete the views
  await Promise.all(databaseViews.map((view) => ContentViews.delete(view.id)));

  // Delete all designs owned by this database
  const databaseDesigns = Designs.getByOwner(data.id);

  // Delete the designs
  await Promise.all(databaseDesigns.map((design) => Designs.delete(design.id)));

  // Remove the database's entry templates from the store. The
  // database directory is trashed whole, so there are no template
  // files or config to clean up.
  getDatabaseEntryTemplates(data.id).forEach((template) =>
    DatabaseEntryTemplatesStore.remove(template.id),
  );

  // Find collection properties in the database schema
  const collectionProperties = data.properties.filter(
    (property) => property.type === 'collection',
  );

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === data.id,
  );

  // Delete the entries' own virtual collections before membership
  // cleanup so no update is attempted for the deleted entries.
  await Promise.all(
    collectionProperties.flatMap((property) =>
      entries.map((entry) => {
        // Build the entry's virtual collection ID
        const collectionId = virtualCollectionId(entry.id, property.name);

        // Only delete if the collection exists in the store
        if (Collections.get(collectionId, false)) {
          return Collections.delete(collectionId);
        }

        return Promise.resolve();
      }),
    ),
  );

  // Remove the entries from collections referencing them as members
  await removeEntriesFromCollections(entries.map((entry) => entry.id));

  // Remove the entries from view configs referencing them
  await ContentViews.removeReferences(entries.map((entry) => entry.id));
}

import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { History } from '@minddrop/history';
import { isUntitledTitle } from '@minddrop/utils';
import {
  clearContentCapture,
  contentCaptureKey,
} from '../../contentCaptureRegistry';
import { DatabaseEntryDeletedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database entry is deleted. Removes from SQL,
 * deletes virtual collections for collection properties, removes
 * the entry from collections referencing it, and closes or deletes
 * its history.
 */
export async function onDeleteEntry(data: DatabaseEntryDeletedEventData) {
  // Delete from SQL
  sqlDeleteEntries(data.database, [data.id]);

  // Get the database to access its properties schema
  const database = getDatabase(data.database);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Delete the entry's own virtual collections before membership
  // cleanup so no update is attempted for the deleted entry
  await Promise.all(
    collectionProperties.map((property) => {
      const collectionId = virtualCollectionId(data.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.get(collectionId, false)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );

  // Remove the entry from collections referencing it as a member
  await removeEntriesFromCollections([data.id]);

  // Remove the entry from view configs referencing it
  await DataViews.removeReferences([data.id]);

  // Drop the entry's recorded capture, so an entry taking its title
  // next is not measured against it.
  clearContentCapture(contentCaptureKey(database.path, data.title));

  // Check whether the entry was still untitled. Deleting it frees a
  // title the app hands out, so the next new entry would inherit its
  // history.
  if (isUntitledTitle(data.title)) {
    await History.delete({
      ownerPath: database.path,
      subjectKey: data.title,
    });

    return;
  }

  // Close the history of a named entry. It outlives the entry, so the
  // entry can be restored from it.
  await History.record({
    ownerPath: database.path,
    subjectKey: data.title,
    kind: 'deleted',
  });
}

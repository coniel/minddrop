import { Collections } from '@minddrop/collections';
import { ContentViews } from '@minddrop/content-views';
import { History } from '@minddrop/history';
import { isUntitledTitle } from '@minddrop/utils';
import {
  clearContentCapture,
  contentCaptureKey,
} from '../../contentCaptureRegistry';
import { EntryDeletedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { recordEntriesLedger } from '../../recordEntriesLedger';
import { recordEntryHistory } from '../../recordEntryHistory';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteEntries } from '../../sql';
import {
  resolveDatabasePath,
  resolveEntryHistorySubject,
  virtualCollectionId,
} from '../../utils';

/**
 * Called when a database entry is deleted. Cleans up after it.
 *
 * @param data - The deleted entry's data.
 */
export async function onDeleteEntry(data: EntryDeletedEventData) {
  // Delete from SQL
  sqlDeleteEntries(data.database, [data.id]);

  // Get the database to access its properties schema
  const database = getDatabase(data.database);
  const databasePath = resolveDatabasePath(database);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Delete the entry's own virtual collections before membership
  // cleanup so no update is attempted for the deleted entry.
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
  await ContentViews.removeReferences([data.id]);

  // Drop the entry's recorded capture, so an entry taking its title
  // next is not measured against it.
  clearContentCapture(contentCaptureKey(databasePath, data.title));

  // Record the deletion in the entries ledger
  await recordEntriesLedger(database, {
    kind: 'deleted',
    subject: { key: data.title },
  });

  // Check whether the entry was still untitled. Deleting it frees a
  // title the app hands out, so the next new entry would inherit its
  // history.
  if (isUntitledTitle(data.title)) {
    await History.delete(resolveEntryHistorySubject(database, data));

    return;
  }

  // Close the history of a named entry. It outlives the entry, so the
  // entry can be restored from it.
  await recordEntryHistory(database, data, {
    kind: 'deleted',
  });
}

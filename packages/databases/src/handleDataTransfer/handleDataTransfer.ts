import { getTransferData } from '@minddrop/utils';
import { createDatabaseEntryFromFile } from '../createDatabaseEntryFromFile';
import { createDatabaseEntryFromUrl } from '../createDatabaseEntryFromUrl';
import { DatabaseEntry } from '../types';
import { filterValidDatabaseFiles, filterValidDatabaseUrls } from '../utils';

/**
 * Handles a data transfer event on a database. Creating new entries from
 * files and URLs if they are supported by the database.
 *
 * @param databaseId - The ID of the database to handle the data transfer for.
 * @param event - The data transfer event to handle.
 */
export function handleDataTransfer(
  databaseId: string,
  event: DragEvent | React.DragEvent | React.ClipboardEvent | ClipboardEvent,
): Promise<DatabaseEntry[]> {
  // Promises for newly created entries
  const entryPromises: Promise<DatabaseEntry>[] = [];

  // Get the data from the event
  const data = getTransferData(event);

  // If the data transfer contains files, get valid files for the database
  if (data.files) {
    const { validFiles } = filterValidDatabaseFiles(
      databaseId,
      Array.from(data.files),
    );

    // Create a new entry for each valid file
    validFiles.forEach((file) => {
      entryPromises.push(createDatabaseEntryFromFile(databaseId, file));
    });
  }

  // If the data transfer contains URLs, create a new entry for each URL
  if (data.urls) {
    const { validUrls } = filterValidDatabaseUrls(databaseId, data.urls);

    validUrls.forEach((url) => {
      entryPromises.push(createDatabaseEntryFromUrl(databaseId, url));
    });
  }

  return Promise.all(entryPromises);
}

import { Properties } from '@minddrop/properties';
import { TransferData } from '@minddrop/utils';
import { createDatabaseEntryFromFile } from '../createDatabaseEntryFromFile';
import { createDatabaseEntryFromText } from '../createDatabaseEntryFromText';
import { createDatabaseEntryFromUrl } from '../createDatabaseEntryFromUrl';
import { getDatabase } from '../getDatabase';
import { DatabaseEntry } from '../types';
import {
  getDefaultFileProperty,
  getDefaultUrlProperty,
  resolveDefaultDatabaseIdForFile,
  resolveDefaultDatabaseIdForText,
  resolveDefaultDatabaseIdForUrl,
  resolveDefaultPropertyOfType,
} from '../utils';

/**
 * Creates entries from transfer data. Entries go in the target
 * database when it can hold the content, otherwise in the databases
 * configured for the content. Files take priority over URLs, and
 * URLs over text. Content with no configured database, or whose
 * database cannot hold it, is skipped.
 *
 * @param data - The transfer data to create entries from.
 * @param targetDatabaseId - The ID of the database to create the entries in, when it can hold them.
 * @returns The newly created entries.
 *
 * @throws {NotRegisteredError} If an entry serializer is not registered.
 *
 * @dispatches databases:entry:created
 */
export function createDatabaseEntriesFromTransferData(
  data: TransferData,
  targetDatabaseId?: string,
): Promise<DatabaseEntry[]> {
  // Promises for newly created entries
  const entryPromises: Promise<DatabaseEntry>[] = [];

  // Create an entry for each file which has a database
  if (data.files?.length) {
    data.files.forEach((file) => {
      // Resolve the file's database
      const databaseId = resolveDefaultDatabaseIdForFile(
        file.name,
        targetDatabaseId,
      );

      // Check the file has a database which exists and can hold it. If
      // not, skip the file.
      if (
        !databaseId ||
        !getDatabase(databaseId, false) ||
        !getDefaultFileProperty(databaseId, file.name)
      ) {
        return;
      }

      // Create the entry
      entryPromises.push(createDatabaseEntryFromFile(databaseId, file));
    });

    return Promise.all(entryPromises);
  }

  // Create an entry for each URL which has a database
  if (data.urls?.length) {
    data.urls.forEach((url) => {
      // Resolve the URL's database
      const databaseId = resolveDefaultDatabaseIdForUrl(url, targetDatabaseId);

      // Check the URL has a database which exists and can hold it. If
      // not, skip the URL.
      if (
        !databaseId ||
        !getDatabase(databaseId, false) ||
        !getDefaultUrlProperty(databaseId, url)
      ) {
        return;
      }

      // Create the entry
      entryPromises.push(createDatabaseEntryFromUrl(databaseId, url));
    });

    return Promise.all(entryPromises);
  }

  // Get the trimmed text
  const text = data['text/plain']?.trim();
  // Resolve the text's database
  const databaseId = resolveDefaultDatabaseIdForText(targetDatabaseId);

  // Check the text database exists and can hold the text. If so,
  // create an entry from it.
  if (
    text &&
    databaseId &&
    getDatabase(databaseId, false) &&
    resolveDefaultPropertyOfType(databaseId, Properties.schemas.content.type)
  ) {
    entryPromises.push(createDatabaseEntryFromText(databaseId, text));
  }

  return Promise.all(entryPromises);
}

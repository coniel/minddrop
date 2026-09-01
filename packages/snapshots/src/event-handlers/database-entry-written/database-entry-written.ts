import { DatabaseEntryWrittenEventData } from '@minddrop/databases';
import { Fs } from '@minddrop/file-system';
import { captureSnapshot } from '../../captureSnapshot';

/**
 * Called when a database entry's file is written. Captures the
 * contents the write replaced, which the event carries since the
 * file no longer holds them.
 */
export async function onDatabaseEntryWritten(
  data: DatabaseEntryWrittenEventData,
): Promise<void> {
  const { entry, database, previousContents } = data;

  // An entry written for the first time replaced nothing
  if (previousContents === undefined) {
    return;
  }

  // Entries are keyed by title within their database, as their
  // metadata sidecars are, so that history is unaffected by where
  // the database keeps the entry's file
  await captureSnapshot({
    ownerPath: database.path,
    subjectKey: entry.title,
    fileName: Fs.fileNameFromPath(entry.path),
    contents: previousContents,
    cause: 'edit',
  });
}

import { History } from '@minddrop/history';
import { ContentCapture } from '../contentCaptureRegistry';
import { Database, DatabaseEntry } from '../types';
import { resolveDatabaseEntryHistorySubject } from '../utils';

/**
 * Reads an entry's most recent content capture from its history.
 *
 * @param database - The entry's database.
 * @param entry - The entry to read the capture of.
 * @returns The most recent capture, or null if the entry has none.
 */
export async function readDatabaseEntryLastContentCapture(
  database: Database,
  entry: DatabaseEntry,
): Promise<ContentCapture | null> {
  // Read the entry's history
  const records = await History.read(
    resolveDatabaseEntryHistorySubject(database, entry),
  );

  // Find the most recent content record. The history is read oldest
  // first, so the last one is the most recent.
  const captures = records.filter((record) => record.kind === 'content');
  const last = captures[captures.length - 1];

  // Check the entry has had its content captured before
  if (!last) {
    return null;
  }

  // Build the capture from the record
  return { capturedAt: last.timestamp, contentHash: last.contentHash };
}

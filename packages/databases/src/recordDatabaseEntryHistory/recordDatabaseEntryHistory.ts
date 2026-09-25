import { History, HistoryRecord, HistoryRecordInput } from '@minddrop/history';
import { Database, DatabaseEntry } from '../types';
import { resolveDatabaseEntryHistorySubject } from '../utils';

/**
 * Records a change against a database entry's history.
 *
 * @param database - The entry's database.
 * @param entry - The entry to record the change against.
 * @param record - The change to record.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The recorded change.
 */
export async function recordDatabaseEntryHistory(
  database: Database,
  entry: DatabaseEntry,
  record: HistoryRecordInput,
  workspacePath?: string,
): Promise<HistoryRecord> {
  // Record the change against the entry's history subject
  return History.record({
    // The entry's history subject
    ...resolveDatabaseEntryHistorySubject(database, entry, workspacePath),
    // The change
    ...record,
  });
}

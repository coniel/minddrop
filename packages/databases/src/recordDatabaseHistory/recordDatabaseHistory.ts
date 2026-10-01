import { History, HistoryRecord, HistoryRecordInput } from '@minddrop/history';
import { Database } from '../types';
import { resolveDatabaseHistorySubject } from '../utils';

/**
 * Records a change against a database's own history.
 *
 * @param database - The database to record the change against.
 * @param record - The change to record.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The recorded change.
 */
export async function recordDatabaseHistory(
  database: Database,
  record: HistoryRecordInput,
  workspacePath?: string,
): Promise<HistoryRecord> {
  // Record the change against the database's history subject
  return History.record({
    // The database's history subject
    ...resolveDatabaseHistorySubject(database, workspacePath),
    // The change
    ...record,
  });
}

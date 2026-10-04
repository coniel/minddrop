import { HistorySubject } from '@minddrop/history';
import { EntryHistorySubjectType } from '../../constants';
import { Database, Entry } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';

/**
 * Resolves the history subject of a database entry.
 *
 * @param database - The entry's database.
 * @param entry - The entry to resolve the subject of.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The entry's history subject.
 */
export function resolveEntryHistorySubject(
  database: Database,
  entry: Entry,
  workspacePath?: string,
): HistorySubject {
  return {
    // The database's directory
    ownerPath: resolveDatabasePath(database, workspacePath),
    // The entry subject type
    subjectType: EntryHistorySubjectType,
    // The entry's title
    subjectKey: entry.title,
  };
}

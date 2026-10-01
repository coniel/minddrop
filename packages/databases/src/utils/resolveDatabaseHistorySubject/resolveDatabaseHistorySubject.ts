import { HistorySubject } from '@minddrop/history';
import { DatabaseHistorySubjectType } from '../../constants';
import { Database } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';

/**
 * Resolves the history subject of a database's own history.
 *
 * @param database - The database to resolve the subject of.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The database's history subject.
 */
export function resolveDatabaseHistorySubject(
  database: Database,
  workspacePath?: string,
): HistorySubject {
  return {
    // The database's directory
    ownerPath: resolveDatabasePath(database, workspacePath),
    // The database subject type. A database's own history has no
    // subject key.
    subjectType: DatabaseHistorySubjectType,
  };
}

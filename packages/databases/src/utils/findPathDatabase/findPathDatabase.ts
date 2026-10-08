import { Fs } from '@minddrop/file-system';
import { getAllDatabases } from '../../getAllDatabases';
import { Database } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';

/**
 * Finds the database whose directory is, or contains, the given path.
 *
 * @param path - The absolute path.
 * @param workspacePath - The workspace path. Defaults to the active
 *   workspace.
 * @param workspaceId - The ID of the workspace whose databases to search.
 *   Defaults to the active workspace.
 * @returns The database, or null if the path is in no database.
 */
export function findPathDatabase(
  path: string,
  workspacePath?: string,
  workspaceId?: string,
): Database | null {
  // Find the database whose directory is, or contains, the path
  return (
    getAllDatabases(workspaceId).find((database) => {
      // Resolve the database directory's path
      const databasePath = resolveDatabasePath(database, workspacePath);

      // Match the directory itself or any path inside it
      return Fs.isAtOrUnder(path, databasePath);
    }) ?? null
  );
}

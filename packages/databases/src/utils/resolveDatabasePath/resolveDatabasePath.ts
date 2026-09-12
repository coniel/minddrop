import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { Database } from '../../types';

/**
 * Resolves a database's file system path from its workspace relative
 * path.
 *
 * @param database - The database to resolve the path of, or its workspace relative path.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the database directory.
 */
export function resolveDatabasePath(
  database: Database | string,
  workspacePath?: string,
): string {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  const path = typeof database === 'string' ? database : database.path;

  return Fs.concatPath(rootPath, path);
}

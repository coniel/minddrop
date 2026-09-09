import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Database } from '../../types';

/**
 * Resolves a database's file system path from its workspace relative
 * path.
 *
 * Anchored on `Paths.workspace` rather than the active workspace: the
 * backend resolves paths too, and it runs without the workspaces store,
 * setting `Paths.workspace` from the root it is handed instead.
 *
 * @param database - The database to resolve the path of, or its workspace relative path.
 * @param workspacePath - The workspace the path is relative to. Defaults to the one this session is running on.
 * @returns The path to the database directory.
 */
export function resolveDatabasePath(
  database: Database | string,
  workspacePath: string = Paths.workspace,
): string {
  const path = typeof database === 'string' ? database : database.path;

  return Fs.concatPath(workspacePath, path);
}

import { resolveDatabaseContentViewsDirPath } from './resolveDatabaseContentViewsDirPath';

/**
 * Generates the path to a database-owned view's file inside the
 * database's views directory.
 *
 * @param databasePath - The database directory path.
 * @param viewId - The ID of the view.
 *
 * @returns The path to the view file.
 */
export function resolveDatabaseViewFilePath(
  databasePath: string,
  viewId: string,
): string {
  return `${resolveDatabaseContentViewsDirPath(databasePath)}/${viewId}.json`;
}

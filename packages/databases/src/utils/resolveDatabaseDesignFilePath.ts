import { resolveDatabaseDesignsDirPath } from './resolveDatabaseDesignsDirPath';

/**
 * Generates the path to a database-owned design's file inside the
 * database's designs directory.
 *
 * @param databasePath - The database directory path.
 * @param designId - The ID of the design.
 *
 * @returns The path to the design file.
 */
export function resolveDatabaseDesignFilePath(
  databasePath: string,
  designId: string,
): string {
  return `${resolveDatabaseDesignsDirPath(databasePath)}/${designId}.json`;
}

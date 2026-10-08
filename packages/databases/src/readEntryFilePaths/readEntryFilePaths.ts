import { Fs } from '@minddrop/file-system';
import { Database } from '../types';
import { isEntryFilePath, resolveDatabasePath } from '../utils';

export interface ReadEntryFilePathsOptions {
  /**
   * The workspace path. Defaults to the active workspace.
   */
  workspacePath?: string;

  /**
   * The absolute path of a directory inside the database directory to
   * list the entry files of. Defaults to the database directory.
   */
  dirPath?: string;
}

/**
 * Reads the paths of the entry files in a database directory, or in one
 * of its subdirectories, without reading the files themselves.
 *
 * @param database - The database whose entry file paths to read.
 * @param options - Read options.
 * @returns The entry files' paths, relative to the database directory.
 */
export async function readEntryFilePaths(
  database: Database,
  options: ReadEntryFilePathsOptions = {},
): Promise<string[]> {
  // Resolve the database directory's path
  const databasePath = resolveDatabasePath(database, options.workspacePath);
  // Resolve the directory to list
  const dirPath = options.dirPath ?? databasePath;
  // Resolve the directory's path relative to the database directory
  const dirRelativePath = Fs.relativePath(databasePath, dirPath);
  // Count the directory's levels below the database directory
  const dirLevels = dirRelativePath ? dirRelativePath.split('/').length : 0;
  // Count the levels below the directory at which entry files can lie.
  // Entry storage databases put each entry in its own directory. Their
  // entry files are one level further down.
  const entryFileLevels =
    (database.propertyFileStorage === 'entry' ? 2 : 1) - dirLevels;

  // Skip a directory too deep to hold entry files
  if (entryFileLevels < 1) {
    return [];
  }

  // Check if the directory's subdirectories may hold entry files
  const hasEntrySubdirs = entryFileLevels > 1;

  // List the directory's files
  let files = await Fs.readDir(dirPath, {
    recursive: hasEntrySubdirs,
  });

  // If the subdirectories may hold entry files, add their files
  if (hasEntrySubdirs) {
    // Filter for non-empty, non-hidden subdirectories
    const entrySubdirectories = files.filter(
      (file) =>
        'children' in file &&
        file.children?.length &&
        !file.name?.startsWith('.'),
    );

    // Add each subdirectory's files to the listed files
    files = entrySubdirectories.reduce(
      (collected, entrySubdirectory) =>
        collected.concat(entrySubdirectory.children || []),
      files,
    );
  }

  // Resolve the files' paths relative to the database and filter for
  // entry files.
  return files
    .map((file) => Fs.relativePath(databasePath, file.path))
    .filter((path) => isEntryFilePath(path, database));
}

import { Fs } from '@minddrop/file-system';
import { EntrySerializersRegistry } from '../EntrySerializersRegistry';
import { readEntry } from '../readEntry';
import { Database, Entry } from '../types';
import { resolveDatabasePath, resolveEntryPath } from '../utils';

export interface ReadEntriesResult {
  /**
   * The deserialized entries.
   */
  entries: Entry[];

  /**
   * Paths of the entry files whose contents match their indexed
   * hash, which are not deserialized, relative to the database
   * directory.
   */
  unchangedPaths: string[];

  /**
   * Paths of the entry files which could not be read or
   * deserialized, relative to the database directory.
   */
  unreadablePaths: string[];
}

/**
 * Reads all entry files from a database directory, returning the
 * deserialized entries and the paths of the files which could not
 * be read. Files whose contents match their indexed hash are not
 * deserialized and are reported as unchanged instead.
 *
 * @param database - The database to read entries from.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @param indexedHashes - The indexed content hashes of the database's entries, keyed by entry path.
 * @returns The changed entries and the paths of the unchanged and unreadable entry files.
 */
export async function readEntries(
  database: Database,
  workspacePath?: string,
  indexedHashes?: Map<string, string>,
): Promise<ReadEntriesResult> {
  const hasEntrySubdirs = database.propertyFileStorage === 'entry';
  const databasePath = resolveDatabasePath(database, workspacePath);

  // Read the database's entry files
  let files = await Fs.readDir(databasePath, {
    recursive: hasEntrySubdirs,
  });

  // If the database uses entry-based storage, read the files
  // from the entry subdirectories.
  if (hasEntrySubdirs) {
    const entrySubdirectories = files.filter(
      (file) =>
        'children' in file &&
        file.children?.length &&
        !file.name?.startsWith('.'),
    );

    files = entrySubdirectories.reduce(
      (acc, entrySubdirectory) => acc.concat(entrySubdirectory.children || []),
      files,
    );
  }

  // Get the database's entry serializer
  const serializer = EntrySerializersRegistry.get(database.entrySerializer);

  // Only include the serializer's expected file type
  files = files.filter((file) =>
    file.path.endsWith(`.${serializer.fileExtension}`),
  );

  // Entry paths are addressed from their database
  const paths = files.map((file) => Fs.relativePath(databasePath, file.path));

  // Read the entries, skipping the deserialization of those whose
  // contents match their indexed hash.
  const results = await Promise.all(
    paths.map(async (path) => {
      const indexedHash = indexedHashes?.get(path);

      if (
        indexedHash !== undefined &&
        (await hashEntryFile(
          resolveEntryPath(path, database, workspacePath),
        )) === indexedHash
      ) {
        return 'unchanged';
      }

      return readEntry(path, database, serializer, workspacePath);
    }),
  );

  const entries: Entry[] = [];
  const unchangedPaths: string[] = [];
  const unreadablePaths: string[] = [];

  results.forEach((result, index) => {
    if (result === 'unchanged') {
      unchangedPaths.push(paths[index]);
    } else if (result) {
      entries.push(result);
    } else {
      unreadablePaths.push(paths[index]);
    }
  });

  return { entries, unchangedPaths, unreadablePaths };
}

/**
 * Returns the hash of an entry file's contents, or null if the file
 * cannot be read.
 */
async function hashEntryFile(filePath: string): Promise<string | null> {
  try {
    return Fs.hashContents(await Fs.readTextFile(filePath));
  } catch {
    return null;
  }
}

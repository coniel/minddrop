import { Fs } from '@minddrop/file-system';
import { EntrySerializersRegistry } from '../EntrySerializersRegistry';
import { readEntryIfChanged } from '../readEntryIfChanged';
import { Database, Entry } from '../types';
import { isEntryFilePath, resolveDatabasePath } from '../utils';

export interface ReadEntriesResult {
  /**
   * The deserialized entries.
   */
  entries: Entry[];

  /**
   * Paths of the entry files whose contents match their indexed
   * hash, relative to the database directory. These are not
   * deserialized.
   */
  unchangedPaths: string[];

  /**
   * Paths of the entry files which could not be read or
   * deserialized, relative to the database directory.
   */
  unreadablePaths: string[];
}

export interface ReadEntriesOptions {
  /**
   * The workspace path. Defaults to the active workspace.
   */
  workspacePath?: string;

  /**
   * The indexed content hashes of the database's entries, keyed by
   * entry path. Entries whose contents match are not deserialized.
   */
  indexedHashes?: Map<string, string>;
}

/**
 * Reads all entry files from a database directory. Files whose
 * contents match their indexed hash are not deserialized.
 *
 * @param database - The database to read entries from.
 * @param options - Read options.
 * @returns The changed entries, and the paths of the unchanged and
 *   unreadable entry files.
 */
export async function readEntries(
  database: Database,
  options?: ReadEntriesOptions,
): Promise<ReadEntriesResult> {
  const workspacePath = options?.workspacePath;
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

  // Resolve the entry files' paths relative to their database
  const paths = files
    .map((file) => Fs.relativePath(databasePath, file.path))
    .filter((path) => isEntryFilePath(path, database));

  // Read the entries, skipping the deserialization of those whose
  // contents match their indexed hash.
  const results = await Promise.all(
    paths.map((path) =>
      readEntryIfChanged(path, database, serializer, {
        workspacePath,
        indexedHash: options?.indexedHashes?.get(path),
      }),
    ),
  );

  // Entries which were deserialized
  const entries: Entry[] = [];
  // Paths of the entries matching their indexed hash
  const unchangedPaths: string[] = [];
  // Paths of the entries which could not be read
  const unreadablePaths: string[] = [];

  // Sort the results by their status
  results.forEach((result, index) => {
    if (result.status === 'changed') {
      entries.push(result.entry);
    } else if (result.status === 'unchanged') {
      unchangedPaths.push(paths[index]);
    } else {
      unreadablePaths.push(paths[index]);
    }
  });

  return { entries, unchangedPaths, unreadablePaths };
}

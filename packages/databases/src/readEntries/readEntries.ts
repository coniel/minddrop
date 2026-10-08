import { EntrySerializersRegistry } from '../EntrySerializersRegistry';
import { readEntryFilePaths } from '../readEntryFilePaths';
import { readEntryIfChanged } from '../readEntryIfChanged';
import { Database, Entry } from '../types';

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

  // Get the database's entry serializer
  const serializer = EntrySerializersRegistry.get(database.entrySerializer);

  // List the database's entry files
  const paths = await readEntryFilePaths(database, { workspacePath });

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

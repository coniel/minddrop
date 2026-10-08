import { Fs } from '@minddrop/file-system';
import { readEntry } from '../readEntry';
import { Database, Entry, EntrySerializer } from '../types';
import { resolveEntryPath } from '../utils';

export type ReadEntryIfChangedResult =
  | { status: 'changed'; entry: Entry }
  | { status: 'unchanged' }
  | { status: 'unreadable' };

export interface ReadEntryIfChangedOptions {
  /**
   * The workspace path. Defaults to the active workspace.
   */
  workspacePath?: string;

  /**
   * The entry's indexed content hash, if it is indexed.
   */
  indexedHash?: string;
}

/**
 * Reads a database entry from the file system, unless its contents
 * match its indexed hash.
 *
 * @param path - The entry file's path, relative to its database.
 * @param database - The database the entry belongs to.
 * @param entrySerializer - The entry serializer used to deserialize the entry.
 * @param options - Read options.
 * @returns The read entry, or whether it was unchanged or could not be read.
 */
export async function readEntryIfChanged(
  path: string,
  database: Database,
  entrySerializer: EntrySerializer,
  options?: ReadEntryIfChangedOptions,
): Promise<ReadEntryIfChangedResult> {
  const { workspacePath, indexedHash } = options ?? {};

  // Check if an indexed entry's contents are unchanged
  if (indexedHash !== undefined) {
    // Hash the entry file's contents
    const contentHash = await hashEntryFile(
      resolveEntryPath(path, database, workspacePath),
    );

    // Skip the read if the contents match the indexed hash
    if (contentHash === indexedHash) {
      return { status: 'unchanged' };
    }
  }

  // Read the entry
  const entry = await readEntry(path, database, entrySerializer, workspacePath);

  // Report the entry as unreadable if it could not be read
  if (!entry) {
    return { status: 'unreadable' };
  }

  return { status: 'changed', entry };
}

/**
 * Hashes an entry file's contents.
 *
 * @param filePath - The absolute path of the entry file.
 * @returns The contents' hash, or null if the file cannot be read.
 */
async function hashEntryFile(filePath: string): Promise<string | null> {
  try {
    return Fs.hashContents(await Fs.readTextFile(filePath));
  } catch {
    return null;
  }
}

import { Entry } from '../types';
import { entryFilePath } from './fixtures';
import { MockFs } from './setup-tests';

/**
 * Appends text to an entry file's body, as an external editor would.
 *
 * @param entry - The fixture entry whose file to append to.
 */
export function appendToEntryFile(
  entry: Pick<Entry, 'database' | 'path'>,
): void {
  // Resolve the entry file's path
  const path = entryFilePath(entry);

  // Append the text to the file's contents
  MockFs.writeTextFile(
    path,
    `${MockFs.readTextFile(path)}\n\nAdded externally`,
  );
}

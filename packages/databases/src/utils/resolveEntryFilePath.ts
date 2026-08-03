import { Fs } from '@minddrop/file-system';
import { PropertyFileStorage } from '../types';

/**
 * Resolves the path to an entry's file for a given storage mode. In `entry`
 * mode the entry is wrapped in a directory named after its title; all other
 * modes keep the entry file loose in the database root.
 *
 * @param databasePath - The database directory path.
 * @param mode - The property file storage mode.
 * @param title - The entry title.
 * @param fileExtension - The entry file's extension.
 * @returns The resolved entry file path.
 */
export function resolveEntryFilePath(
  databasePath: string,
  mode: PropertyFileStorage,
  title: string,
  fileExtension: string,
): string {
  // Entry storage wraps the file in a per-entry directory
  if (mode === 'entry') {
    return Fs.concatPath(databasePath, title, `${title}.${fileExtension}`);
  }

  // All other modes keep the file loose in the database root
  return Fs.concatPath(databasePath, `${title}.${fileExtension}`);
}

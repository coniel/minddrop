import { Fs } from '@minddrop/file-system';
import {
  DatabaseEntryTemplate,
  DatabaseFileReadResult,
  DatabaseId,
} from '../types';
import { isStoredDatabaseEntryTemplate } from '../utils';

/**
 * Reads an entry template from its config file, with its database's
 * ID attached.
 *
 * @param path - The path to the template's config file.
 * @param databaseId - The ID of the database the template belongs to.
 * @returns The entry template, or whether its config file is missing
 *   or cannot be read.
 */
export async function readDatabaseEntryTemplate(
  path: string,
  databaseId: DatabaseId,
): Promise<DatabaseFileReadResult<DatabaseEntryTemplate>> {
  // Check the template's config file exists
  if (!(await Fs.exists(path))) {
    return { status: 'missing' };
  }

  // Contents as read from the file
  let contents: unknown;

  try {
    // Read the template's config file
    contents = await Fs.readJsonFile(path);
  } catch {
    // Report a file which is not valid JSON as unreadable
    return { status: 'unreadable' };
  }

  // Report a file which is not a template as unreadable
  if (!isStoredDatabaseEntryTemplate(contents)) {
    return { status: 'unreadable' };
  }

  // Attach the database ID. It is derived from the file's location.
  return { status: 'read', value: { ...contents, database: databaseId } };
}

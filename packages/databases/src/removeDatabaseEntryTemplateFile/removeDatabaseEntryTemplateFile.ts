import { Fs } from '@minddrop/file-system';
import { resolveEntryTemplateFilePath } from '../utils';

/**
 * Deletes a file stored in an entry template's directory. Does
 * nothing if the file does not exist.
 *
 * @param databasePath - The database directory path.
 * @param templateId - The ID of the entry template.
 * @param fileName - The name of the file.
 */
export async function removeDatabaseEntryTemplateFile(
  databasePath: string,
  templateId: string,
  fileName: string,
): Promise<void> {
  // Resolve the file's path
  const path = resolveEntryTemplateFilePath(databasePath, templateId, fileName);

  // Check if the file exists. If so, delete it.
  if (await Fs.exists(path)) {
    await Fs.removeFile(path);
  }
}

import { Fs } from '@minddrop/file-system';
import { ensurePropertyFileDirExists } from '../ensurePropertyFileDirExists';
import { getEntry } from '../getEntry';
import { updateEntryProperty } from '../updateEntryProperty';
import { resolveIncrementalPropertyFilePath } from '../utils';

/**
 * Writes an entry property's file to the correct location based on the
 * database's property file storage configuration. Ensures that the file
 * path does not conflict with an existing file and creates any necessary
 * subdirectories.
 *
 * Optionally updates the entry's property value after writing.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @param file - The file to write.
 * @param updateEntry - Whether to set the file as the property's value after writing.
 * @returns The path to the written file.
 */
export async function writePropertyFile(
  entryId: string,
  propertyName: string,
  file: File,
  updateEntry = true,
): Promise<string> {
  // Get the entry
  const entry = getEntry(entryId);

  // Ensure the file's destination directory exists
  await ensurePropertyFileDirExists(entry.id, propertyName);

  // Get the path to which to write the file
  const { path, name } = await resolveIncrementalPropertyFilePath(
    entry.id,
    propertyName,
    file.name,
  );

  // Write the file
  await Fs.writeBinaryFile(path, file);

  if (updateEntry) {
    // Update the entry's property value
    await updateEntryProperty(entry.id, propertyName, name);
  }

  return path;
}

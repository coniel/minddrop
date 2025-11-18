import { Fs } from '@minddrop/file-system';
import { PropertiesDirName } from '../constants';

/**
 * Generates the path to a file based entry's properties file.
 *
 * @param path - The entry path.
 * @param fileExtension - The file extension specified by the entry serializer.
 *
 * @returns The file path for the entry's properties file.
 */
export function fileEntryPropertiesFilePath(
  path: string,
  fileExtension: string,
): string {
  // Get the entry file name without the extension
  const entryFileNameWithoutExt = Fs.removeExtension(Fs.fileNameFromPath(path));
  // Path to the entry's parent directory
  const entryParentPath = Fs.parentDirPath(path);

  return `${entryParentPath}/${PropertiesDirName}/${entryFileNameWithoutExt}.${fileExtension}`;
}

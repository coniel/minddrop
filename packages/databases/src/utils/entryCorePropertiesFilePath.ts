import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { PropertiesDirName } from '../constants';

/**
 * Generates the path to an entry's core properties file.
 *
 * @param path - The entry path.
 *
 * @returns The file path for the entry's core properties file.
 */
export function entryCorePropertiesFilePath(path: string): string {
  // Get the entry file name without the extension
  const entryFileNameWithoutExt = Fs.removeExtension(Fs.fileNameFromPath(path));
  // Path to the entry's parent directory
  let entryParentPath = Fs.parentDirPath(path);

  // If the entry's parent directory is the same as the entry file name,
  // the entry is stored in an entry subdirectory which we need to remove.
  // TODO: Improve this logic, as it will break if the entry title is the same
  // as the database name.
  if (entryParentPath.endsWith(entryFileNameWithoutExt)) {
    entryParentPath = Fs.parentDirPath(entryParentPath);
  }

  return `${entryParentPath}/${Paths.hiddenDirName}/${PropertiesDirName}/${entryFileNameWithoutExt}.yaml`;
}

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
  const entryParentPath = Fs.parentDirPath(path);

  return `${entryParentPath}/${Paths.hiddenDirName}/${PropertiesDirName}/${entryFileNameWithoutExt}.yaml`;
}

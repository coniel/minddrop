import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { AssetsDirName } from '../constants';

/**
 * Generates the path to an entry's assets directory.
 *
 * @param path - The entry path.
 *
 * @returns The path to the entry's assets directory.
 */
export function entryAssetsDirPath(path: string): string {
  // Get the entry file name without the extension
  const entryFileNameWithoutExt = Fs.removeExtension(Fs.fileNameFromPath(path));
  // Path to the entry's parent directory
  const entryParentPath = Fs.parentDirPath(path);

  return `${entryParentPath}/${Paths.hiddenDirName}/${AssetsDirName}/${entryFileNameWithoutExt}`;
}

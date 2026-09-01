import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { HistoryDirName } from '../constants';

/**
 * Returns the absolute path of an owner's history directory, which
 * holds one subdirectory per subject.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @returns The absolute history directory path.
 */
export function resolveHistoryDirPath(ownerPath: string): string {
  return Fs.concatPath(ownerPath, Paths.hiddenDirName, HistoryDirName);
}

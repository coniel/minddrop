import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { RenamesDirName } from '../constants';

/**
 * Returns the absolute path of the workspace's rename ledger
 * directory.
 */
export function resolveRenamesDirPath(): string {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, RenamesDirName);
}

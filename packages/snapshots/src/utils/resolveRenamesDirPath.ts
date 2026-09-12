import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { RenamesDirName } from '../constants';

/**
 * Returns the absolute path of a workspace's rename ledger
 * directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 */
export function resolveRenamesDirPath(workspacePath?: string): string {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, RenamesDirName);
}

import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { SpacesDirName } from '../constants';

/**
 * Returns the path to a workspace's spaces directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the spaces directory.
 */
export function resolveSpacesDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, SpacesDirName);
}

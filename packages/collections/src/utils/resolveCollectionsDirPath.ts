import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { CollectionsDirName } from '../constants';

/**
 * Returns the path to a workspace's collections directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the collections directory.
 */
export function resolveCollectionsDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, CollectionsDirName);
}

import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { QueriesDirName } from '../constants';

/**
 * Returns the path to a workspace's queries directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the queries directory.
 */
export function resolveQueriesDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, QueriesDirName);
}

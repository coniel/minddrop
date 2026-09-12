import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { ViewsDirName } from '../constants';

/**
 * Returns the path to a workspace's data views directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the data views directory.
 */
export function resolveViewsDirPath(workspacePath?: string): string {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, ViewsDirName);
}

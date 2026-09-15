import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { ContentViewsDirName } from '../constants';

/**
 * Returns the path to a workspace's content views directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the content views directory.
 */
export function resolveContentViewsDirPath(workspacePath?: string): string {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, ContentViewsDirName);
}

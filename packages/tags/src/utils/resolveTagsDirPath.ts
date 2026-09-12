import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { TagsDirName } from '../constants';

/**
 * Returns the path to a workspace's tags directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the tags directory.
 */
export function resolveTagsDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, TagsDirName);
}

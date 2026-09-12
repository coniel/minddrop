import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { TagGroupsDirName } from '../constants';

/**
 * Returns the path to a workspace's tag groups directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the tag groups directory.
 */
export function resolveTagGroupsDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, TagGroupsDirName);
}

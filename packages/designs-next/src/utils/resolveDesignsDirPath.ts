import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { DesignsDirName } from '../constants';

/**
 * Returns the path to a workspace's designs directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the designs directory.
 */
export function resolveDesignsDirPath(workspacePath?: string): string {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, DesignsDirName);
}

import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { AutomationsDirName } from '../constants';

/**
 * Returns the path to a workspace's automations directory.
 *
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the automations directory.
 */
export function resolveAutomationsDirPath(workspacePath?: string) {
  const rootPath = workspacePath ?? Workspaces.getActive().path;

  return Fs.concatPath(rootPath, Paths.hiddenDirName, AutomationsDirName);
}

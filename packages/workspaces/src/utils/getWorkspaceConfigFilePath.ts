import { Paths } from '@minddrop/utils';

/**
 * Returns the path to the workspace config file inside the hidden config directory.
 *
 * @param workspacePath - The path to the workspace root directory.
 * @returns The path to the workspace config file.
 */
export function getWorkspaceConfigFilePath(workspacePath: string): string {
  return `${workspacePath}/${Paths.hiddenDirName}/workspace.json`;
}

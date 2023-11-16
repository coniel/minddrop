import { Fs } from '@minddrop/file-system';
import { WorkspacesConfigDir, WorkspacesConfigFileName } from '../constants';

/**
 * Checks if the workspaces config file exists.
 *
 * @returns boolean indicating whether the file exists.
 */
export async function hasWorkspacesConfig(): Promise<boolean> {
  // Check if workspace configs file exists
  return Fs.exists(WorkspacesConfigFileName, { dir: WorkspacesConfigDir });
}

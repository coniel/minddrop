import { Fs } from '@minddrop/file-system';
import { MissingWorkspaceConfig } from '../constants';
import { getWorkspaceConfig } from '../getWorkspaceConfig';
import { Workspace } from '../types';
import { workspaceExists } from '../workspaceExists';

/**
 * Creates a workspace object from a directory.
 *
 * @param path - The absolute path to the workspace directory.
 * @returns A workspace object.
 */
export async function getWorkspaceFromPath(path: string): Promise<Workspace> {
  let config = MissingWorkspaceConfig;

  // Check if the workspace path exists
  const exists = await workspaceExists(path);

  // If the workspace dir exists, get its config
  if (exists) {
    config = await getWorkspaceConfig(path);
  }

  return {
    path,
    exists,
    name: Fs.fileNameFromPath(path),
    ...config,
  };
}

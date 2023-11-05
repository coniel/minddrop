import { Workspace } from '../types';
import { workspaceExists } from '../workspaceExists';

/**
 * Creates a workspace object from a directory.
 *
 * @param path - The absolute path to the workspace directory.
 * @returns A workspace object.
 */
export async function getWorkspaceFromPath(path: string): Promise<Workspace> {
  const exists = await workspaceExists(path);

  return {
    path,
    exists,
    name: path.split('/').slice(-1)[0],
  };
}

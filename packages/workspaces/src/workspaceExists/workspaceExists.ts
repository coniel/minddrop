import { Fs } from '@minddrop/file-system';

/**
 * Checks whether a workspace directory exists.
 *
 * @params path - The workspace path.
 * @returns boolean indicating whether the workspace exists.
 */
export async function workspaceExists(path: string): Promise<boolean> {
  return Fs.exists(path);
}

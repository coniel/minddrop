import { readWorkspaceConfig } from '../../readWorkspaceConfig';

/**
 * Checks whether a directory is a workspace, meaning it contains a
 * readable workspace config file.
 *
 * @param path - The path to the directory.
 * @returns Whether the directory is a workspace.
 */
export async function isWorkspaceDirectory(path: string): Promise<boolean> {
  try {
    const workspace = await readWorkspaceConfig(path, false);

    return !!workspace?.name;
  } catch {
    // The config file exists, but could not be parsed
    return false;
  }
}

import { Utils } from 'electrobun/bun';

const WORKSPACES_CONFIG_FILE = `${Utils.paths.config}/MindDrop/workspaces.json`;

/**
 * Returns whether the app has at least one workspace whose directory
 * still exists on the file system.
 */
export async function hasWorkspace(): Promise<boolean> {
  let paths: string[];

  try {
    const config = JSON.parse(
      await Bun.file(WORKSPACES_CONFIG_FILE).text(),
    ) as { paths?: string[] };

    paths = config.paths ?? [];
  } catch {
    // The config file is missing or unreadable, so there are no workspaces
    return false;
  }

  // Check the workspace directories, ignoring those that have been
  // deleted or moved since they were added
  const existingPaths = await Promise.all(
    paths.map((path) => Bun.file(`${path}/.minddrop/workspace.json`).exists()),
  );

  return existingPaths.some(Boolean);
}

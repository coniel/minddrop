import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { DesignFileExtension } from '../constants';
import { loadDesigns } from '../loadDesigns';
import { readDesign } from '../readDesign';
import { resolveDesignsDirPath } from '../utils';

/**
 * Loads a workspace's designs by reading the design files in its
 * designs directory into the workspace's store record.
 *
 * @param workspace - The workspace whose designs to load.
 *
 * @dispatches designs-next:loaded
 */
export async function loadWorkspaceDesigns(
  workspace: Workspace,
): Promise<void> {
  const designsDirPath = resolveDesignsDirPath(workspace.path);

  // Nothing to read if the designs directory does not exist yet.
  // The loaded event still fires so that listeners waiting on it
  // are not left hanging in a workspace with no designs.
  if (!(await Fs.exists(designsDirPath))) {
    loadDesigns([], workspace.id);

    return;
  }

  // Read the entries in the designs directory
  const entries = await Fs.readDir(designsDirPath);

  // Filter for design files
  const designFiles = entries.filter(
    (entry) => Fs.getFileExtension(entry.path) === DesignFileExtension,
  );

  // Read a design from each file, discarding files which are not
  // valid designs.
  const designs = (
    await Promise.all(designFiles.map((entry) => readDesign(entry.path)))
  ).filter((design) => design !== null);

  // Load the designs into the workspace's store record
  loadDesigns(designs, workspace.id);
}

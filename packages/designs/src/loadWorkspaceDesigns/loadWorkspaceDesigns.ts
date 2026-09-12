import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { readDesign } from '../readDesign';
import { resolveDesignsDirPath } from '../utils';

/**
 * Loads a workspace's designs by reading the design bundles in its
 * designs directory into the workspace's store record.
 *
 * @param workspace - The workspace whose designs to load.
 *
 * @dispatches designs:loaded
 */
export async function loadWorkspaceDesigns(
  workspace: Workspace,
): Promise<void> {
  const designsDirPath = resolveDesignsDirPath(workspace.path);

  // Nothing to load if the designs directory does not exist yet.
  // The loaded event still fires so that listeners waiting on it
  // are not left hanging in a workspace with no designs.
  if (!(await Fs.exists(designsDirPath))) {
    Events.dispatch(DesignsLoadedEvent, []);

    return;
  }

  // Read the entries in the designs directory
  const entries = await Fs.readDir(designsDirPath);

  // Read a design from each entry, discarding entries which are
  // not valid design bundles.
  const designs = (
    await Promise.all(entries.map((entry) => readDesign(entry.path)))
  ).filter((design) => design !== null);

  // Load the designs into the workspace's store record
  DesignsStore.in(workspace.id).load(designs);

  // Dispatch a designs loaded event
  Events.dispatch(DesignsLoadedEvent, designs);
}

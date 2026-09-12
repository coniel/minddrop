import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { SpacesStore } from '../SpacesStore';
import { SpacesLoadedEvent } from '../events';
import { readSpace } from '../readSpace';
import { resolveSpacesDirPath } from '../utils';

/**
 * Loads a workspace's spaces from its spaces directory into the
 * workspace's store record, along with their owned designs.
 *
 * If the spaces directory does not exist, it will be created.
 *
 * @param workspace - The workspace whose spaces to load.
 *
 * @dispatches spaces:loaded
 */
export async function loadWorkspaceSpaces(workspace: Workspace): Promise<void> {
  const spacesDirPath = resolveSpacesDirPath(workspace.path);

  // Ensure that the spaces directory exists
  await Fs.ensureDir(spacesDirPath);

  // Read the entries in the spaces directory
  const files = await Fs.readDir(spacesDirPath);

  // Read a space from each entry, discarding entries which are not
  // space bundles.
  const spacePromises = await Promise.all(
    files.map((file) => readSpace(file.path)),
  );

  // Filter out null spaces
  const spaces = spacePromises.filter((space) => space !== null);

  // Load the spaces into the workspace's store record
  SpacesStore.in(workspace.id).load(spaces);

  // Hydrate the spaces' owned designs into the designs store
  Designs.loadVirtual(
    spaces.map((space) => space.design),
    workspace.id,
  );

  // Dispatch a spaces loaded event
  Events.dispatch(SpacesLoadedEvent, spaces);
}

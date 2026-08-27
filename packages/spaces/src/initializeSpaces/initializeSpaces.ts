import { DesignUpdatedEvent, Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { FileSystemChangedEvent, Fs } from '@minddrop/file-system';
import { SpacesStore } from '../SpacesStore';
import { onFileSystemChanged, onUpdateVirtualDesign } from '../event-handlers';
import { SpacesLoadedEvent } from '../events';
import { readSpace } from '../readSpace';
import { resolveSpacesDirPath } from '../utils';

/**
 * Initializes spaces by loading space configs from the spaces
 * directory.
 *
 * If the spaces directory does not exist, it will be created.
 */
export async function initializeSpaces(): Promise<void> {
  const spacesDirPath = resolveSpacesDirPath();

  // Ensure that the spaces directory exists
  await Fs.ensureDir(spacesDirPath);

  // Read the entries in the spaces directory
  const files = await Fs.readDir(spacesDirPath);

  // Read a space from each entry, discarding entries which are not
  // space bundles
  const spacePromises = await Promise.all(
    files.map((file) => readSpace(file.path)),
  );

  // Filter out null spaces
  const spaces = spacePromises.filter((space) => space !== null);

  // Load the spaces into the store
  SpacesStore.load(spaces);

  // Hydrate the spaces' owned designs into the designs store
  Designs.loadVirtual(spaces.map((space) => space.design));

  // Apply changes made to space bundles outside of the app
  Events.on(FileSystemChangedEvent, 'spaces', ({ data }) =>
    onFileSystemChanged(data),
  );

  // Persist space owned design edits back into their space files
  Events.on(DesignUpdatedEvent, 'spaces', ({ data }) =>
    onUpdateVirtualDesign(data),
  );

  // Dispatch a spaces loaded event
  Events.dispatch(SpacesLoadedEvent, spaces);
}

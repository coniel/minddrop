import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { SpacesStore } from '../SpacesStore';
import { SpaceFileExtension } from '../constants';
import { SpacesLoadedEvent, SpacesLoadedEventData } from '../events';
import { readSpace } from '../readSpace';
import { getSpacesDirPath } from '../utils';

/**
 * Initializes spaces by loading space configs from the spaces
 * directory.
 *
 * If the spaces directory does not exist, it will be created.
 */
export async function initializeSpaces(): Promise<void> {
  const spacesDirPath = getSpacesDirPath();

  // Ensure that the spaces directory exists
  await Fs.ensureDir(spacesDirPath);

  // Load spaces from the spaces directory
  const files = await Fs.readDir(spacesDirPath);

  // Filter out files that are not space configs
  const spaceFilePaths = files
    .filter((file) => file.path.endsWith(SpaceFileExtension))
    .map((file) => file.path);

  // Read the space files
  const spacePromises = await Promise.all(
    spaceFilePaths.map((path) => readSpace(path)),
  );

  // Filter out null spaces
  const spaces = spacePromises.filter((space) => space !== null);

  // Load the spaces into the store
  SpacesStore.load(spaces);

  // Dispatch a spaces loaded event
  Events.dispatch<SpacesLoadedEventData>(SpacesLoadedEvent, spaces);
}

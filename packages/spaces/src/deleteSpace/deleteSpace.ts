import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { SpacesStore } from '../SpacesStore';
import { SpaceDeletedEvent } from '../events';
import { getSpace } from '../getSpace';
import { resolveSpaceBundleDirPath } from '../utils';

/**
 * Deletes a space, removing it from the store and deleting it from the
 * file system.
 *
 * @param spaceId - The ID of the space to delete.
 *
 * @dispatches spaces:space:deleted
 */
export async function deleteSpace(spaceId: string): Promise<void> {
  // Get the space
  const space = getSpace(spaceId);

  // Delete the space from the store
  SpacesStore.remove(spaceId);

  // Delete the space's bundle directory, taking its media with it
  await Fs.removeDir(resolveSpaceBundleDirPath(spaceId), { recursive: true });

  // Dispatch the space deleted event
  Events.dispatch(SpaceDeletedEvent, space);
}

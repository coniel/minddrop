import { Events } from '@minddrop/events';
import { SpacesStore } from '../SpacesStore';
import { SpaceUpdatedEvent } from '../events';
import { getSpace } from '../getSpace';
import { Space, UpdateSpaceData } from '../types';
import { writeSpace } from '../writeSpace';

/**
 * Updates a space, updating it in the store and writing it to the
 * file system.
 *
 * @param spaceId - The ID of the space to update.
 * @param data - The space data.
 * @returns The updated space.
 *
 * @dispatches 'spaces:space:updated' event
 */
export async function updateSpace(
  spaceId: string,
  data: UpdateSpaceData,
): Promise<Space> {
  // Get the space
  const space = getSpace(spaceId);

  // Update the space
  const updatedSpace: Space = {
    ...space,
    ...data,
    lastModified: new Date(),
  };

  // Update the space in the store
  SpacesStore.update(spaceId, updatedSpace);

  // Write the space config to the file system
  await writeSpace(spaceId);

  // Dispatch the space updated event
  Events.dispatch(SpaceUpdatedEvent, {
    original: space,
    updated: updatedSpace,
  });

  return updatedSpace;
}

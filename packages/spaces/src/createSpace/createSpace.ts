import { Designs, VirtualDesignData, buildLayout } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { SpacesStore } from '../SpacesStore';
import { DefaultSpaceIcon } from '../constants';
import { SpaceCreatedEvent } from '../events';
import { Space } from '../types';
import { writeSpace } from '../writeSpace';

export interface CreateSpaceOptions {
  /**
   * The name of the space. Defaults to 'Untitled'.
   */
  name?: string;

  /**
   * The space icon. Defaults to the default space icon.
   */
  icon?: string;
}

/**
 * Creates a new space, adding it to the store and writing it to the
 * file system. The space's design is registered as a virtual design
 * owned by the space.
 *
 * @param options - The space creation options.
 * @returns The created space.
 *
 * @dispatches spaces:space:created
 */
export async function createSpace(
  options: CreateSpaceOptions = {},
): Promise<Space> {
  const spaceId = entityId('space');
  const name = options.name || i18n.t('labels.untitled');

  // Seed the space's design with a single empty space layout
  const design: VirtualDesignData = {
    id: entityId('design'),
    type: 'space',
    name,
    owner: spaceId,
    layouts: [buildLayout('space')],
  };

  // Generate the space object
  const space: Space = {
    id: spaceId,
    created: new Date(),
    lastModified: new Date(),
    name,
    icon: options.icon || DefaultSpaceIcon,
    design,
  };

  // Add the space to the store
  SpacesStore.set(space);

  // Register the design as a virtual design owned by the space
  Designs.createVirtual(design);

  // Dispatch the space created event
  Events.dispatch(SpaceCreatedEvent, space);

  // Write the space config to the file system
  await writeSpace(space.id);

  return space;
}

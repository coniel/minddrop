import { DefaultPageLayout, Layout } from '@minddrop/designs-legacy';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { SpacesStore } from '../SpacesStore';
import { DefaultSpaceIcon } from '../constants';
import { SpaceCreatedEvent, SpaceCreatedEventData } from '../events';
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

  /**
   * The layout to base the space's layout on. Defaults to the
   * default space layout.
   */
  layout?: Layout;
}

/**
 * Creates a new space, adding it to the store and writing it to the
 * file system.
 *
 * @param options - The space creation options.
 * @returns The created space.
 *
 * @dispatches spaces:space:created
 */
export async function createSpace(
  options: CreateSpaceOptions = {},
): Promise<Space> {
  // Use the provided layout as the base, or the default space layout
  const baseLayout = options.layout || DefaultPageLayout;

  // Build the space's layout as an independent copy of the base
  // layout with its own ID
  const layout: Layout = {
    ...structuredClone(baseLayout),
    id: entityId('layout'),
    created: new Date(),
    lastModified: new Date(),
  };

  // The default space layout's name is an i18n key, translate it
  if (!options.layout) {
    layout.name = i18n.t('designs.layouts.page.name');
  }

  // Generate the space object
  const space: Space = {
    id: entityId('space'),
    created: new Date(),
    lastModified: new Date(),
    name: options.name || i18n.t('labels.untitled'),
    icon: options.icon || DefaultSpaceIcon,
    layout,
  };

  // Add the space to the store
  SpacesStore.set(space);

  // Write the space config to the file system
  await writeSpace(space.id);

  // Dispatch the space created event
  Events.dispatch<SpaceCreatedEventData>(SpaceCreatedEvent, space);

  return space;
}

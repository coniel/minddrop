import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { Design, VirtualDesignData } from '../types';

/**
 * Loads owner-persisted virtual designs into the store. Used by
 * owning entities to hydrate their designs at startup.
 *
 * @param data - The virtual designs to load.
 * @returns The loaded virtual designs.
 *
 * @dispatches 'designs:loaded'
 */
export function loadVirtualDesigns(data: VirtualDesignData[]): Design[] {
  // Derive the virtual flag and dates at load time. Spreading a
  // discriminated union erases the discrimination, so restore it.
  const designs = data.map(
    (item) =>
      ({
        ...item,
        virtual: true,
        created: new Date(),
        lastModified: new Date(),
      }) as Design,
  );

  // Load the designs into the store
  DesignsStore.load(designs);

  // Dispatch a designs loaded event
  Events.dispatch(DesignsLoadedEvent, designs);

  return designs;
}

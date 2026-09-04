import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { Design } from '../types';

/**
 * Loads designs into the store.
 *
 * @param designs - The designs to load.
 *
 * @dispatches designs-next:loaded
 */
export function loadDesigns(designs: Design[]): void {
  // Load the designs into the store
  DesignsStore.load(designs);

  // Dispatch a designs loaded event
  Events.dispatch(DesignsLoadedEvent, designs);
}

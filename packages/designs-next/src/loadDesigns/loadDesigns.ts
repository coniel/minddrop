import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { Design } from '../types';

/**
 * Loads designs into a workspace's store record.
 *
 * @param designs - The designs to load.
 * @param workspaceId - The ID of the workspace the designs belong to.
 *
 * @dispatches designs-next:loaded
 */
export function loadDesigns(designs: Design[], workspaceId: string): void {
  // Load the designs into the workspace's store record
  DesignsStore.in(workspaceId).load(designs);

  // Dispatch a designs loaded event
  Events.dispatch(DesignsLoadedEvent, designs);
}

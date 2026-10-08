import { DesignsStore } from '../DesignsStore';

/**
 * Removes a design from a workspace's store record without deleting
 * its file or dispatching a deleted event. Does nothing if the store
 * does not have the design.
 *
 * @param id - The ID of the design to unload.
 * @param workspaceId - The workspace the design belongs to. Omit for the active workspace.
 */
export function unloadDesign(id: string, workspaceId?: string): void {
  // Remove the design from the workspace's store record
  DesignsStore.in(workspaceId).remove(id);
}

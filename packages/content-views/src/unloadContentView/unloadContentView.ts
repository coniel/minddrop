import { ContentViewsStore } from '../ContentViewsStore';

/**
 * Removes a content view from a workspace's store record without
 * deleting its file or dispatching a deleted event. Does nothing if
 * the store does not have the view.
 *
 * @param id - The ID of the content view to unload.
 * @param workspaceId - The workspace the content view belongs to. Omit for the active workspace.
 */
export function unloadContentView(id: string, workspaceId?: string): void {
  // Remove the content view from the workspace's store record
  ContentViewsStore.in(workspaceId).remove(id);
}

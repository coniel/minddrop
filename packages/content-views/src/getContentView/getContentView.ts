import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewNotFoundError } from '../errors';
import { ContentView } from '../types';

/**
 * Retrieves a content view by ID.
 *
 * @param id - The ID of the content view to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the content view
 * is not found. Defaults to true.
 * @param workspaceId - The workspace the content view belongs to. Omit for the active workspace.
 * @returns The content view, or null if not found and throwOnNotFound
 * is false.
 *
 * @throws {ContentViewNotFoundError} If the content view is not found and
 * throwOnNotFound is true.
 */
export function getContentView(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): ContentView;
export function getContentView(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): ContentView | null;
export function getContentView(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): ContentView | null {
  // Get the content view from the workspace's store record
  const view = ContentViewsStore.in(workspaceId).get(id);

  // Throw an error if the content view does not exist
  if (!view && throwOnNotFound) {
    throw new ContentViewNotFoundError(id);
  }

  return view ?? null;
}

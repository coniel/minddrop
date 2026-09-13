import { DataViewsStore } from '../DataViewsStore';
import { DataViewNotFoundError } from '../errors';
import { DataView } from '../types';

/**
 * Retrieves a data view by ID.
 *
 * @param id - The ID of the data view to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the data view
 * is not found. Defaults to true.
 * @param workspaceId - The workspace the data view belongs to. Omit for the active workspace.
 * @returns The data view, or null if not found and throwOnNotFound
 * is false.
 *
 * @throws {DataViewNotFoundError} If the data view is not found and
 * throwOnNotFound is true.
 */
export function getDataView(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): DataView;
export function getDataView(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): DataView | null;
export function getDataView(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): DataView | null {
  // Get the data view from the workspace's store record
  const view = DataViewsStore.in(workspaceId).get(id);

  // Throw an error if the data view does not exist
  if (!view && throwOnNotFound) {
    throw new DataViewNotFoundError(id);
  }

  return view ?? null;
}

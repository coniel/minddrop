import { DataViewsStore } from '../DataViewsStore';
import { DataViewNotFoundError } from '../errors';
import { DataView } from '../types';

/**
 * Retrieves a data view by ID.
 *
 * @param id - The ID of the data view to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the data view
 * is not found. Defaults to true.
 * @returns The data view, or null if not found and throwOnNotFound
 * is false.
 *
 * @throws {DataViewNotFoundError} If the data view is not found and
 * throwOnNotFound is true.
 */
export function getDataView(id: string): DataView;
export function getDataView(
  id: string,
  throwOnNotFound: false,
): DataView | null;
export function getDataView(
  id: string,
  throwOnNotFound = true,
): DataView | null {
  // Get the data view from the store
  const view = DataViewsStore.get(id);

  // Throw an error if the data view does not exist
  if (!view && throwOnNotFound) {
    throw new DataViewNotFoundError(id);
  }

  return view ?? null;
}

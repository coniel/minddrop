import { ViewsStore } from '../ViewsStore';
import { ViewNotFoundError } from '../errors';
import { View } from '../types';

/**
 * Retrieves a view by ID.
 *
 * @param id - The ID of the view to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the view
 * is not found. Defaults to true.
 * @returns The view, or null if not found and throwOnNotFound
 * is false.
 *
 * @throws {ViewNotFoundError} If the view is not found and
 * throwOnNotFound is true.
 */
export function getView(id: string): View;
export function getView(id: string, throwOnNotFound: false): View | null;
export function getView(id: string, throwOnNotFound = true): View | null {
  // Get the view from the store
  const view = ViewsStore.get(id);

  // Throw an error if the view does not exist
  if (!view && throwOnNotFound) {
    throw new ViewNotFoundError(id);
  }

  return view ?? null;
}

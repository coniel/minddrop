import { ViewsStore } from '../ViewsStore';
import { ViewNotFoundError } from '../errors';
import { View } from '../types';

/**
 * Retrieves a view from the store by ID.
 *
 * @param id - The ID of the view.
 * @param throwOnNotFound - Whether to throw an error if the view is not found.
 * @returns The view object.
 *
 * @throws {ViewNotFoundError} If the view does not exist.
 */
export function getView(id: string): View;
export function getView(id: string, throwOnNotFound: false): View | null;
export function getView(id: string, throwOnNotFound = true): View | null {
  // Get the view from the store
  const view = ViewsStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!view && throwOnNotFound) {
    throw new ViewNotFoundError(id);
  } else if (!view && !throwOnNotFound) {
    return null;
  }

  return view;
}

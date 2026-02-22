import { ViewsStore } from '../ViewsStore';
import { ViewNotFoundError } from '../errors';
import { View } from '../types';

/**
 * Retrieves a view by ID.
 *
 * @param id - The ID of the view to retrieve.
 * @returns The view.
 *
 * @throws {ViewNotFoundError} If the view with the specified ID does not exist.
 */
export function getView(id: string): View {
  // Get the view from the store
  const view = ViewsStore.get(id);

  // Ensure the view exists
  if (!view) {
    throw new ViewNotFoundError(id);
  }

  return view;
}

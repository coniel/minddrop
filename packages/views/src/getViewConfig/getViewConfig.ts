import { ViewNotRegisteredError } from '../errors';
import { ViewConfig } from '../types';
import { ViewConfigsStore } from '../ViewConfigsStore';

/**
 * Returns a view config by ID.
 *
 * @param id - The ID of the view config to retrieve.
 * @returns The view's config.
 *
 * @throws ViewNotRegisteredError
 * Thrown if the requested view is not registered.
 */
export function getViewConfig(id: string): ViewConfig {
  const view = ViewConfigsStore.get(id);

  if (!view) {
    throw new ViewNotRegisteredError(id);
  }

  return view;
}

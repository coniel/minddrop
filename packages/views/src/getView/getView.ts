import { ViewNotRegisteredError } from '../errors';
import { View } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Gets a view's config by ID.
 *
 * @param id The ID of the view to retrieve.
 * @returns The view's config.
 */
export function getView(id: string): View {
  const view = useViewsStore.getState().views[id];

  if (!view) {
    throw new ViewNotRegisteredError(id);
  }

  return view;
}

import { ViewInstanceNotFoundError } from '../errors';
import { ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Retrieves a view instance by ID. Throws a `ViewInstanceNotFoundError`
 * if the view instance does not exist.
 *
 * @param viewInstanceId The ID of the view instance to retrieve.
 * @returns The view instance.
 */
export function getViewInstance<T extends ViewInstance = ViewInstance>(
  viewInstanceId: string,
): T {
  const { instances } = useViewsStore.getState();

  if (!instances[viewInstanceId]) {
    throw new ViewInstanceNotFoundError();
  }

  return instances[viewInstanceId] as T;
}

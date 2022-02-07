import { ViewInstance, ViewInstanceMap } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Returns a { [id]: ViewInstance | null } map of view intances
 * by ID (null if the view instance does not exist)
 *
 * @param viewInstanceIds The IDs of the view instances to retrieve.
 * @returns A { [id]: ViewInstance | null } map (null if the view instance does not exist).
 */
export function getViewInstances<T extends ViewInstance = ViewInstance>(
  viewInstanceIds: string[],
): ViewInstanceMap<T> {
  const { instances } = useViewsStore.getState();

  return viewInstanceIds.reduce(
    (map, id) => ({ ...map, [id]: (instances[id] as unknown as T) || null }),
    {} as ViewInstanceMap<T>,
  );
}

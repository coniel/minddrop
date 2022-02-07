import { ViewInstance, ViewInstanceMap } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Returns a { [id]: ViewInstance | null } map of the provided
 * view instance IDs.
 *
 * @param viewInstanceIds The IDs of the view instances to retrieve.
 * @returns A { [id]: ViewInstance | null } map.
 */
export function useViewInstances<T extends ViewInstance = ViewInstance>(
  viewInstanceIds: string[],
): ViewInstanceMap<T> {
  const { instances } = useViewsStore();

  return viewInstanceIds.reduce(
    (map, id) => ({
      ...map,
      [id]: (instances[id] as unknown as T) || null,
    }),
    {} as ViewInstanceMap<T>,
  );
}

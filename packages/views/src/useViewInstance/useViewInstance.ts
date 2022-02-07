import { ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Returns a view instance by ID or `null` if the instance
 * does not exist.
 *
 * @param viewInstanceId The ID of the view instance to retrieve.
 * @returns The view instance or null.
 */
export function useViewInstance<T extends ViewInstance = ViewInstance>(
  viewInstanceId: string,
): T | null {
  const { instances } = useViewsStore();

  return (instances[viewInstanceId] as unknown as T) || null;
}

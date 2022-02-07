import { Core } from '@minddrop/core';
import { getViewInstance } from '../getViewInstance';
import { ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Deletes a view instance and dispatches a `views:delete-instance`
 * event.
 *
 * @param core A MindDrop core instance.
 * @param viewInstanceId The ID of the view instance to delete.
 */
export function deleteViewInstance<T extends ViewInstance = ViewInstance>(
  core: Core,
  viewInstanceId: string,
): T {
  // Get the view instance
  const instance = getViewInstance<T>(viewInstanceId);

  // Remove the view instance from the store
  useViewsStore.getState().removeInstance(viewInstanceId);

  // Dispatch a 'views:delete-instance' event
  core.dispatch('views:delete-instance', instance);

  return instance;
}

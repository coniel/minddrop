import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getViewInstance } from '../getViewInstance';
import { UpdateViewInstanceData, ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Updates a view instance and dispatches a `views:update-instance`
 * event.
 *
 * @param core A MindDrop core instance.
 * @param viewInstanceId The ID of the view instance to update.
 * @param data The update data.
 */
export function updateViewInstance<
  D extends UpdateViewInstanceData,
  I extends ViewInstance = ViewInstance,
>(core: Core, viewInstanceId: string, data: D): I {
  // Get the view instance
  const instance = getViewInstance<I>(viewInstanceId);

  // Create update using data
  const update = createUpdate<D, I>(instance, data, { setUpdatedAt: true });

  // Update the view instance in the store
  useViewsStore.getState().setInstance(update.after);

  // Dispatch 'view:update-instance' event
  core.dispatch('views:update-instance', update);

  return update.after;
}

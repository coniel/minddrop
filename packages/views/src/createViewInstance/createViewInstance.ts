import { Core } from '@minddrop/core';
import { generateViewInstance } from '../generateViewInstance';
import { getView } from '../getView';
import { CreateViewInstanceData, ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Creates a new view instance and dispatches a
 * `views:create-instance` event.
 *
 * @param core A MindDrop core instance.
 * @param data The view instance data.
 */
export function createViewInstance<
  D extends CreateViewInstanceData = CreateViewInstanceData,
  I extends ViewInstance = ViewInstance,
>(core: Core, data: D): I {
  // Verify that the view is registered
  getView(data.view);

  // Generate the view instance
  const instance = generateViewInstance<D, I>(data);

  // Add the view instance to the store
  useViewsStore.getState().setInstance(instance);

  // Dispatch 'views:create-instance' event
  core.dispatch('views:create-instance', instance);

  return instance;
}

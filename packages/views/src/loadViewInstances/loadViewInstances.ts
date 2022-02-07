import { Core } from '@minddrop/core';
import { ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

/**
 * Loads view instances into the store and dispatches a
 * `view:load-instances` event.
 *
 * @param core A MindDrop core instance.
 * @param viewInstances The view instance to load into the store.
 */
export function loadViewInstances(
  core: Core,
  viewInstances: ViewInstance[],
): void {
  // Load the view instances into the store
  useViewsStore.getState().loadInstances(viewInstances);

  // Dispatch a 'views:load-instances' event
  core.dispatch('views:load-instances', viewInstances);
}

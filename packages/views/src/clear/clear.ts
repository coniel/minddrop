import { Core } from '@minddrop/core';
import { useViewsStore } from '../useViewsStore';

/**
 * Clears all registered views and view instances from
 * the store and dispatches a `views:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clear(core: Core): void {
  // Clear the store
  useViewsStore.getState().clear();

  // Dispatch 'views:clear' event
  core.dispatch('views:clear');
}

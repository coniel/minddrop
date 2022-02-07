import { Core } from '@minddrop/core';
import { getView } from '../getView';
import { useViewsStore } from '../useViewsStore';

/**
 * Unregister's a view from and dispatches a
 * `views:unregister` event.
 *
 * @param core A MindDrop core instance.
 * @param viewId The ID of the view to unregister.
 */
export function unregisterView(core: Core, viewId: string): void {
  const view = getView(viewId);

  useViewsStore.getState().removeView(viewId);

  core.dispatch('views:unregister', view);
}

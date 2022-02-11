import { Core } from '@minddrop/core';
import { Views } from '@minddrop/views';
import { getTopicView } from '../getTopicView';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Unregisters a topic view and dispatches a
 * `topics:unregister-view` event.
 *
 * @param core A MindDrop core instance.
 * @param viewId The ID of the topic view to unregister.
 */
export function unregisterTopicView(core: Core, viewId: string): void {
  // Get the topic view
  const view = getTopicView(viewId);

  // Unregister the view
  Views.unregister(core, viewId);

  // Remove it from the store
  useTopicsStore.getState().removeView(viewId);

  // Dispatch a 'topics:unregister-view' event
  core.dispatch('topics:unregister-view', view);
}

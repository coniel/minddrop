import { Core } from '@minddrop/core';
import { Views } from '@minddrop/views';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';

/**
 * Unregisters a topic view.
 * Dispatches a `topics:view:unregister` event.
 *
 * @param core A MindDrop core instance.
 * @param viewId The ID of the topic view to unregister.
 *
 * @throws ViewNotRegisteredError
 * Thrown if the view is not registered.
 */
export function unregisterTopicView(core: Core, viewId: string): void {
  // Get the topic view
  const config = TopicViewConfigsStore.get(viewId);

  // Unregister the view
  Views.unregister(core, viewId);

  // Unregister the topic view
  TopicViewConfigsStore.unregister(config);

  // Dispatch a 'topics:view:unregister' event
  core.dispatch('topics:view:unregister', config);
}

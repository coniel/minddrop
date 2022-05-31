import { TopicViewNotRegisteredError } from '../errors';
import { TopicViewConfig } from '../types';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';

/**
 * Returns a topic view's config by ID.
 *
 * @param viewId - The ID of the topic view to retrieve.
 *
 * @throws TopicViewNotRegisteredError
 * Thrown if the topic view is not registered.
 */
export function getTopicViewConfig(viewId: string): TopicViewConfig {
  // Get the topic view config
  const view = TopicViewConfigsStore.get(viewId);

  if (!view) {
    // Throw a `TopicViewNotRegisteredError` if the view is not registered
    throw new TopicViewNotRegisteredError(viewId);
  }

  return view;
}

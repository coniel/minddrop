import { TopicViewNotRegisteredError } from '..';
import { TopicView } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Returns a TopicView by ID.
 *
 * @param viewId The ID of the topic view to retrieve.
 */
export function getTopicView(viewId: string): TopicView {
  // Fetch the topic view
  const view = useTopicsStore.getState().views[viewId];

  // Throw a TopicViewNotRegisteredError if not registered
  if (!view) {
    throw new TopicViewNotRegisteredError(viewId);
  }

  return view;
}

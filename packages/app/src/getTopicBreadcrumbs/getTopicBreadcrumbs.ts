import { Topics } from '@minddrop/topics';
import { ResourceView } from '../types';

/**
 * Returns a list of views leading up to and
 * including the provided topic based on the
 * topic's hierarchy of parents.
 *
 * @param topicId The ID of the topic for which to get the breadcrumbs.
 * @returns A list of views leading up to and including the provided topic.
 */
export function getTopicBreadcrumbs(topicId: string): ResourceView[] {
  const breadcrumbs: ResourceView[] = [];
  let topic = Topics.get(topicId);

  while (topic) {
    breadcrumbs.unshift({
      id: 'topic',
      title: topic.title,
      resource: { id: topic.id, type: 'topic' },
    });

    const parents = Topics.parents(topic.id);
    const parentIds = Object.keys(parents);
    if (parentIds.length) {
      topic = Topics.get(parentIds[0]);
    } else {
      topic = null;
    }
  }

  return breadcrumbs;
}

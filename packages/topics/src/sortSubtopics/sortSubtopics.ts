import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

const InvalidParameterErrorMessage =
  're-sorted subtopic IDs must contain exactly the same topic IDs as the current value';

/**
 * Sets a new sort order for a topic's subtopics.
 * The provided subtopic IDs must contain the same
 * IDs as the current value, only in a different order.
 * Dispatches a `topics:topic:sort-subtopics` event.
 * Retruns the updated topic.
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic in which to sort the subtopics.
 * @param subtopicIds - The IDs of the subtopics in their new sort order.
 *
 * @throws InvalidParameterError
 * Thrown if the given subtopic IDs differ from the
 * current subtopic IDs in anything but order.
 */
export function sortSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the topic
  const topic = TopicsResource.get(topicId);

  // Ensure that the provided subtopic IDs do not differ from
  // the current subtopic IDs in anything but order.
  if (subtopicIds.length !== topic.subtopics.length) {
    // If the lengths differ, throw an error
    throw new InvalidParameterError(InvalidParameterErrorMessage);
  } else {
    topic.subtopics.forEach((subtopicId) => {
      if (!subtopicIds.includes(subtopicId)) {
        // If the contents differ, throw an error
        throw new InvalidParameterError(InvalidParameterErrorMessage);
      }
    });
  }

  // Update the subtopic IDs in the parent topic
  const updated = TopicsResource.update(core, topicId, {
    subtopics: subtopicIds,
  });

  // Dispatch a 'topics:topic:sort-subtopics' event
  core.dispatch('topics:topic:sort-subtopics', updated);

  return updated;
}

import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Topic } from '../types';
import { TopicsResource } from '../TopicsResource';

/**
 * Adds subtopics into a parent topic.
 * Dispatches an `topics:topic:add-subtopics` event
 *
 * @param core - A MindDrop core instance.
 * @param topicId - The ID of the topic to which to add the subtopics.
 * @param subtopicIds - The IDs of the subtopics to add to the topic.
 * @returns The updated topic.
 */
export function addSubtopics(
  core: Core,
  topicId: string,
  subtopicIds: string[],
): Topic {
  // Get the topic
  const topic = TopicsResource.get(topicId);

  // Filter out subtopic IDs already in the topic to prevent duplicates
  const newSubtopicIds = subtopicIds.filter(
    (id) => !topic.subtopics.includes(id),
  );

  // Get the subtopics
  const subtopics = TopicsResource.get(newSubtopicIds);

  // Update the topic
  const updated = TopicsResource.update(core, topicId, {
    subtopics: FieldValue.arrayUnion(newSubtopicIds),
  });

  // Add the topic as a parent on the subtopics
  newSubtopicIds.forEach((subtopicId) => {
    // Add the topic as a parent
    const subtopic = TopicsResource.addParents(core, subtopicId, [
      { resource: 'topics:topic', id: topicId },
    ]);

    // Update the subtopic in the subtopic map
    subtopics[subtopicId] = subtopic;
  });

  // Dispatch 'topics:topic:add-subtopics' event
  core.dispatch('topics:topic:add-subtopics', {
    topic: updated,
    subtopics,
  });

  return updated;
}

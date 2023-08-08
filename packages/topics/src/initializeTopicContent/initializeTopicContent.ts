import { v4 as uuid } from 'uuid';
import { Topic, TopicContent } from '../types';

/**
 * Generates the contents of an empty topic as three
 * empty columns.
 *
 * @param topic - The topic.
 * @returns The topic's content.
 */
export function initializeTopicContent(topic: Topic): TopicContent {
  return {
    title: topic.title,
    markdown: `# ${topic.title}\n\n---\n\n---\n\n`,
    columns: [
      { id: uuid(), drops: [] },
      { id: uuid(), drops: [] },
      { id: uuid(), drops: [] },
    ],
  };
}

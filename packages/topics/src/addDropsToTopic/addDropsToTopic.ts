import { Drop } from '@minddrop/drops';
import { getTopic } from '../getTopic';
import { NotFoundError } from '@minddrop/core';
import { readTopic } from '../readTopic';
import { parseTopic } from '../parseTopic';
import { updateTopic } from '../updateTopic';
import { topicContentToMarkdown } from '../topicTopicMarkdown';
import { Topic, TopicContent } from '../types';
import { initializeTopicContent } from '../initializeTopicContent';

/**
 * Adds drops to a topic at the specified location, or
 * at the end of the first column if no location was
 * provided.
 *
 * Dispatches a 'topics:topic:update' event.
 *
 * @param path - The topic path.
 * @param drops - The drops to add.
 * @param columnIndex - The index of the column to which to add the drops.
 * @param dropIndex - The index at which to insert the drops within the column.
 */
export async function addDropsToTopic(
  path: string,
  drops: Drop[],
  columnIndex?: number,
  dropIndex?: number,
): Promise<Topic> {
  // Get the topic from the topics store
  const topic = getTopic(path);

  // Throw if the topic does not exist
  if (!topic) {
    throw new NotFoundError('topic', path);
  }

  // Get store topic's content
  let { content } = topic;

  // If store topic has no content, get the content
  // from the topic's markdown file.
  if (!content) {
    const markdown = await readTopic(path);

    if (markdown) {
      content = parseTopic(markdown);
    }
  }

  // If the topic has no markdown file, initialize
  // its content.
  if (!content) {
    content = initializeTopicContent(topic);
  }

  if (typeof columnIndex !== 'undefined') {
    // If a column index was specified, insert the drops
    // at the specified index.
    content.columns[columnIndex].drops.splice(dropIndex || 0, 0, ...drops);
  } else {
    // Insert drops at the end of the first column
    content.columns[0].drops.splice(
      content.columns[0].drops.length,
      0,
      ...drops,
    );
  }

  // Update the topic
  const updated = updateTopic(path, {
    content: {
      ...(content as TopicContent),
      markdown: topicContentToMarkdown(content),
    },
  });

  // Return the updated topic
  return updated;
}

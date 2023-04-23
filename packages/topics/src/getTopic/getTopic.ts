import { TopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns a topic or subtopic by path.
 *
 * @param path - The topic/subtopic path.
 * @returns The requested topic or `null` if it does not exist.
 */
export function getTopic(path: string): Topic | null {
  // Get topics
  const { topics } = TopicsStore.getState();

  // Split the topic path into individual topic file names
  const filenames = path.split('/');
  // Get the root topic filename
  const rootFilename = filenames.shift();

  // Get the root topic
  let topic = topics[rootFilename || ''] || null;

  // Get the tagret subtopic by working down the subtopics
  while (topic && filenames.length) {
    const subtopicFilename = filenames.shift();

    if (subtopicFilename) {
      topic = topic.subtopics[subtopicFilename] || null;
    }
  }

  return topic;
}

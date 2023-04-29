import { TopicsStore as useTopicsStore } from '../TopicsStore';
import { Topic } from '../types';

/**
 * Returns topics or subtopics by path.
 *
 * @param paths - The topic/subtopic paths.
 * @returns The requested topics.
 */
export function useTopics(paths: string[]): Topic[] {
  // Get all topics
  const { topics } = useTopicsStore();

  return paths
    .map((path) => {
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
    })
    .filter((topic) => topic !== null);
}

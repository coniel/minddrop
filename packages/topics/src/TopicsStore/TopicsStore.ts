import { create } from 'zustand';
import { Topic, TopicStore } from '../types';

function modifySubtopic(
  topics: Record<string, Topic>,
  path: string[],
  modify: (subtopic: Topic) => void,
): Record<string, Topic> {
  // Clone current topics state
  const nextTopics = JSON.parse(JSON.stringify(topics));

  const remainingPath = path;
  let currentPath = remainingPath.shift() || '';
  let subtopic = nextTopics[currentPath];

  // Loop through the path filenames setting the
  // matching subtopic as the target subtopic.
  while (subtopic && remainingPath.length) {
    currentPath = remainingPath.shift() as string;
    subtopic = subtopic.subtopics[currentPath];
  }

  if (subtopic) {
    modify(subtopic);
  }

  return nextTopics;
}

export const TopicsStore = create<TopicStore>()((set) => ({
  topics: {},

  load: (topics) =>
    set((state) => ({ topics: { ...state.topics, ...topics } })),

  add: (path, topic) =>
    set((state) => {
      if (!path.length) {
        return {};
      }

      // If the topic is a root topic, simply add it
      // to `topics`.
      if (path.length === 1) {
        return {
          topics: {
            ...state.topics,
            [path[0]]: topic,
          },
        };
      }

      const parentPath = path;
      const subtopicFilename = parentPath.pop() as string;

      // If the path leads to a subtopic, add it to
      // the parent topic.
      const nextTopics = modifySubtopic(state.topics, parentPath, (parent) => {
        parent.subtopics = {
          ...parent.subtopics,
          [subtopicFilename]: topic,
        };
      });

      return { topics: nextTopics };
    }),

  remove: (path) =>
    set((state) => {
      if (!path.length) {
        return {};
      }

      // If the topic is a root topic, simply remove it
      // from `topics`.
      if (path.length === 1) {
        // Clone topics state
        const nextTopics = JSON.parse(JSON.stringify(state.topics));

        // Remove the topic
        delete nextTopics[path[0]];

        return {
          topics: nextTopics,
        };
      }

      const parentPath = path;
      const subtopicFilename = parentPath.pop() as string;

      // If the path leads to a subtopic, remove it from
      // the parent topic.
      const nextTopics = modifySubtopic(state.topics, parentPath, (parent) => {
        // Clone the parent's subtopics
        const nextSubtopics = JSON.parse(JSON.stringify(parent.subtopics));

        // Remove the subtopic
        delete nextSubtopics[subtopicFilename];

        // Set the updated subtopics on the parent
        parent.subtopics = nextSubtopics;
      });

      return { topics: nextTopics };
    }),

  update: (path, data) =>
    set((state) => {
      if (!path.length) {
        return {};
      }

      // If the topic is a root topic, simply update it
      if (path.length === 1 && state.topics[path[0]]) {
        // Clone topics state
        const nextTopics = JSON.parse(JSON.stringify(state.topics));

        // Update the topic
        nextTopics[path[0]] = {
          ...nextTopics[path[0]],
          ...data,
        };

        return {
          topics: nextTopics,
        };
      }

      // If the path leads to a subtopic, update it in place
      const nextTopics = modifySubtopic(state.topics, path, (subtopic) => {
        subtopic.title = data.title || subtopic.title;
        subtopic.filename = data.filename || subtopic.filename;
        subtopic.isDir = data.isDir || subtopic.isDir;
      });

      return { topics: nextTopics };
    }),

  clear: () => set({ topics: {} }),
}));

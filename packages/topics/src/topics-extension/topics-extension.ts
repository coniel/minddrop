import { Core } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { removeDropsFromTopic } from '../removeDropsFromTopic';
import { Topic } from '../types';
import { useTopicsStore } from '../useTopicsStore';

export function onRun(core: Core) {
  // Register the topics:topic resource
  core.registerResource<Topic>({
    type: 'topics:topic',
    createEvent: 'topics:create',
    updateEvent: 'topics:update',
    deleteEvent: 'topics:delete-permanently',
    onLoad: (topics) => useTopicsStore.getState().loadTopics(topics),
    onChange: (topic, deleted) => {
      const store = useTopicsStore.getState();
      if (deleted) {
        store.removeTopic(topic.id);
      } else {
        store.setTopic(topic);
      }
    },
  });

  // Listen for drop deletions and remove deleted drops from topics
  Drops.addEventListener(core, 'drops:delete', ({ data }) => {
    data.parents
      .filter((parent) => parent.type === 'topic')
      .forEach(({ id }) => {
        removeDropsFromTopic(core, id, [data.id]);
      });
  });
}

export function onDisable(core: Core) {
  // Clear the store
  useTopicsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}

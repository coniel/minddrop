import { Core } from '@minddrop/core';
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
}

export function onDisable(core: Core) {
  // Clear the store
  useTopicsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}

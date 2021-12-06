import { Core } from '@minddrop/core';
import { Topics } from '../Topics';
import { useTopicsStore } from '../useTopicsStore';

export function onRun(core: Core) {
  // Listen to topics:load events and load topics into the store
  Topics.addEventListener(core, 'topics:load', (payload) =>
    useTopicsStore.getState().loadTopics(payload.data),
  );

  // Listen to topics:clear events and clear the store
  Topics.addEventListener(
    core,
    'topics:clear',
    useTopicsStore.getState().clear,
  );

  // Listen to topics:create events and add new topics to the store
  Topics.addEventListener(core, 'topics:create', (payload) =>
    useTopicsStore.getState().addTopic(payload.data),
  );

  // Listen to topics:update events and update topics in the store
  Topics.addEventListener(core, 'topics:update', (payload) =>
    useTopicsStore
      .getState()
      .updateTopic(payload.data.before.id, payload.data.changes),
  );

  // Listen to topics:delete-permanently events and remove topics from the store
  Topics.addEventListener(core, 'topics:delete-permanently', (payload) =>
    useTopicsStore.getState().removeTopic(payload.data.id),
  );
}

export function onDisable(core: Core) {
  // Clear the store
  useTopicsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}

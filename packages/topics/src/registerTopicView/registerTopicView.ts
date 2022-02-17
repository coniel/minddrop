import { Core } from '@minddrop/core';
import { Views } from '@minddrop/views';
import { TopicView, TopicViewConfig } from '../types';
import { useTopicsStore } from '../useTopicsStore';

/**
 * Registers a topic view and dispatches a `topics:register-view` event.
 *
 * @param core A MindDrop core instance.
 * @param config The config of the topic view to register.
 */
export function registerTopicView(core: Core, config: TopicViewConfig): void {
  // Register the view
  Views.register(core, {
    type: 'instance',
    id: config.id,
    component: config.component,
  });

  // Add extension ID to config to create topic view
  const topicView: TopicView = {
    ...config,
    type: 'instance',
    extension: core.extensionId,
  };

  // Registers the topic view
  useTopicsStore.getState().setView(topicView);

  // Dispatches a 'topics:register-view' event
  core.dispatch('topics:register-view', topicView);
}

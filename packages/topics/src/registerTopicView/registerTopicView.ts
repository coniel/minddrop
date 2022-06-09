import { Core } from '@minddrop/core';
import { Views } from '@minddrop/views';
import { RDDataSchema } from '@minddrop/resources';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';
import { TopicViewConfig, BaseTopicViewInstanceData } from '../types';

export const baseTopicViewInstanceDataSchema: RDDataSchema<BaseTopicViewInstanceData> =
  {
    topic: {
      type: 'resource-id',
      resource: 'topics:topic',
      required: true,
    },
  };

/**
 * Registers a topic view.
 * Dispatches a `topics:view:register` event.
 *
 * @param core - A MindDrop core instance.
 * @param config - The config of the topic view to register.
 */
export function registerTopicView(core: Core, config: TopicViewConfig): void {
  // Create the config's data schema by merging the
  // view config's data schema with the base topic
  // view data schema.
  const dataSchema = {
    ...config.dataSchema,
    ...baseTopicViewInstanceDataSchema,
  };

  // Register the view
  Views.register(core, {
    type: 'instance',
    ...config,
    dataSchema,
  });

  // Get the registered config
  const registeredConfig = Views.get(config.id);

  // Register the view config in the TopicViewConfigsStore
  TopicViewConfigsStore.register({
    ...config,
    dataSchema,
    type: 'instance',
    extension: core.extensionId,
  });

  // Dispatches a 'topics:view:register' event
  core.dispatch('topics:view:register', registeredConfig);
}

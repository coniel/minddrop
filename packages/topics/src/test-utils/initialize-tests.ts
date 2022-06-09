import { initializeCore } from '@minddrop/core';
import { Views, ViewInstancesResource } from '@minddrop/views';
import { Drops, DropsResource, DROPS_TEST_DATA } from '@minddrop/drops';
import { TagsResource, TAGS_TEST_DATA } from '@minddrop/tags';
import { Resources } from '@minddrop/resources';
import { TopicsResource } from '../TopicsResource';
import { topics, topicViewInstances } from './topics.data';

const { dropConfig, drops } = DROPS_TEST_DATA;
const { tags } = TAGS_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'topics' });

export const setup = () => {
  // Register the 'view:view' resource
  Resources.register(core, ViewInstancesResource);
  // Register the 'topics:topic' resource
  Resources.register(core, TopicsResource);
  // Register the 'drops:drop' resource
  Resources.register(core, DropsResource);
  // Register the 'tags:tag' resource
  Resources.register(core, TagsResource);

  // Register test drop type
  Drops.register(core, dropConfig);

  // Load test tags
  TagsResource.store.load(core, tags);
  // Load test drops
  Drops.store.load(core, drops);
  // Load test topics
  TopicsResource.store.load(core, topics);
  // Load topic view instances
  ViewInstancesResource.store.load(core, topicViewInstances);
};

export const cleanup = () => {
  // Clear topics store
  TopicsResource.store.clear();

  // Clear all registered views
  Views.clear(core);

  // Clear view instances
  ViewInstancesResource.store.clear();

  // Clear registered view instance types
  ViewInstancesResource.typeConfigsStore.clear();

  // Remove all event listeners
  core.removeAllEventListeners();
};

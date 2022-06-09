import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { Tags, TagsResource, TAGS_TEST_DATA } from '@minddrop/tags';
import { drops, dropTypeConfigs } from './drops.data';
import { DropsResource } from '../DropsResource';
import { Resources } from '@minddrop/resources';

const { tags } = TAGS_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'drops' });

export function setup() {
  act(() => {
    // Register the 'tags:tag' resource
    Resources.register(core, TagsResource);

    // Register 'drops:drop' resource
    Resources.register(core, DropsResource);

    // Register all test drop configs
    dropTypeConfigs.forEach((config) => {
      DropsResource.register(core, config);
    });

    // Load test tags
    Tags.store.load(core, tags);

    // Load the test drops
    DropsResource.store.load(core, drops);
  });
}

export function cleanup() {
  act(() => {
    // Clear registered drop types
    DropsResource.typeConfigsStore.clear();

    // Clear drops
    DropsResource.store.clear();

    // Clear tags
    Tags.store.clear();

    // Remove all of the extension's event listeners
    core.removeAllEventListeners();
  });
}

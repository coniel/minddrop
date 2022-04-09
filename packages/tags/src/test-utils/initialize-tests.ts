import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { TagsStore } from '../TagsStore';
import { tags } from './tags.data';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  act(() => {
    // Load tags into the store
    TagsStore.load(tags);
  });
}

export function cleanup() {
  act(() => {
    // Clear the tags from the store
    TagsStore.clear();
  });
}

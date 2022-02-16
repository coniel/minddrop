import { initializeCore } from '@minddrop/core';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { clearExtensions } from '../clearExtensions';
import { registerExtension } from '../registerExtension';
import { extensions } from './extensions.data';

const { topics } = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export function setup() {
  // Load topics
  Topics.load(core, topics);

  // Register extensions
  extensions.forEach((extension) => registerExtension(core, extension));
}

export function cleanup() {
  clearExtensions(core);
}

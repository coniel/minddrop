import { initializeCore } from '@minddrop/core';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { clearExtensions } from '../clearExtensions';
import { loadExtensionDocuments } from '../loadExtensionDocuments';
import { registerExtension } from '../registerExtension';
import { extensionConfigs, extensionDocuments } from './extensions.data';

const { topics } = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

export function setup() {
  // Load topics
  Topics.load(core, topics);

  // Load extension documents
  loadExtensionDocuments(core, extensionDocuments);

  // Register extensions
  extensionConfigs.forEach((config) => registerExtension(core, config));
}

export function cleanup() {
  // Clear the extesions store
  clearExtensions(core);

  // Unregister the extensions resource
  core.unregisterResource('extensions:extension');
}

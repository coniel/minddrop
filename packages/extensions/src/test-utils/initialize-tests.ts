import { initializeCore } from '@minddrop/core';
import {
  Topics,
  onRun as onRunTopics,
  onDisable as onDisableTopics,
  TOPICS_TEST_DATA,
} from '@minddrop/topics';
import { registerExtension } from '../registerExtension';
import { extensionConfigs, extensionDocuments } from './extensions.data';
import { ExtensionsResource } from '../ExtensionsResource';
import {
  onRun as onRunExtensions,
  onDisable as onDisableExtensions,
} from '../extensions-extension';

const { topics } = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Run the topics extension
  onRunTopics(core);

  // Run the extensions extension
  onRunExtensions(core);

  // Load topics
  Topics.store.load(core, topics);

  // Load extension documents
  ExtensionsResource.store.load(core, extensionDocuments);

  // Register extensions
  extensionConfigs.forEach((config) => registerExtension(core, config));
}

export function cleanup() {
  // Disable the extensions extension
  onDisableExtensions(core);

  // Disable the topics extension
  onDisableTopics(core);
}

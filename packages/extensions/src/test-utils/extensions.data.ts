import { Extension, ExtensionConfig } from '../types';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { tSailing, tAnchoring, tBoats } = TOPICS_TEST_DATA;

export const unregisteredExtensionConfig: ExtensionConfig = {
  name: 'Unregistered',
  description: 'An unregistered extesion.',
  id: 'unregistered-extension',
  scopes: ['topic'],
  onRun: () => null,
};

export const extensionConfig1: ExtensionConfig = {
  id: 'extension-1',
  name: 'Extension 1',
  description: 'An extension',
  scopes: ['topic'],
  onRun: () => null,
};

export const topicExtension: Extension = {
  id: 'extension-1',
  name: 'Topic extension',
  description: 'A topic scoped extension.',
  scopes: ['topic'],
  enabled: true,
  topics: [tSailing.id, tAnchoring.id, tBoats.id],
  onRun: () => null,
  onEnableTopics: () => null,
  onDisableTopics: () => null,
};

export const topicExtensionNoCallbacks: Extension = {
  id: 'extension-topic-no-callbacks',
  name: 'Topic extension no callbacks',
  description:
    'A topic scoped extension without any of the optional callbacks.',
  scopes: ['topic'],
  enabled: true,
  topics: [tSailing.id],
  onRun: () => null,
};

export const appExtension: Extension = {
  id: 'extension-2',
  name: 'App extension',
  description: 'An app scoped extension',
  scopes: ['app'],
  enabled: true,
  topics: [],
  onRun: () => null,
};

export const disabledTopicExtension: Extension = {
  id: 'disabled-topic-extension',
  name: 'Disabled extension',
  description: 'A disabled extension.',
  scopes: ['topic'],
  enabled: false,
  topics: [tSailing.id],
  onRun: () => null,
};

export const unregisteredExtension: Extension = {
  id: 'unregistered-extension',
  name: 'Unregistered extension',
  description: 'An unregistered extension',
  scopes: ['topic'],
  enabled: true,
  topics: [],
  onRun: () => null,
};

export const extensionConfigs = [extensionConfig1];
export const extensions = [
  topicExtension,
  topicExtensionNoCallbacks,
  appExtension,
  disabledTopicExtension,
];
export const enabledExtensions = [
  topicExtension,
  topicExtensionNoCallbacks,
  appExtension,
];

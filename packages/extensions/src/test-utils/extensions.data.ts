import { Resources } from '@minddrop/resources';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Extension, ExtensionConfig, ExtensionDocument } from '../types';

const { tSailing, tAnchoring, tBoats } = TOPICS_TEST_DATA;

/* ************************** */
/* * Unregistered extension * */
/* ************************** */

// Extension configuration
export const unregisteredExtensionConfig: ExtensionConfig = {
  name: 'Unregistered',
  description: 'An unregistered extesion.',
  id: 'unregistered-extension',
  scopes: ['topic'],
  onRun: () => null,
};

/* ********************************** */
/* * Enabled topic scoped extension * */
/* ********************************** */

// Extension configuration
export const topicExtensionConfig: ExtensionConfig = {
  id: 'topic-extension',
  name: 'Topic extension',
  description: 'A topic scoped extension',
  scopes: ['topic'],
  onRun: () => null,
  onEnableTopics: () => null,
  onDisableTopics: () => null,
};

// Extension document
export const topicExtensionDocument: ExtensionDocument =
  Resources.generateDocument('extensions:document', {
    extension: topicExtensionConfig.id,
    topics: [tSailing.id, tAnchoring.id, tBoats.id],
    enabled: true,
  });

// Registered extension
export const topicExtension: Extension = {
  ...topicExtensionConfig,
  document: topicExtensionDocument.id,
  enabled: topicExtensionDocument.enabled,
  topics: topicExtensionDocument.topics,
};

/* ******************************** */
/* * Enabled app scoped extension * */
/* ******************************** */

// Extension configuration
export const appExtensionConfig: ExtensionConfig = {
  id: 'app-extension',
  name: 'App extension',
  description: 'An app scoped extension',
  scopes: ['app'],
  onRun: () => null,
};

// Extension document
export const appExtensionDocument: ExtensionDocument =
  Resources.generateDocument('extensions:document', {
    extension: appExtensionConfig.id,
    topics: [],
    enabled: true,
  });

// Registered extension
export const appExtension: Extension = {
  ...appExtensionConfig,
  document: appExtensionDocument.id,
  enabled: appExtensionDocument.enabled,
  topics: appExtensionDocument.topics,
};

/* ********************************** */
/* * Enabled multi scoped extension * */
/* ********************************** */

// Extension configuration
export const multiScopeExtensionConfig: ExtensionConfig = {
  id: 'multi-scope-extension',
  name: 'Multi scope extension',
  description: 'A application and topic scoped extension',
  scopes: ['app', 'topic'],
  onRun: () => null,
};

// Extension document
export const multiScopeExtensionDocument: ExtensionDocument =
  Resources.generateDocument('extensions:document', {
    extension: multiScopeExtensionConfig.id,
    topics: [tSailing.id],
    enabled: true,
  });

// Registered extension
export const multiScopeExtension: Extension = {
  ...multiScopeExtensionConfig,
  document: multiScopeExtensionDocument.id,
  enabled: multiScopeExtensionDocument.enabled,
  topics: multiScopeExtensionDocument.topics,
};

/* **************************************************** */
/* * Enabled topic scoped extension with no callbacks * */
/* **************************************************** */

// Extension configuration
export const topicNoCallbacksExtensionConfig: ExtensionConfig = {
  id: 'topic-no-callbacks-extension',
  name: 'Topic extension no callbacks',
  description:
    'A topic scoped extension without any of the optional callbacks.',
  scopes: ['topic'],
  onRun: () => null,
};

// Extension document
export const topicNoCallbacksExtensionDocument: ExtensionDocument =
  Resources.generateDocument('extensions:document', {
    extension: topicNoCallbacksExtensionConfig.id,
    topics: [tSailing.id],
    enabled: true,
  });

// Registered extension
export const topicNoCallbacksExtension: Extension = {
  ...topicNoCallbacksExtensionConfig,
  document: topicNoCallbacksExtensionDocument.id,
  enabled: topicNoCallbacksExtensionDocument.enabled,
  topics: topicNoCallbacksExtensionDocument.topics,
};

/* *********************************** */
/* * Disabled topic scoped extension * */
/* *********************************** */

// Extension configuration
export const disabledTopicExtensionConfig: ExtensionConfig = {
  id: 'disabled-topic-extension',
  name: 'Disabled topic extension',
  description: 'A disabled topic scoped extension',
  scopes: ['topic'],
  onRun: () => null,
  onEnableTopics: () => null,
  onDisableTopics: () => null,
};

// Extension document
export const disaledTopicExtensionDocument: ExtensionDocument =
  Resources.generateDocument('extensions:document', {
    extension: disabledTopicExtensionConfig.id,
    enabled: false,
    topics: [tSailing.id, tAnchoring.id, tBoats.id],
  });

// Registered extension
export const disabledTopicExtension: Extension = {
  ...disabledTopicExtensionConfig,
  document: disaledTopicExtensionDocument.id,
  enabled: disaledTopicExtensionDocument.enabled,
  topics: disaledTopicExtensionDocument.topics,
};

export const extensionConfigs = [
  topicExtensionConfig,
  appExtensionConfig,
  topicNoCallbacksExtensionConfig,
  disabledTopicExtensionConfig,
  multiScopeExtensionConfig,
];
export const extensions = [
  topicExtension,
  topicNoCallbacksExtension,
  appExtension,
  disabledTopicExtension,
  multiScopeExtension,
];
export const extensionDocuments = [
  topicExtensionDocument,
  appExtensionDocument,
  topicNoCallbacksExtensionDocument,
  disaledTopicExtensionDocument,
  multiScopeExtensionDocument,
];
export const enabledExtensions = [
  topicExtension,
  topicNoCallbacksExtension,
  appExtension,
  multiScopeExtension,
];

export const tSailingExtensions = [
  topicExtension,
  topicNoCallbacksExtension,
  multiScopeExtension,
];

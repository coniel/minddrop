import { Extension, ExtensionConfig, ExtensionDocument } from '../types';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { generateExtensionDocument } from '../generateExtensionDocument';

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
export const topicExtensionDocument: ExtensionDocument = {
  ...generateExtensionDocument(topicExtensionConfig.id),
  topics: [tSailing.id, tAnchoring.id, tBoats.id],
};

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
  generateExtensionDocument(appExtensionConfig.id);

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
export const multiScopeExtensionDocument: ExtensionDocument = {
  ...generateExtensionDocument(multiScopeExtensionConfig.id),
  topics: [tSailing.id],
};

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
export const topicNoCallbacksExtensionDocument: ExtensionDocument = {
  ...generateExtensionDocument(topicNoCallbacksExtensionConfig.id),
  topics: [tSailing.id],
};

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
export const disaledTopicExtensionDocument: ExtensionDocument = {
  ...generateExtensionDocument(disabledTopicExtensionConfig.id),
  enabled: false,
  topics: [tSailing.id, tAnchoring.id, tBoats.id],
};

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
];
export const extensions = [
  topicExtension,
  topicNoCallbacksExtension,
  appExtension,
  disabledTopicExtension,
];
export const extensionDocuments = [
  topicExtensionDocument,
  appExtensionDocument,
  topicNoCallbacksExtensionDocument,
  disaledTopicExtensionDocument,
];
export const enabledExtensions = [
  topicExtension,
  topicNoCallbacksExtension,
  appExtension,
];

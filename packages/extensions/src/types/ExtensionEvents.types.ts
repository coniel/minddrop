import { EventListenerCallback } from '@minddrop/core';
import { TopicMap } from '@minddrop/topics';
import { Extension } from './Extension.types';
import {
  ExtensionDocument,
  UpdateExtensionDocumentData,
} from './ExtensionDocument.types';

export type RegisterExtensionEvent = 'extensions:extension:register';
export type UnregisterExtensionEvent = 'extensions:extension:unregister';
export type EnableExtensionOnTopicsEvent = 'extensions:extension:enable-topics';
export type DisableExtensionOnTopicsEvent =
  'extensions:extension:disable-topics';
export type CreateExtensionDocumentEvent = 'extensions:document:create';
export type UpdateExtensionDocumentEvent = 'extensions:document:update';
export type DeleteExtensionDocumentEvent = 'extensions:document:delete';
export type LoadExtensionDocumentsEvent = 'extensions:document:load';

export type RegisterExtensionEventData = Extension;
export type UnregisterExtensionEventData = Extension;
export type CreateExtensionDocumentEventData = ExtensionDocument;
export type DeleteExtensionDocumentEventData = ExtensionDocument;
export type LoadExtensionDocumentsEventData = ExtensionDocument;

export interface EnableExtensionOnTopicsEventData {
  /**
   * The extension which was enabled.
   */
  extension: Extension;

  /**
   * The topics in which the extension was enabled.
   */
  topics: TopicMap;
}

export interface DisableExtensionOnTopicsEventData {
  /**
   * The extension which was disabled.
   */
  extension: Extension;

  /**
   * The topics in which the extension was disabled.
   */
  topics: TopicMap;
}

export interface UpdateExtensionDocumentEventData {
  /**
   * The extension document data before it was modified.
   */
  before: ExtensionDocument;

  /**
   * The modified extension document data.
   */
  after: ExtensionDocument;

  /**
   * The changes made to the extension document data.
   */
  changes: UpdateExtensionDocumentData;
}

export type RegisterExtensionEventCallback = EventListenerCallback<
  RegisterExtensionEvent,
  RegisterExtensionEventData
>;
export type UnregisterExtensionEventCallback = EventListenerCallback<
  UnregisterExtensionEvent,
  UnregisterExtensionEventData
>;
export type EnableExtensionOnTopicsEventCallback = EventListenerCallback<
  EnableExtensionOnTopicsEvent,
  EnableExtensionOnTopicsEventData
>;
export type DisableExtensionOnTopicsEventCallback = EventListenerCallback<
  DisableExtensionOnTopicsEvent,
  DisableExtensionOnTopicsEventData
>;
export type LoadExtensionDocumentsEventCallback = EventListenerCallback<
  LoadExtensionDocumentsEvent,
  LoadExtensionDocumentsEventData
>;
export type CreateExtensionDocumentEventCallback = EventListenerCallback<
  CreateExtensionDocumentEvent,
  CreateExtensionDocumentEventData
>;
export type UpdateExtensionDocumentEventCallback = EventListenerCallback<
  UpdateExtensionDocumentEvent,
  UpdateExtensionDocumentEventData
>;
export type DeleteExtensionDocumentEventCallback = EventListenerCallback<
  DeleteExtensionDocumentEvent,
  DeleteExtensionDocumentEventData
>;

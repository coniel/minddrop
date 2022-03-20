import { EventListenerCallback } from '@minddrop/core';
import { TopicMap } from '@minddrop/topics';
import { Extension } from './Extension.types';
import {
  ExtensionDocument,
  UpdateExtensionDocumentData,
} from './ExtensionDocument.types';

export type RegisterExtensionEvent = 'extensions:register';
export type UnregisterExtensionEvent = 'extensions:unregister';
export type EnableExtensionOnTopicsEvent = 'extensions:enable-topics';
export type DisableExtensionOnTopicsEvent = 'extensions:disable-topics';
export type ClearExtensionsEvent = 'extensions:clear';
export type CreateExtensionDocumentEvent = 'extensions:create-document';
export type UpdateExtensionDocumentEvent = 'extensions:update-document';
export type DeleteExtensionDocumentEvent = 'extensions:delete-document';

export type RegisterExtensionEventData = Extension;
export type UnregisterExtensionEventData = Extension;
export type CreateExtensionDocumentEventData = ExtensionDocument;
export type DeleteExtensionDocumentEventData = ExtensionDocument;

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
export type ClearExtensionsEventCallback =
  EventListenerCallback<ClearExtensionsEvent>;
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

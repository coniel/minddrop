import { EventListenerCallback } from '@minddrop/core';
import { TopicMap } from '@minddrop/topics';
import { Extension } from './Extension.types';

export type RegisterExtensionEvent = 'extensions:register';
export type UnregisterExtensionEvent = 'extensions:unregister';
export type EnableExtensionOnTopicsEvent = 'extensions:enable-topics';
export type DisableExtensionOnTopicsEvent = 'extensions:disable-topics';
export type ClearExtensionsEvent = 'extensions:clear';

export type RegisterExtensionEventData = Extension;
export type UnregisterExtensionEventData = Extension;

export interface EnableExtensionOnTopicsEventData {
  extension: Extension;
  topics: TopicMap;
}

export interface DisableExtensionOnTopicsEventData {
  extension: Extension;
  topics: TopicMap;
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

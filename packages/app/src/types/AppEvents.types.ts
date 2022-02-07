import { EventListenerCallback } from '@minddrop/core';
import { TopicMap } from '@minddrop/topics';
import { View, ViewInstance } from '@minddrop/views';

export type OpenViewEvent = 'app:open-view';
export type AddRootTopicsEvent = 'app:add-root-topics';
export type RemoveRootTopicsEvent = 'app:remove-root-topics';

export interface OpenViewEventData {
  view: View;
  instance: ViewInstance | null;
}
export type AddRootTopicsEventData = TopicMap;
export type RemoveRootTopicsEventData = TopicMap;

export type OpenViewEventCallback = EventListenerCallback<
  OpenViewEvent,
  OpenViewEventData
>;
export type AddRootTopicsEventCallback = EventListenerCallback<
  AddRootTopicsEvent,
  AddRootTopicsEventData
>;
export type RemoveRootTopicsEventCallback = EventListenerCallback<
  RemoveRootTopicsEvent,
  RemoveRootTopicsEventData
>;

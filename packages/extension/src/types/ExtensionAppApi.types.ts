import { EventListenerCallback } from '@minddrop/core';
import {
  View,
  ResourceView,
  LoadTopicsEvent,
  LoadTopicsEventData,
  LoadDropsEvent,
  LoadDropsEventData,
  InsertDataEvent,
  InsertDataEventData,
} from '@minddrop/app';
import { ExtensionTopicApi } from './ExtensionTopicApi';
import { ExtensionDropApi } from './ExtensionDropApi';

export interface Api {
  /**
   * Opens a given view.
   *
   * @param view The view to open.
   */
  openView(view: View | ResourceView): void;

  // App event listeners
  // Load topics
  addEventListener(
    type: LoadTopicsEvent,
    callback: EventListenerCallback<LoadTopicsEvent, LoadTopicsEventData>,
  ): void;

  // Load drops
  addEventListener(
    type: LoadDropsEvent,
    callback: EventListenerCallback<LoadDropsEvent, LoadDropsEventData>,
  ): void;

  // Insert data
  addEventListener(
    type: InsertDataEvent,
    callback: EventListenerCallback<InsertDataEvent, InsertDataEventData>,
  ): void;
}

export type ExtensionAppApi = Api & ExtensionTopicApi & ExtensionDropApi;

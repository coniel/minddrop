import { EventListenerCallback } from '@minddrop/core';
import {
  PersistentStoreChanges,
  PersistentStoreData,
} from './PersistentStoreStore.types';

export type UpdateGlobalStoreEvent = 'persistent-store:update-global';
export type UpdateLocalStoreEvent = 'persistent-store:update-local';

export interface UpdateGlobalStoreEventData {
  /**
   * The sotre data before it was updated.
   */
  before: PersistentStoreData;

  /**
   * The updated store data.
   */
  after: PersistentStoreData;

  /**
   * Changes applied to the store data.
   */
  changes: PersistentStoreChanges;
}

export interface UpdateLocalStoreEventData {
  /**
   * The sotre data before it was updated.
   */
  before: PersistentStoreData;

  /**
   * The updated store data.
   */
  after: PersistentStoreData;

  /**
   * Changes applied to the store data.
   */
  changes: PersistentStoreChanges;
}

export type UpdateGlobalStoreEventCallback = EventListenerCallback<
  UpdateGlobalStoreEvent,
  UpdateGlobalStoreEventData
>;
export type UpdateLocalStoreEventCallback = EventListenerCallback<
  UpdateLocalStoreEvent,
  UpdateLocalStoreEventData
>;

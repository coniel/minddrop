import { EventListenerCallback } from '@minddrop/core';
import {
  PersistentStoreChanges,
  PersistentStoreData,
} from './PersistentStore.types';

export type UpdatePersistentStoreEvent = 'persistent-store:update';
export type ClearPersistentStoreEvent = 'persistent-store:clear';

export interface UpdatePersistentStoreEventData {
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

export type UpdatePersistentStoreEventCallback = EventListenerCallback<
  UpdatePersistentStoreEvent,
  UpdatePersistentStoreEventData
>;
export type ClearPersistentStoreEventCallback =
  EventListenerCallback<ClearPersistentStoreEvent>;

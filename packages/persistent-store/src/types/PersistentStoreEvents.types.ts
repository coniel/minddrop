import { EventListenerCallback } from '@minddrop/core';
import { PersistentStoreDocument } from './PersistentStoreDocument.types';
import { PersistentStoreChanges } from './PersistentStoreStore.types';

export type CreateGlobalStoreEvent = 'persistent-store:create-global';
export type CreateLocalStoreEvent = 'persistent-store:create-local';
export type UpdateGlobalStoreEvent = 'persistent-store:update-global';
export type UpdateLocalStoreEvent = 'persistent-store:update-local';

export type CreateGlobalStoreEventData = PersistentStoreDocument;
export type CreateLocalStoreEventData = PersistentStoreDocument;

export interface UpdateGlobalStoreEventData {
  /**
   * The store before it was updated.
   */
  before: PersistentStoreDocument;

  /**
   * The updated store.
   */
  after: PersistentStoreDocument;

  /**
   * Changes applied to the store.
   */
  changes: PersistentStoreChanges;
}

export interface UpdateLocalStoreEventData {
  /**
   * The store before it was updated.
   */
  before: PersistentStoreDocument;

  /**
   * The updated store.
   */
  after: PersistentStoreDocument;

  /**
   * Changes applied to the store.
   */
  changes: PersistentStoreChanges;
}

export type CreateGlobalStoreEventCallback = EventListenerCallback<
  CreateGlobalStoreEvent,
  CreateGlobalStoreEventData
>;
export type CreateLocalStoreEventCallback = EventListenerCallback<
  CreateLocalStoreEvent,
  CreateLocalStoreEventData
>;
export type UpdateGlobalStoreEventCallback = EventListenerCallback<
  UpdateGlobalStoreEvent,
  UpdateGlobalStoreEventData
>;
export type UpdateLocalStoreEventCallback = EventListenerCallback<
  UpdateLocalStoreEvent,
  UpdateLocalStoreEventData
>;

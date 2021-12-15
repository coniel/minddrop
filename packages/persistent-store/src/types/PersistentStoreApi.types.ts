import { Core } from '@minddrop/core';
import {
  UpdatePersistentStoreEvent,
  UpdatePersistentStoreEventCallback,
} from './PersistentStoreEvents.types';

export interface PersistentStoreApi {
  /**
   * Retrieves a value from the persistent store.
   *
   * @param core A MindDrop core instance.
   * @param key The key of the value to retrieve.
   * @retuns The value.
   */
  get<T = any>(core: Core, key: string): T;

  /**
   * Sets a value in the persistent store and dispaches a
   * `persistent-store:update` event.
   *
   * Supports `FieldValue` mutations.
   *
   * @param core A MindDrop core instance.
   * @param key The key for which to set the value.
   * @param value The value to set.
   */
  set(core: Core, key: string, value: any): void;

  /**
   * Deletes a key and assotiated data from the persistent
   * store. Dispatches a `persistent-store:update` event.
   *
   * @param core A MindDrop core instance.
   * @param key The key to delete.
   */
  delete(core: Core, key: string): void;

  /**
   * Permanently deletes all data added by an extension from
   * the persistent store.
   *
   * @param core A MindDrop core instance.
   */
  clear(core: Core): void;

  /**
   * Clears all data (including data added by other extensions)
   * from the local store. This does not delete the persisted data.
   *
   * Useful for forcefully refreshing the store when crating a
   * storage-adapter.
   */
  clearLocal(): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add persistent-store:update event listener
  addEventListener(
    core: Core,
    type: UpdatePersistentStoreEvent,
    callback: UpdatePersistentStoreEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // remove persistent-store:update event listener
  removeEventListener(
    core: Core,
    type: UpdatePersistentStoreEvent,
    callback: UpdatePersistentStoreEventCallback,
  ): void;
}

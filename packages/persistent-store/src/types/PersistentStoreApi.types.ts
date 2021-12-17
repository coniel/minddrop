import { Core } from '@minddrop/core';
import {
  UpdateGlobalStoreEvent,
  UpdateGlobalStoreEventCallback,
  UpdateLocalStoreEvent,
  UpdateLocalStoreEventCallback,
} from './PersistentStoreEvents.types';

export interface PersistentStoreApi {
  /**
   * Retrieves a value from the global store.
   *
   * @param core A MindDrop core instance.
   * @param key The key of the value to retrieve.
   * @retuns The value.
   */
  getGlobal<T = any>(core: Core, key: string): T;

  /**
   * Retrieves a value from the local (app specific)
   * store.
   *
   * @param core A MindDrop core instance.
   * @param key The key of the value to retrieve.
   * @retuns The value.
   */
  getLocal<T = any>(core: Core, key: string): T;

  /**
   * Sets a value in the global store and dispaches a
   * `persistent-store:update-global` event.
   *
   * Supports `FieldValue` mutations.
   *
   * @param core A MindDrop core instance.
   * @param key The key for which to set the value.
   * @param value The value to set.
   */
  setGlobal(core: Core, key: string, value: any): void;

  /**
   * Sets a value in the local (app specific) persistent store
   * and dispaches a `persistent-store:update-local` event.
   *
   * Supports `FieldValue` mutations.
   *
   * @param core A MindDrop core instance.
   * @param key The key for which to set the value.
   * @param value The value to set.
   */
  setLocal(core: Core, key: string, value: any): void;

  /**
   * Deletes a key and assotiated data from the global
   * store. Dispatches a `persistent-store:update-global`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param key The key to delete.
   */
  deleteGlobal(core: Core, key: string): void;

  /**
   * Deletes a key and assotiated data from the local (app
   * specific) persistent store. Dispatches a
   * `persistent-store:update-local` event.
   *
   * @param core A MindDrop core instance.
   * @param key The key to delete.
   */
  deleteLocal(core: Core, key: string): void;

  /**
   * Permanently deletes all data added by an extension from
   * the persistent store and dispatches a
   * `persistent-store:update-global` event.
   *
   * @param core A MindDrop core instance.
   */
  clearGlobal(core: Core): void;

  /**
   * Permanently deletes all data added by an extension from
   * the local (app specific) persistent store and dispatches
   * a `persistent-store:update-local` event.
   *
   * @param core A MindDrop core instance.
   */
  clearLocal(core: Core): void;

  /**
   * Clears all cached data (including data added by other
   * extensions) from the global store. This does not delete
   * the persisted data.
   *
   * Dispatches a `persistent-store:clear-global` event.
   *
   * Useful for forcefully refreshing the store from a
   * storage adapter.
   */
  clearGlobalCache(): void;

  /**
   * Clears all cached data (including data added by other
   * extensions) from the local (app specific) store. This
   * does not delete the persisted data.
   *
   * Dispatches a `persistent-store:clear-local` event.
   *
   * Useful for forcefully refreshing the store from a
   * storage adapter.
   */
  clearLocalCache(): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add persistent-store:update-global event listener
  addEventListener(
    core: Core,
    type: UpdateGlobalStoreEvent,
    callback: UpdateGlobalStoreEventCallback,
  ): void;

  // Add persistent-store:update-local event listener
  addEventListener(
    core: Core,
    type: UpdateLocalStoreEvent,
    callback: UpdateLocalStoreEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove persistent-store:update-global event listener
  removeEventListener(
    core: Core,
    type: UpdateGlobalStoreEvent,
    callback: UpdateGlobalStoreEventCallback,
  ): void;

  // Remove persistent-store:update-local event listener
  removeEventListener(
    core: Core,
    type: UpdateLocalStoreEvent,
    callback: UpdateLocalStoreEventCallback,
  ): void;
}

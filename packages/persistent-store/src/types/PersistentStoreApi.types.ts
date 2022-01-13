import { Core } from '@minddrop/core';
import {
  UpdateGlobalStoreEvent,
  UpdateGlobalStoreEventCallback,
  UpdateLocalStoreEvent,
  UpdateLocalStoreEventCallback,
} from './PersistentStoreEvents.types';

export interface PersistentStoreApi {
  /**
   * Returns an object containing all of the data stored
   * by an extension in the global store.
   *
   * @param core A MindDrop core instance.
   * @returns Extension's global store data.
   */
  getGlobalStore<T = any>(core: Core): T;

  /**
   * Returns an object containing all of the data stored
   * by an extension in the local store.
   *
   * @param core A MindDrop core instance.
   * @returns Extension's local store data.
   */
  getLocalStore<T = any>(core: Core): T;

  /**
   * Retrieves a value from the global store.
   *
   * @param core A MindDrop core instance.
   * @param key The key of the value to retrieve.
   * @param defaultValue The default value returned if the global store value does not exist.
   * @retuns The value.
   */
  getGlobalValue<T = any>(core: Core, key: string, defaultValue?: T): T;

  /**
   * Retrieves a value from the local (app specific)
   * store.
   *
   * @param core A MindDrop core instance.
   * @param key The key of the value to retrieve.
   * @param defaultValue The default value returned if the local store value does not exist.
   * @retuns The value.
   */
  getLocalValue<T = any>(core: Core, key: string, defaultValue?: T): T;

  /**
   * Sets an extension's data in the global store and dispaches
   * a persistent-store:update-global event.
   * Useful for initializing the extension's default global store
   * data upon extension activation.
   *
   * @param core A MindDrop core instance.
   * @param data
   */
  setGlobalStore(core: Core, data: Record<string, any>): void;

  /**
   * Sets an extension's data in the local store and dispaches
   * a persistent-store:update-global event.
   * Useful for initializing the extension's default local store
   * data upon extension activation.
   *
   * @param core A MindDrop core instance.
   * @param data
   */
  setLocalStore(core: Core, data: Record<string, any>): void;

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
  setGlobalValue(core: Core, key: string, value: any): void;

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
  setLocalValue(core: Core, key: string, value: any): void;

  /**
   * Deletes a key and assotiated data from the global
   * store. Dispatches a `persistent-store:update-global`
   * event.
   *
   * @param core A MindDrop core instance.
   * @param key The key to delete.
   */
  deleteGlobalValue(core: Core, key: string): void;

  /**
   * Deletes a key and assotiated data from the local (app
   * specific) persistent store. Dispatches a
   * `persistent-store:update-local` event.
   *
   * @param core A MindDrop core instance.
   * @param key The key to delete.
   */
  deleteLocalValue(core: Core, key: string): void;

  /**
   * Permanently deletes all data added by an extension from
   * the persistent store and dispatches a
   * `persistent-store:update-global` event.
   *
   * @param core A MindDrop core instance.
   */
  deleteGlobalStore(core: Core): void;

  /**
   * Permanently deletes all data added by an extension from
   * the local (app specific) persistent store and dispatches
   * a `persistent-store:update-local` event.
   *
   * @param core A MindDrop core instance.
   */
  deleteLocalStore(core: Core): void;

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

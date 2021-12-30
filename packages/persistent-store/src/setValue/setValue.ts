import { Core } from '@minddrop/core';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Sets a value in a store and dispaches a
 * `persistent-store:update-[global/local]` event.
 *
 * @param scope The scope for which to set the value.
 * @param core A MindDrop core instance.
 * @param key The key of the value to set.
 * @param value The value to set.
 */
export function setValue<T = any>(
  scope: PersistentStoreScope,
  core: Core,
  key: string,
  value: T,
): void {
  usePersistentStore.getState().set(scope, core.extensionId, key, value);
  const data = usePersistentStore.getState()[scope];

  core.dispatch(`persistent-store:update-${scope}`, data);
}
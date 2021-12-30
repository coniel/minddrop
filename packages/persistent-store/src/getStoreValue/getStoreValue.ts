import { Core } from '@minddrop/core';
import { getStore } from '../getStore';
import { PersistentStoreScope } from '../types';

/**
 * Does something useful.
 */
export function getStoreValue<T = any>(
  scope: PersistentStoreScope,
  core: Core,
  key: string,
  defaultValue?: T,
): T {
  const store = getStore(scope, core);

  return store[key] || defaultValue;
}

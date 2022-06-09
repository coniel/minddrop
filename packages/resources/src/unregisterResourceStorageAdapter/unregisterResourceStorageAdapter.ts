import { Core } from '@minddrop/core';
import { ResourceStorageAdapterConfig } from '../types';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';

/**
 * Unregisters a resource storage adapter.
 *
 * Dispatches a 'resources:storage-adapter:unregister'
 * event.
 *
 * @param core - A MindDrop core instance.
 * @param config - The storage adapter config to unregister.
 */
export function unregisterResourceStorageAdapter(
  core: Core,
  config: ResourceStorageAdapterConfig,
): void {
  // Unregister the config from the storage adapter store
  ResourceStorageAdaptersStore.unregister(config);

  // Dispatch a 'resources:storage-adapter:unregister' event
  core.dispatch('resources:storage-adapter:unregister', config);
}

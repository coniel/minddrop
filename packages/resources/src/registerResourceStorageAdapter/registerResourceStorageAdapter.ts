import { Core } from '@minddrop/core';
import { ResourceStorageAdaptersStore } from '../ResourceStorageAdaptersStore';
import { ResourceStorageAdapterConfig } from '../types';

/**
 * Registers a new resource storage adapter.
 *
 * Dispatches a 'resources:storage-adapter:register'
 * event.
 *
 * @param core - A MindDrop core instance.
 * @param config - The sotrage adapter config to register.
 */
export function registerResourceStorageAdapter(
  core: Core,
  config: ResourceStorageAdapterConfig,
): void {
  // Register the config into the storage adapters store
  ResourceStorageAdaptersStore.register(config);

  // Dispatch a 'resources:storage-adapter:register' event
  core.dispatch('resources:storage-adapter:register', config);
}

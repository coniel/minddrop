import { Core } from '@minddrop/core';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Loads resource documents into the store and
 * dispatches a `[resource]:load` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documents The documents to load.
 */
export function loadResourceDocuments<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documents: ResourceDocument<TData>[],
): void {
  // Load the documents into the store
  store.load(documents);

  // Dispatch a '[resource]:load' event
  core.dispatch(`${config.resource}:load`, documents);
}

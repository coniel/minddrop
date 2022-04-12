import { Core } from '@minddrop/core';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Sets (updates) a document the in resource store
 * and dispatches a `[resource]:set` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param document The document to set in the store.
 */
export function setResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  document: ResourceDocument<TData>,
): void {
  // Set the document in the store
  store.set(document);

  // Dispatch a '[resource]:set' event
  core.dispatch(`${config.resource}:set`, document);
}

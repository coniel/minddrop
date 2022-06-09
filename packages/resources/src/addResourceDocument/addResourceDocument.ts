import { Core } from '@minddrop/core';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Adds a document the to resource store and
 * dispatches a `[resource]:add` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param document The document to add to the store.
 */
export function addResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  document: ResourceDocument<TData>,
): void {
  // Add the document to the store
  store.set(document);

  // Dispatch a '[resource]:add' event
  core.dispatch(`${config.resource}:add`, document);
}

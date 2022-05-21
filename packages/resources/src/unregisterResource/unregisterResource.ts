import { Core } from '@minddrop/core';
import { ResourceApisStore } from '../ResourceApisStore';
import { ResourceApi, TypedResourceApi } from '../types';

/**
 * Unregisters a resource.
 *
 * @param core - A MindDrop core instance.
 * @param api - The API of the resource to register.
 */
export function unregisterResource(
  core: Core,
  resourceApi: ResourceApi | TypedResourceApi,
): void {
  // Get the registered resource
  const registeredResource = ResourceApisStore.get(resourceApi.resource);

  // Register the resource
  ResourceApisStore.unregister(registeredResource);

  // Dispatch a 'resources:resource:unregister' event
  core.dispatch('resources:resource:unregister', registeredResource);
}

import { Core } from '@minddrop/core';
import { ResourceApisStore } from '../ResourceApisStore';
import { ResourceApi, TypedResourceApi } from '../types';

/**
 * Registers a resource.
 *
 * @param core - A MindDrop core instance.
 * @param api - The API of the resource to register.
 */
export function registerResource(
  core: Core,
  resourceApi: ResourceApi | TypedResourceApi,
): void {
  // Create the registered resource API by adding
  // the extension ID to the resource API.
  const registeredResource = { ...resourceApi, extension: core.extensionId };

  // Register the resource
  ResourceApisStore.register(registeredResource);

  // Dispatch a 'resources:resource:register' event
  core.dispatch('resources:resource:register', registeredResource);
}

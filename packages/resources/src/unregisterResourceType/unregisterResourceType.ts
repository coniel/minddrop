import { Core } from '@minddrop/core';
import { ResourceTypeNotRegisteredError } from '../errors';
import {
  ResourceTypeConfig,
  TypedResourceConfig,
  ResourceTypeConfigsStore,
} from '../types';

/**
 * Unregisters a registered resource type and dispatches
 * a `[resource]:unregister` event.
 *
 * @param resourceConfig - The resource config.
 * @param typeConfigsStore - The resource type configs store.
 * @param typeConfig - The resource type config to unregister.
 *
 * @throws ResourceTypeNotRegistered
 * Thrown if the resource type is not registered.
 */
export function unregisterResourceType(
  core: Core,
  resourceConfig: TypedResourceConfig,
  typeConfigsStore: ResourceTypeConfigsStore,
  typeConfig: ResourceTypeConfig,
): void {
  // Get the registered type config
  const registeredConfig = typeConfigsStore.get(typeConfig.type);

  // Ensure that the type is registered
  if (!registeredConfig) {
    // Throw a `ResourceTypeNotRegisteredError` if the type
    // is not registered.
    throw new ResourceTypeNotRegisteredError(
      resourceConfig.resource,
      typeConfig.type,
    );
  }

  // Register the config in the type configs store
  typeConfigsStore.unregister(registeredConfig);

  // Dispatch a `[resource]:umregister` event
  core.dispatch(`${resourceConfig.resource}:unregister`, registeredConfig);
}

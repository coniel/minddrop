import { Core } from '@minddrop/core';
import { ResourceTypeNotRegisteredError } from '../errors';
import {
  ResourceTypeConfig,
  TypedResourceConfig,
  TypedResourceTypeConfigsStore,
} from '../types';

/**
 * Unregisters a registered resource type and dispatches
 * a `[resource]:unregister` event.
 *
 * @param resourceConfig - The resource config.
 * @param typeConfigsStore - The resource type configs store.
 * @param type- The type of the resource type to unrgister.
 *
 * @throws ResourceTypeNotRegistered
 * Thrown if the resource type is not registered.
 */
export function unregisterResourceType(
  core: Core,
  resourceConfig: TypedResourceConfig,
  typeConfigsStore: TypedResourceTypeConfigsStore,
  typeConfig: ResourceTypeConfig,
): void {
  // Ensure that the type is registered
  if (!typeConfigsStore.get(typeConfig.type)) {
    // Throw a `ResourceTypeNotRegisteredError` if the type
    // is not registered.
    throw new ResourceTypeNotRegisteredError(
      resourceConfig.resource,
      typeConfig.type,
    );
  }

  // Register the config in the type configs store
  typeConfigsStore.unregister(typeConfig);

  // Dispatch a `[resource]:umregister` event
  core.dispatch(`${resourceConfig.resource}:unregister`, typeConfig);
}

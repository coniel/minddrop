import { Core } from '@minddrop/core';
import {
  ResourceTypeConfig,
  TypedResourceConfig,
  ResourceTypeConfigsStore,
  TRDBaseData,
  TRDTypeData,
} from '../types';
import { validateTypedResourceDataSchema } from '../validateTypedResourceDataSchema';

/**
 * Registers a new resource type and dispatches
 * a `[resource]:register` event.
 *
 * @param resourceConfig - The resource config.
 * @param typeConfigsStore - The resource type configs store.
 * @param typeConfig - The config of the resource type to register.
 *
 * @throws InvalidResourceSchemaError
 * Thrown if the type's data schema is invalid.
 */
export function registerResourceType<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  core: Core,
  resourceConfig: TypedResourceConfig<TBaseData>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData>,
  typeConfig: ResourceTypeConfig<TBaseData, TTypeData>,
): void {
  // Ensure that the data schema is valid
  validateTypedResourceDataSchema(
    resourceConfig.resource,
    typeConfig.dataSchema,
  );

  // Add the extension ID to the config and register it
  // into the type configs store.
  typeConfigsStore.register({ ...typeConfig, extension: core.extensionId });

  // Dispatch a `[resource]:register` event
  core.dispatch(`${resourceConfig.resource}:register`, typeConfig);
}

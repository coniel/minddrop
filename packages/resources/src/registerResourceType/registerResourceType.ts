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
  TCustomTypeConfigOptions = {},
>(
  core: Core,
  resourceConfig: TypedResourceConfig<TBaseData>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData>,
  typeConfig: ResourceTypeConfig<
    TBaseData,
    TTypeData,
    TCustomTypeConfigOptions
  >,
): void {
  // Ensure that the data schema is valid
  validateTypedResourceDataSchema(
    resourceConfig.resource,
    typeConfig.dataSchema,
  );

  // Add the extension ID to the config
  const registeredTypeConfig = { ...typeConfig, extension: core.extensionId };

  // into the type configs store.
  typeConfigsStore.register(registeredTypeConfig);

  // Dispatch a `[resource]:register` event
  core.dispatch(`${resourceConfig.resource}:register`, registeredTypeConfig);
}

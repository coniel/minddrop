import { Core } from '@minddrop/core';
import {
  ResourceTypeConfig,
  TypedResourceConfig,
  TypedResourceTypeConfigsStore,
  TypedResourceDocumentBaseCustomData,
  TypedResourceDocumentTypeCustomData,
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
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
>(
  core: Core,
  resourceConfig: TypedResourceConfig<TBaseData>,
  typeConfigsStore: TypedResourceTypeConfigsStore<TBaseData>,
  typeConfig: ResourceTypeConfig<TBaseData, TTypeData>,
): void {
  // Ensure that the data schema is valid
  validateTypedResourceDataSchema(
    resourceConfig.resource,
    typeConfig.dataSchema,
  );

  // Register the config in the type configs store
  typeConfigsStore.register(typeConfig);

  // Dispatch a `[resource]:register` event
  core.dispatch(`${resourceConfig.resource}:register`, typeConfig);
}

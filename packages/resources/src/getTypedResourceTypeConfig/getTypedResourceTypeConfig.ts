import { ResourceTypeNotRegisteredError } from '../errors';
import {
  ResourceTypeConfig,
  TRDBaseData,
  TRDTypeData,
  ResourceTypeConfigsStore,
} from '../types';

/**
 * Returns a resource type config by `type`.
 *
 * @param resource - The resource name.
 * @param typeConfigsStore - The resource type configs store.
 * @param type - The type of the resource config to retrieve.
 * @returns A resource type config.
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the resource type is not registered.
 */
export function getTypedResourceTypeConfig<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  resource: string,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  type: string,
): ResourceTypeConfig<TBaseData, TTypeData> {
  // Get the config from the store
  const config = typeConfigsStore.get(type);

  if (!config) {
    // If the config is not registered, throw an error
    throw new ResourceTypeNotRegisteredError(resource, type);
  }

  return config;
}

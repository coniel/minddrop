import {
  TRDBaseData,
  TRDTypeData,
  ResourceTypeConfigsStore,
  ResourceTypeConfigFilters,
  RegisteredResourceTypeConfig,
} from '../types';

/**
 * Returns all registered resource type configs.
 *
 * @param typeConfigsStore - The resource type configs store.
 * @params filters - Optional filters by which to filter the returned configs.
 * @returns An array of resource type configs.
 */
export function getAllResourceTypeConfigs<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
  TCustomTypeConfigOptions = {},
>(
  typeConfigsStore: ResourceTypeConfigsStore<
    TBaseData,
    TTypeData,
    TCustomTypeConfigOptions
  >,
  filters: ResourceTypeConfigFilters = {},
): RegisteredResourceTypeConfig<
  TBaseData,
  TTypeData,
  TCustomTypeConfigOptions
>[] {
  // Get all type configs
  let configs = typeConfigsStore.getAll();

  // Filter by type
  if (filters.type) {
    configs = configs.filter((config) => filters.type.includes(config.type));
  }

  // Filter by extension
  if (filters.extension) {
    configs = configs.filter((config) =>
      filters.extension.includes(config.extension),
    );
  }

  return configs;
}

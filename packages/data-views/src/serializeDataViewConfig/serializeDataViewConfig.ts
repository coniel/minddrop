import { serializeItemReference } from '@minddrop/item-references';
import { getDataViewType } from '../getDataViewType';
import { DataViewConfig } from '../types';

/**
 * Serializes the item IDs within a view config into durable
 * references using the view type's serialization hook. Configs of
 * view types without the hook pass through unchanged.
 *
 * @param type - The view's type.
 * @param config - The view config to serialize.
 * @returns The serialized config.
 */
export function serializeDataViewConfig(
  type: string,
  config: DataViewConfig,
): DataViewConfig {
  // Look up the view type without throwing for unregistered types
  const viewType = getDataViewType(type, false);

  // Pass configs without a serialization hook through unchanged
  if (!viewType?.serializeReferences) {
    return config;
  }

  return viewType.serializeReferences(config, serializeItemReference);
}

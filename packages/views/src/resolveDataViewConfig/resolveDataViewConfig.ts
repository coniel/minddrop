import { resolveItemReference } from '@minddrop/item-references';
import { getDataViewType } from '../getDataViewType';
import { DataViewConfig } from '../types';

/**
 * Resolves the durable references within a view config back into
 * item IDs using the view type's serialization hook. Configs of
 * view types without the hook pass through unchanged.
 *
 * @param type - The view's type.
 * @param config - The view config to resolve.
 * @returns The resolved config.
 */
export function resolveDataViewConfig(
  type: string,
  config: DataViewConfig,
): DataViewConfig {
  // Look up the view type without throwing for unregistered types
  const viewType = getDataViewType(type, false);

  // Pass configs without a resolution hook through unchanged
  if (!viewType?.resolveReferences) {
    return config;
  }

  return viewType.resolveReferences(config, resolveItemReference);
}

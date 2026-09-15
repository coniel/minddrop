import { ItemReferences } from '@minddrop/item-references';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewConfig } from '../types';

/**
 * Serializes the item IDs within a view config into durable
 * references using the view type's serialization hook. Configs of
 * view types without the hook pass through unchanged.
 *
 * @param type - The view's type.
 * @param config - The view config to serialize.
 * @param workspaceId - The workspace the referenced items belong to. Omit for the active workspace.
 * @returns The serialized config.
 */
export function serializeContentViewConfig(
  type: string,
  config: ContentViewConfig,
  workspaceId?: string,
): ContentViewConfig {
  // Look up the view type without throwing for unregistered types
  const viewType = ContentViewTypesRegistry.get(type, false);

  // Pass configs without a serialization hook through unchanged
  if (!viewType?.serializeReferences) {
    return config;
  }

  return viewType.serializeReferences(config, (id) =>
    ItemReferences.serializeOne(id, workspaceId),
  );
}

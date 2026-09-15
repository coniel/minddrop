import { ItemReferences } from '@minddrop/item-references';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewConfig } from '../types';

/**
 * Resolves the durable references within a view config back into
 * item IDs using the view type's serialization hook. Configs of
 * view types without the hook pass through unchanged.
 *
 * @param type - The view's type.
 * @param config - The view config to resolve.
 * @param workspaceId - The workspace to resolve the references in. Omit for the active workspace.
 * @returns The resolved config.
 */
export function resolveContentViewConfig(
  type: string,
  config: ContentViewConfig,
  workspaceId?: string,
): ContentViewConfig {
  // Look up the view type without throwing for unregistered types
  const viewType = ContentViewTypesRegistry.get(type, false);

  // Pass configs without a resolution hook through unchanged
  if (!viewType?.resolveReferences) {
    return config;
  }

  return viewType.resolveReferences(config, (reference) =>
    ItemReferences.resolveOne(reference, workspaceId),
  );
}

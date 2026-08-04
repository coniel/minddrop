import { getDataViewType } from '../getDataViewType';
import { DataViewConfig } from '../types';

/**
 * Extracts the item IDs referenced within a view config using the
 * view type's serialization hook. Returns an empty array for view
 * types without the hook.
 *
 * @param type - The view's type.
 * @param config - The view config to extract references from.
 * @returns The referenced item IDs.
 */
export function extractDataViewReferences(
  type: string,
  config: DataViewConfig,
): string[] {
  // Look up the view type without throwing for unregistered types
  const viewType = getDataViewType(type, false);

  // View types without a serialization hook reference nothing
  if (!viewType?.serializeReferences) {
    return [];
  }

  // Collect the IDs by running the hook with an identity conversion
  const references: string[] = [];

  viewType.serializeReferences(config, (id) => {
    references.push(id);

    return id;
  });

  return references;
}

import { getDataViewType } from '../getDataViewType';
import { getReferencingDataViews } from '../getReferencingDataViews';
import { updateDataView } from '../updateDataView';

/**
 * Removes references to the given items from all data views
 * referencing them, updating each view's config through its view
 * type's serialization hook.
 *
 * @param itemIds - The removed item IDs.
 */
export async function removeDataViewReferences(
  itemIds: string[],
): Promise<void> {
  // Index the removed IDs for lookup
  const removedIds = new Set(itemIds);

  // Find views referencing the removed items
  const affectedViews = getReferencingDataViews(itemIds);

  await Promise.all(
    affectedViews.map((view) => {
      const viewType = getDataViewType(view.type, false);

      // Views without a serialization hook cannot be rewritten
      if (!viewType?.serializeReferences) {
        return undefined;
      }

      // Drop the removed items from the view's config
      const config = viewType.serializeReferences(
        { options: view.options, data: view.data },
        (id) => (removedIds.has(id) ? null : id),
      );

      // Persist the cleaned config
      return updateDataView(view.id, config, false);
    }),
  );
}

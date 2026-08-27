import { DataViewUpdatedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';

/**
 * Called when a view is updated. If the view is owned by a
 * database entry, persists the updated options and data to the
 * entry's metadata file.
 */
export async function onUpdateVirtualView(
  data: DataViewUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  // Only handle views owned by a database entry
  if (!updated.owner || !isEntityId(updated.owner, 'database-entry')) {
    return;
  }

  // Persist the updated view's config into its entry's metadata
  await persistVirtualViewConfig(updated);
}

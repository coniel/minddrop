import { DataViewUpdatedEventData } from '@minddrop/data-views';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';

/**
 * Called when a view is updated. If the view is a virtual entry view,
 * persists the updated options and data to the entry's metadata file.
 */
export async function onUpdateVirtualView(
  data: DataViewUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  // Only handle virtual views
  if (!updated.virtual) {
    return;
  }

  // Persist the updated view's config into its entry's metadata
  await persistVirtualViewConfig(updated);
}

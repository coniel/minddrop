import { ViewUpdatedEventData } from '@minddrop/views';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';

/**
 * Called when a view is updated. If the view is a virtual entry view,
 * persists the updated options and data to the entry's metadata file.
 */
export function onUpdateVirtualView(data: ViewUpdatedEventData): void {
  const { updated } = data;

  // Only handle virtual views
  if (!updated.virtual) {
    return;
  }

  // Persist the updated view's config into its entry's metadata
  persistVirtualViewConfig(updated);
}

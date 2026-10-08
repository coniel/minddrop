import { ContentViewUpdatedEventData } from '@minddrop/content-views';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';

/**
 * Called when a content view is updated. Persists the view's config
 * into its entry's metadata when a database entry owns it.
 *
 * @param data - The view update.
 */
export async function onUpdateContentView(
  data: ContentViewUpdatedEventData,
): Promise<void> {
  // Persist the updated view's config into its entry's metadata
  await persistVirtualViewConfig(data.updated);
}

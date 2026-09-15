import { ContentViewsStore } from '../../ContentViewsStore';
import { ContentView } from '../../types';

/**
 * Returns the most recently created persisted content views, newest
 * first. Virtual views belong to whatever made them rather than to
 * the workspace, so they are left out.
 *
 * @param limit - Maximum number of content views to return.
 * @returns The most recently created content views.
 */
export function getRecentContentViews(limit: number): ContentView[] {
  return ContentViewsStore.getAllArray()
    .filter((contentView) => !contentView.virtual)
    .sort(
      (contentViewA, contentViewB) =>
        contentViewB.created.getTime() - contentViewA.created.getTime(),
    )
    .slice(0, limit);
}

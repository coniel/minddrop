import { fuzzySearchBy } from '@minddrop/utils';
import { ContentViewsStore } from '../../ContentViewsStore';
import { ContentView } from '../../types';

/**
 * Performs a fuzzy search on content view names.
 *
 * @param query - The search query.
 * @param contentViews - IDs of the content views to include. All content views are included when omitted.
 * @returns The matched content views ranked by match quality.
 */
export function searchContentViews(
  query: string,
  contentViews?: string[],
): ContentView[] {
  const allContentViews = ContentViewsStore.getAllArray();

  // Filter content views to the given IDs when provided
  const searchedContentViews = contentViews
    ? filterByIds(allContentViews, contentViews)
    : allContentViews;

  return fuzzySearchBy(
    searchedContentViews,
    query,
    (contentView) => contentView.name,
  );
}

/**
 * Returns the content views with the given IDs.
 */
function filterByIds(
  contentViews: ContentView[],
  ids: string[],
): ContentView[] {
  const idSet = new Set(ids);

  return contentViews.filter((contentView) => idSet.has(contentView.id));
}

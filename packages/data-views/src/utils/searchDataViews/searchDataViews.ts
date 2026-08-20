import { fuzzySearchBy } from '@minddrop/utils';
import { DataViewsStore } from '../../DataViewsStore';
import { DataView } from '../../types';

/**
 * Performs a fuzzy search on data view names.
 *
 * @param query - The search query.
 * @param dataViews - IDs of the data views to include. All data views are included when omitted.
 * @returns The matched data views ranked by match quality.
 */
export function searchDataViews(
  query: string,
  dataViews?: string[],
): DataView[] {
  const allDataViews = DataViewsStore.getAllArray();

  // Filter data views to the given IDs when provided
  const searchedDataViews = dataViews
    ? filterByIds(allDataViews, dataViews)
    : allDataViews;

  return fuzzySearchBy(searchedDataViews, query, (dataView) => dataView.name);
}

/**
 * Returns the data views with the given IDs.
 */
function filterByIds(dataViews: DataView[], ids: string[]): DataView[] {
  const idSet = new Set(ids);

  return dataViews.filter((dataView) => idSet.has(dataView.id));
}

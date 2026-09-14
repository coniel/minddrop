import { DataViewsStore } from '../../DataViewsStore';
import { DataView } from '../../types';

/**
 * Returns the most recently created persisted data views, newest
 * first. Virtual views belong to whatever made them rather than to
 * the workspace, so they are left out.
 *
 * @param limit - Maximum number of data views to return.
 * @returns The most recently created data views.
 */
export function getRecentDataViews(limit: number): DataView[] {
  return DataViewsStore.getAllArray()
    .filter((dataView) => !dataView.virtual)
    .sort(
      (dataViewA, dataViewB) =>
        dataViewB.created.getTime() - dataViewA.created.getTime(),
    )
    .slice(0, limit);
}

import { ViewSessionSet } from '../types';
import { ViewSessionsStore } from './ViewSessionsStore';
import { getViewSessionSet } from './getViewSessionSet';

/**
 * Merges the given changes into the session set of the given view
 * area.
 *
 * @param viewAreaId - The id of the view area.
 * @param changes - The partial set data to merge.
 */
export function updateViewSessionSet(
  viewAreaId: string,
  changes: Partial<ViewSessionSet>,
): void {
  // Merge the changes onto the current set and store it
  ViewSessionsStore.set({ ...getViewSessionSet(viewAreaId), ...changes });
}

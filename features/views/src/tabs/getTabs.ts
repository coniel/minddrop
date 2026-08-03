import { Tab } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Returns all open tabs in the given set.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getTabs(viewAreaId: string): Tab[] {
  return getSet(viewAreaId).tabs;
}

import { Tab } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Returns all open tabs in the given set.
 *
 * @param setId - The id of the tab set.
 */
export function getTabs(setId: string): Tab[] {
  return getSet(setId).tabs;
}

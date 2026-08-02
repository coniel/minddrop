import { TabView } from '../TabSetsStore';

/**
 * Whether a tab view has the given instance id.
 *
 * @param tabView - The tab view to check, or null.
 * @param viewId - The instance id to match against.
 */
export function viewMatches(tabView: TabView | null, viewId: string): boolean {
  return tabView?.id === viewId;
}

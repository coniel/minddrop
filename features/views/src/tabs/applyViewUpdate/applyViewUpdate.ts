import { TabView } from '../TabSetsStore';
import { viewMatches } from '../viewMatches';

/**
 * Returns the tab view with the changes applied when it matches,
 * otherwise the original tab view unchanged.
 *
 * @param tabView - The tab view to update, or null.
 * @param viewId - The instance id the view must match to be updated.
 * @param changes - The new id, props (merged), title and icon.
 */
export function applyViewUpdate(
  tabView: TabView | null,
  viewId: string,
  changes: {
    id?: string;
    props?: Record<string, unknown>;
    title?: string;
    icon?: string;
  },
): TabView | null {
  // Leave the view unchanged when it does not match
  if (!viewMatches(tabView, viewId)) {
    return tabView;
  }

  // Apply the changes, merging props and keeping current values as
  // defaults
  return {
    ...tabView!,
    id: changes.id ?? tabView!.id,
    props: changes.props
      ? { ...(tabView!.props as Record<string, unknown>), ...changes.props }
      : tabView!.props,
    title: changes.title ?? tabView!.title,
    icon: changes.icon ?? tabView!.icon,
  };
}

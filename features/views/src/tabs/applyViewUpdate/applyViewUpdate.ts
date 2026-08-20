import { TabView } from '../TabSetsStore';
import { viewMatches } from '../viewMatches';

export interface ViewUpdateChanges {
  /**
   * The view's new instance id.
   */
  id?: string;

  /**
   * New props merged into the view's current props.
   */
  props?: Record<string, unknown>;

  /**
   * The view's new display title.
   */
  title?: string;

  /**
   * The view's new display icon.
   */
  icon?: string;
}

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
  changes: ViewUpdateChanges,
): TabView | null {
  // Nothing to update without a tab view
  if (!tabView) {
    return tabView;
  }

  // Keep the tab view as it is when it is not the updated view
  if (!viewMatches(tabView, viewId)) {
    return tabView;
  }

  // Apply the changes, merging props and keeping current values as
  // defaults
  return {
    ...tabView,
    id: changes.id ?? tabView.id,
    props: changes.props
      ? { ...(tabView.props as Record<string, unknown>), ...changes.props }
      : tabView.props,
    title: changes.title ?? tabView.title,
    icon: changes.icon ?? tabView.icon,
  };
}

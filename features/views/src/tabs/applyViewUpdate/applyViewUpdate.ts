import { ViewDescriptor } from '@minddrop/events';
import { TabView } from '../TabSetsStore';
import { viewMatches } from '../viewMatches';

interface ViewUpdateChanges {
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
 * otherwise the original tab view unchanged. Breadcrumb entries
 * matching the updated view are patched as well so persisted
 * trails don't go stale (e.g. after a rename).
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

  // Patch any breadcrumb entries matching the updated view
  const breadcrumbs = patchBreadcrumbs(tabView.breadcrumbs, viewId, changes);

  // Only the trail changes when the view itself does not match,
  // keeping the tab view's identity when nothing changed at all
  if (!viewMatches(tabView, viewId)) {
    return breadcrumbs === tabView.breadcrumbs
      ? tabView
      : { ...tabView, breadcrumbs };
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
    breadcrumbs,
  };
}

/**
 * Returns the breadcrumbs with the changes applied to entries
 * matching the updated view, or the original array unchanged when
 * no entry matches.
 */
function patchBreadcrumbs(
  breadcrumbs: ViewDescriptor[] | undefined,
  viewId: string,
  changes: ViewUpdateChanges,
): ViewDescriptor[] | undefined {
  // Nothing to patch without a trail
  if (!breadcrumbs) {
    return breadcrumbs;
  }

  // Track whether any entry actually matched
  let changed = false;

  // Apply the changes to matching entries, merging props and
  // keeping current values as defaults
  const patched = breadcrumbs.map((breadcrumb) => {
    // Leave non-matching entries unchanged
    if (breadcrumb.id !== viewId) {
      return breadcrumb;
    }

    changed = true;

    return {
      ...breadcrumb,
      id: changes.id ?? breadcrumb.id,
      props: changes.props
        ? { ...(breadcrumb.props as Record<string, unknown>), ...changes.props }
        : breadcrumb.props,
      title: changes.title ?? breadcrumb.title,
      icon: changes.icon ?? breadcrumb.icon,
    };
  });

  // Keep the original array's identity when nothing matched
  return changed ? patched : breadcrumbs;
}

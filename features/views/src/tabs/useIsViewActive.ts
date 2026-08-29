import { DefaultViewAreaId } from '@minddrop/views';
import { useActiveTab } from './TabSetsStore';
import { useBreadcrumbTrail } from './resolveBreadcrumbTrail';

export interface UseIsViewActiveOptions {
  /**
   * The id of the view instance to match, for views opened once per
   * entity (e.g. a specific database's view). Omitted to match the
   * view type alone.
   */
  viewId?: string;

  /**
   * The id of the view area, defaulting to the main one.
   */
  viewAreaId?: string;
}

/**
 * Returns whether the given view is the one shown in the view area's
 * active tab, or the view the shown one was opened from.
 *
 * @param view - The view type identifier.
 * @param options - Options to narrow the match.
 * @returns Whether the view is currently shown or leads to the shown one.
 */
export function useIsViewActive(
  view: string,
  options: UseIsViewActiveOptions = {},
): boolean {
  const { viewId, viewAreaId = DefaultViewAreaId } = options;
  const activeTab = useActiveTab(viewAreaId);
  const breadcrumbTrail = useBreadcrumbTrail(viewAreaId, 'main');
  const shownView = activeTab?.main;

  // The view is the one shown in the active tab's main pane
  if (shownView?.view === view && (!viewId || shownView.id === viewId)) {
    return true;
  }

  // The shown view was opened from it, keeping it in the trail
  return breadcrumbTrail.some(
    (breadcrumb) =>
      breadcrumb.view === view && (!viewId || breadcrumb.viewId === viewId),
  );
}

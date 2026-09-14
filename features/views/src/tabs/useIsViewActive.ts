import { ViewSessions, Views } from '@minddrop/views';

export interface UseIsViewActiveOptions {
  /**
   * The id of the view instance to match, for views opened once per
   * entity (e.g. a specific database's view). Omitted to match the
   * view type alone.
   */
  viewId?: string;

  /**
   * The id of the entity the view must be showing within itself,
   * for views listing several entities (e.g. a specific tag in the
   * tags list). Omitted to match the view whatever it shows.
   */
  subviewId?: string;

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
  const {
    viewId,
    subviewId,
    viewAreaId = Views.constants.DefaultAreaId,
  } = options;
  const activeSession = ViewSessions.useActive(viewAreaId);
  const breadcrumbTrail = ViewSessions.useBreadcrumbTrail(viewAreaId, 'main');
  const shownView = activeSession?.main;

  // The view is the one shown in the active session's main pane
  if (
    shownView?.view === view &&
    (!viewId || shownView.id === viewId) &&
    (!subviewId || shownView.subview?.id === subviewId)
  ) {
    return true;
  }

  // The trail does not record what a view showed, so a subview can
  // only match the shown view.
  if (subviewId) {
    return false;
  }

  // The shown view was opened from it, keeping it in the trail
  return breadcrumbTrail.some(
    (breadcrumb) =>
      breadcrumb.view === view && (!viewId || breadcrumb.viewId === viewId),
  );
}

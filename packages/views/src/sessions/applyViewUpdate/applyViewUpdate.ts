import { SessionView } from '../../types';
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
 * Returns the session view with the changes applied when it matches,
 * otherwise the original session view unchanged.
 *
 * @param sessionView - The session view to update, or null.
 * @param viewId - The instance id the view must match to be updated.
 * @param changes - The new id, props (merged), title and icon.
 */
export function applyViewUpdate(
  sessionView: SessionView | null,
  viewId: string,
  changes: ViewUpdateChanges,
): SessionView | null {
  // Nothing to update without a session view
  if (!sessionView) {
    return sessionView;
  }

  // Keep the session view as it is when it is not the updated view
  if (!viewMatches(sessionView, viewId)) {
    return sessionView;
  }

  // Apply the changes, merging props and keeping current values as
  // defaults.
  return {
    ...sessionView,
    id: changes.id ?? sessionView.id,
    props: changes.props
      ? { ...(sessionView.props as Record<string, unknown>), ...changes.props }
      : sessionView.props,
    title: changes.title ?? sessionView.title,
    contentIcon: changes.icon ?? sessionView.contentIcon,
  };
}

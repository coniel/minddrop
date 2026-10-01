import { ViewPane } from '../../types';
import { getActiveViewSession } from '../getActiveViewSession';
import { viewMatches } from '../viewMatches';

/**
 * Returns the pane of a view area's active session showing a view.
 *
 * @param viewAreaId - The ID of the view area.
 * @param viewId - The instance ID of the view.
 * @returns The pane showing the view, or null when no pane shows it.
 */
export function findViewSessionPane(
  viewAreaId: string,
  viewId: string,
): ViewPane | null {
  // Get the session the view area shows
  const session = getActiveViewSession(viewAreaId);

  if (!session) {
    return null;
  }

  // Check the main pane
  if (viewMatches(session.main, viewId)) {
    return 'main';
  }

  // Check the split pane
  if (viewMatches(session.split, viewId)) {
    return 'split';
  }

  return null;
}

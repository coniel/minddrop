import { ViewSessions } from '@minddrop/views';

/**
 * Closes every tab in the view area except the one with the given
 * id, making it active.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to keep.
 */
export function closeOtherTabs(viewAreaId: string, id: string): void {
  const sessions = ViewSessions.getAll(viewAreaId);

  // Nothing to do when the tab does not exist
  if (!sessions.some((session) => session.id === id)) {
    return;
  }

  // Activate the kept tab first, so closing the others leaves the
  // active tab in place and its content shown.
  ViewSessions.setActive(viewAreaId, id);

  // Close the other tabs
  ViewSessions.close(
    viewAreaId,
    sessions
      .filter((session) => session.id !== id)
      .map((session) => session.id),
  );
}

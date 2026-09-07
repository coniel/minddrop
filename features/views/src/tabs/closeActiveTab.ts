import { ViewSessions } from '@minddrop/views';

/**
 * Closes the active tab in the given view area, if there is one.
 *
 * @param viewAreaId - The id of the view area.
 */
export function closeActiveTab(viewAreaId: string): void {
  const active = ViewSessions.getActive(viewAreaId);

  // Close the active session when there is one
  if (active) {
    ViewSessions.close(viewAreaId, active.id);
  }
}

import { ViewSessions } from '@minddrop/views';

/**
 * Creates a blank tab in the view area when it has no tabs.
 *
 * @param viewAreaId - The id of the view area.
 */
export function ensureTab(viewAreaId: string): void {
  // Open a blank session when the view area is empty
  if (ViewSessions.getAll(viewAreaId).length === 0) {
    ViewSessions.create(viewAreaId);
  }
}

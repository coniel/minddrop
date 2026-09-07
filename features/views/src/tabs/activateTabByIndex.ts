import { ViewSessions } from '@minddrop/views';

/**
 * Activates the tab at the given index in the view area, if one
 * exists.
 *
 * @param viewAreaId - The id of the view area.
 * @param index - The zero-based index of the tab to activate.
 */
export function activateTabByIndex(viewAreaId: string, index: number): void {
  // Get the session at the given index
  const session = ViewSessions.getAll(viewAreaId)[index];

  // Activate it when one exists at that index
  if (session) {
    ViewSessions.setActive(viewAreaId, session.id);
  }
}

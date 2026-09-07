import { ViewSession } from '../../types';
import { getViewSessions } from '../getViewSessions';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Reorders the view area's sessions to match the given ordered list
 * of session ids.
 *
 * @param viewAreaId - The id of the view area.
 * @param orderedIds - The session ids in their new order.
 */
export function setViewSessionOrder(
  viewAreaId: string,
  orderedIds: string[],
): void {
  // Index the current sessions by id for lookup
  const sessionsById = new Map<string, ViewSession>(
    getViewSessions(viewAreaId).map((session) => [session.id, session]),
  );

  // Rebuild the sessions list in the given order, dropping any
  // unknown ids.
  const nextSessions = orderedIds
    .map((id) => sessionsById.get(id))
    .filter((session): session is ViewSession => session !== undefined);

  // Store the reordered sessions
  updateViewSessionSet(viewAreaId, { sessions: nextSessions });
}

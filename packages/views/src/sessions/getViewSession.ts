import { ViewSession } from '../types';
import { getViewSessions } from './getViewSessions';

/**
 * Returns the session with the given id in the view area, or null
 * when it does not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session.
 */
export function getViewSession(
  viewAreaId: string,
  sessionId: string,
): ViewSession | null {
  return (
    getViewSessions(viewAreaId).find((session) => session.id === sessionId) ??
    null
  );
}

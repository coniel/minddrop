import { ViewSession } from '../types';
import { getViewSessionSet } from './getViewSessionSet';

/**
 * Returns the active session in the given view area, or null when
 * there is none.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getActiveViewSession(viewAreaId: string): ViewSession | null {
  const set = getViewSessionSet(viewAreaId);

  // Find the session matching the set's active id
  return (
    set.sessions.find((session) => session.id === set.activeSessionId) ?? null
  );
}

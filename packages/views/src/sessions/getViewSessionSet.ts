import { ViewSessionSet } from '../types';
import { ViewSessionsStore } from './ViewSessionsStore';

/**
 * Returns the session set of the given view area, or an empty set
 * when none exists yet.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getViewSessionSet(viewAreaId: string): ViewSessionSet {
  // Return the stored set, or an empty set when the id is not yet stored
  return (
    ViewSessionsStore.get(viewAreaId) ?? {
      id: viewAreaId,
      sessions: [],
      activeSessionId: null,
    }
  );
}

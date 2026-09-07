import { ViewSession } from '../types';
import { getViewSessionSet } from './getViewSessionSet';

/**
 * Returns all open sessions in the given view area.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getViewSessions(viewAreaId: string): ViewSession[] {
  return getViewSessionSet(viewAreaId).sessions;
}

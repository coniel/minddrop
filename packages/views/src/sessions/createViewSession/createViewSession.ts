import { DefaultViewAreaId } from '../../constants';
import { dispatchViewArea } from '../dispatchViewArea';
import { generateBlankViewSession } from '../generateBlankViewSession';
import { getViewSessions } from '../getViewSessions';
import { updateViewSessionSet } from '../updateViewSessionSet';

export interface CreateViewSessionOptions {
  /**
   * The position at which to insert the session. Defaults to the end
   * of the view area's sessions.
   */
  index?: number;
}

/**
 * Opens a new blank session in the given view area and makes it
 * active.
 *
 * @param viewAreaId - The id of the view area, defaulting to the main one.
 * @param options - Options for positioning the session.
 *
 * @dispatches app:view-area:set
 */
export function createViewSession(
  viewAreaId: string = DefaultViewAreaId,
  options: CreateViewSessionOptions = {},
): void {
  const sessions = getViewSessions(viewAreaId);

  // Generate a new blank session
  const session = generateBlankViewSession();

  // Insert it at the requested position, or append it when none
  // was given.
  const index = options.index ?? sessions.length;

  // Add it to the view area and make it active
  updateViewSessionSet(viewAreaId, {
    sessions: [...sessions.slice(0, index), session, ...sessions.slice(index)],
    activeSessionId: session.id,
  });

  // Show the new (blank) session in the view area
  dispatchViewArea(viewAreaId, session);
}

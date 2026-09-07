import { entityId } from '@minddrop/utils';
import { dispatchViewArea } from '../dispatchViewArea';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Duplicates the session with the given id, inserting the copy
 * directly after it and making it active.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session to duplicate.
 *
 * @dispatches app:view-area:set
 */
export function duplicateViewSession(
  viewAreaId: string,
  sessionId: string,
): void {
  const { sessions } = getViewSessionSet(viewAreaId);

  // Find the session to duplicate
  const index = sessions.findIndex((session) => session.id === sessionId);

  // Nothing to do when the session does not exist
  if (index === -1) {
    return;
  }

  // Copy the session's views and split ratio into a new session,
  // leaving its history, transient state and slot claims behind.
  const duplicate = {
    ...sessions[index],
    id: entityId('session'),
    backHistory: [],
    forwardHistory: [],
    viewState: {},
    slots: undefined,
  };

  // Insert the copy directly after the original
  const nextSessions = [
    ...sessions.slice(0, index + 1),
    duplicate,
    ...sessions.slice(index + 1),
  ];

  // Store the new sessions and make the copy active
  updateViewSessionSet(viewAreaId, {
    sessions: nextSessions,
    activeSessionId: duplicate.id,
  });

  // Show the copy's content
  dispatchViewArea(viewAreaId, duplicate);
}

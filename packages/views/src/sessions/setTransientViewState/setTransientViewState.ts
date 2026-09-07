import { ViewPane } from '../../types';
import { getViewSession } from '../getViewSession';
import { updateViewSession } from '../updateViewSession';

/**
 * Stores a transient UI state value for a pane of the given session.
 * Passing undefined removes the key. Does nothing when the session
 * does not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session holding the state.
 * @param pane - The pane the state belongs to.
 * @param key - The scoped state key.
 * @param value - The JSON-serializable value to store.
 */
export function setTransientViewState(
  viewAreaId: string,
  sessionId: string,
  pane: ViewPane,
  key: string,
  value: unknown,
): void {
  // Find the session holding the state
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session does not exist
  if (!session) {
    return;
  }

  // Copy the pane's bag, sessions hydrated from disk may lack it
  const paneState = { ...(session.viewState?.[pane] ?? {}) };

  // Store the value, removing the key when it is undefined
  if (value === undefined) {
    delete paneState[key];
  } else {
    paneState[key] = value;
  }

  // Store the updated bag back onto the session
  updateViewSession(viewAreaId, sessionId, {
    viewState: { ...session.viewState, [pane]: paneState },
  });
}

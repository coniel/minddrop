import { ViewPane } from '../../types';
import { getViewSession } from '../getViewSession';

/**
 * Returns the transient UI state value stored for a pane of the given
 * session, or undefined when none is stored.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session holding the state.
 * @param pane - The pane the state belongs to.
 * @param key - The scoped state key.
 */
export function getTransientViewState(
  viewAreaId: string,
  sessionId: string,
  pane: ViewPane,
  key: string,
): unknown {
  return getViewSession(viewAreaId, sessionId)?.viewState?.[pane]?.[key];
}

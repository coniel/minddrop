import { useMemo } from 'react';
import { Breadcrumb, ViewPane } from '../../types';
import { useActiveViewSession } from '../ViewSessionsStore';
import { resolveBreadcrumbTrail } from './resolveBreadcrumbTrail';

/**
 * Returns the breadcrumb trail of the view shown in a pane of the
 * view area's active session, ordered root first.
 *
 * @param viewAreaId - The id of the view area.
 * @param pane - The pane the trail belongs to.
 */
export function useBreadcrumbTrail(
  viewAreaId: string,
  pane: ViewPane,
): Breadcrumb[] {
  const activeSession = useActiveViewSession(viewAreaId);

  // The session state the trail is derived from, tracked rather than
  // the session itself, which is rewritten by unrelated updates (e.g.
  // a recorded scroll position)
  const { main, split, backHistory } = activeSession ?? {};

  return useMemo(
    () => resolveBreadcrumbTrail(activeSession, pane),
    // The trail is derived from the panes and the history alone
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [main, split, backHistory, pane],
  );
}

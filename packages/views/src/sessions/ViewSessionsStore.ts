import { createObjectStore } from '@minddrop/stores';
import { ViewSession, ViewSessionSet } from '../types';

/**
 * Persistent store of view session sets, keyed by view area id. Each
 * set is an independent group of sessions (e.g. the main app tabs).
 */
export const ViewSessionsStore = createObjectStore<ViewSessionSet>(
  'Views:Sessions',
  'id',
  {
    persist: { target: 'app-workspace-config', namespace: 'sessions' },
    scope: 'workspace',
  },
);

/**
 * Returns all open sessions in the given view area.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useViewSessions(viewAreaId: string): ViewSession[] {
  return ViewSessionsStore.useItem(viewAreaId)?.sessions ?? [];
}

/**
 * Returns the id of the active session in the given view area.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useActiveViewSessionId(viewAreaId: string): string | null {
  return ViewSessionsStore.useItem(viewAreaId)?.activeSessionId ?? null;
}

/**
 * Returns the active session in the given view area, or null when it
 * has none.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useActiveViewSession(viewAreaId: string): ViewSession | null {
  const set = ViewSessionsStore.useItem(viewAreaId);

  return (
    set?.sessions.find((session) => session.id === set.activeSessionId) ?? null
  );
}

/**
 * Returns whether the active session in the given view area has back
 * history to navigate to.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useCanGoBack(viewAreaId: string): boolean {
  return Boolean(useActiveViewSession(viewAreaId)?.backHistory?.length);
}

/**
 * Returns whether the active session in the given view area has
 * forward history to navigate to.
 *
 * @param viewAreaId - The id of the view area.
 */
export function useCanGoForward(viewAreaId: string): boolean {
  return Boolean(useActiveViewSession(viewAreaId)?.forwardHistory?.length);
}

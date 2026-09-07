import { SessionView } from '../../types';

/**
 * Whether a session view has the given instance id.
 *
 * @param sessionView - The session view to check, or null.
 * @param viewId - The instance id to match against.
 */
export function viewMatches(
  sessionView: SessionView | null,
  viewId: string,
): boolean {
  return sessionView?.id === viewId;
}

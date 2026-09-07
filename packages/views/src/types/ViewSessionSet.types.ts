import { ViewSession } from './ViewSession.types';

/**
 * The sessions of a view area.
 */
export interface ViewSessionSet {
  /**
   * The id of the view area the sessions belong to.
   */
  id: string;

  /**
   * The ordered list of open sessions.
   */
  sessions: ViewSession[];

  /**
   * The id of the currently active session, or null when there are
   * no sessions.
   */
  activeSessionId: string | null;
}

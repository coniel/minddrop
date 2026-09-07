import { DefaultSplitRatio } from '../constants';
import { SetViewAreaEventData } from '../events';
import { ViewSession } from '../types';
import { toDescriptor } from './toDescriptor';

/**
 * Converts a session into a view area state.
 *
 * @param viewAreaId - The id of the view area.
 * @param session - The session to convert, or null.
 */
export function toSetViewAreaEventData(
  viewAreaId: string,
  session: ViewSession | null,
): SetViewAreaEventData {
  // A missing session maps to an empty view area state
  if (!session) {
    return {
      viewAreaId,
      main: null,
      split: null,
      splitRatio: DefaultSplitRatio,
    };
  }

  // Map the session's views and split ratio onto a view area state
  return {
    viewAreaId,
    main: toDescriptor(session.main),
    split: toDescriptor(session.split),
    splitRatio: session.splitRatio,
  };
}

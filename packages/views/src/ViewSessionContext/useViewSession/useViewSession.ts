import { useContext } from 'react';
import { ViewSessionContext } from '../ViewSessionContext';

/**
 * Returns the id of the session the calling component's view is
 * rendered for. Null outside of a view session.
 */
export function useViewSession(): string | null {
  return useContext(ViewSessionContext);
}

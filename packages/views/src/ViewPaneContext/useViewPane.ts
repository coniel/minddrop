import { useContext } from 'react';
import { ViewPaneLocation } from '../types';
import { ViewPaneContext } from './ViewPaneContext';

/**
 * Returns the location of the view instance the calling component is
 * rendered in. Null outside of a view area pane.
 */
export function useViewPane(): ViewPaneLocation | null {
  return useContext(ViewPaneContext);
}

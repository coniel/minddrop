import { createContext, useMemo } from 'react';
import { ViewPane, ViewPaneLocation } from '../types';

export const ViewPaneContext = createContext<ViewPaneLocation | null>(null);

export interface ViewPaneProviderProps {
  /**
   * The id of the view area the view instance is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane of the view area the view instance is rendered in.
   */
  pane: ViewPane;

  /**
   * The pane content.
   */
  children: React.ReactNode;
}

/**
 * Provides a view instance's location to the components rendered
 * inside it, allowing them to target their own pane when opening
 * other views.
 */
export const ViewPaneProvider: React.FC<ViewPaneProviderProps> = ({
  viewAreaId,
  pane,
  children,
}) => {
  // Memoize the location so consumers do not re-render on every
  // parent render
  const value = useMemo<ViewPaneLocation>(
    () => ({ viewAreaId, pane }),
    [viewAreaId, pane],
  );

  return (
    <ViewPaneContext.Provider value={value}>
      {children}
    </ViewPaneContext.Provider>
  );
};

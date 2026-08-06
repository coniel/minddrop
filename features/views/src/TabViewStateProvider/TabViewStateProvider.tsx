import React, { useMemo } from 'react';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from '@minddrop/ui-primitives';
import { ViewAreaPane, useActiveTabId } from '../tabs/TabSetsStore';
import { getTransientViewState } from '../tabs/getTransientViewState';
import { setTransientViewState } from '../tabs/setTransientViewState';

interface TabViewStateProviderProps {
  /**
   * The id of the view area whose active tab holds the state.
   */
  viewAreaId: string;

  /**
   * The pane the provided state bag belongs to.
   */
  pane: ViewAreaPane;

  /**
   * The pane content.
   */
  children: React.ReactNode;
}

/**
 * Provides the active tab's transient view state bag for a pane to
 * state-recording components (e.g. ScrollArea) rendered within it.
 */
export const TabViewStateProvider: React.FC<TabViewStateProviderProps> = ({
  viewAreaId,
  pane,
  children,
}) => {
  // The tab the provided bag belongs to
  const activeTabId = useActiveTabId(viewAreaId);

  // Bind the tab id at render time so writes flushed while the pane
  // unmounts during a tab switch land on the tab they were recorded
  // for, not the newly activated one
  const value = useMemo<TransientViewStateContextValue | null>(() => {
    // No bag to provide without an active tab
    if (!activeTabId) {
      return null;
    }

    return {
      get: (key) => getTransientViewState(viewAreaId, activeTabId, pane, key),
      set: (key, storedValue) =>
        setTransientViewState(viewAreaId, activeTabId, pane, key, storedValue),
    };
  }, [viewAreaId, activeTabId, pane]);

  // Render the content bare when there is no active tab
  if (!value) {
    return <>{children}</>;
  }

  return (
    <TransientViewStateProvider value={value}>
      {children}
    </TransientViewStateProvider>
  );
};

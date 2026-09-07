import React, { useMemo } from 'react';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from '@minddrop/ui-primitives';
import { ViewSessions, Views } from '@minddrop/views';

interface SessionViewStateProviderProps {
  /**
   * The pane content.
   */
  children: React.ReactNode;
}

/**
 * Provides the transient view state bag of the surrounding session's
 * pane to state-recording components (e.g. ScrollArea) rendered
 * within it.
 */
export const SessionViewStateProvider: React.FC<
  SessionViewStateProviderProps
> = ({ children }) => {
  // The session and pane the provided bag belongs to
  const sessionId = Views.useSession();
  const pane = Views.useViewPane();

  // Bound to the session at render time, so writes flushed while the
  // pane unmounts during a session switch land on the session they
  // were recorded for, not the newly activated one.
  const value = useMemo<TransientViewStateContextValue | null>(() => {
    // No bag to provide outside of a session pane
    if (!sessionId || !pane) {
      return null;
    }

    const { viewAreaId, pane: paneId } = pane;

    return {
      get: (key) =>
        ViewSessions.getTransientViewState(viewAreaId, sessionId, paneId, key),
      set: (key, storedValue) =>
        ViewSessions.setTransientViewState(
          viewAreaId,
          sessionId,
          paneId,
          key,
          storedValue,
        ),
    };
  }, [sessionId, pane]);

  // Render the content bare when there is no session pane
  if (!value) {
    return <>{children}</>;
  }

  return (
    <TransientViewStateProvider value={value}>
      {children}
    </TransientViewStateProvider>
  );
};

import { createContext } from 'react';

export const ViewSessionContext = createContext<string | null>(null);

export interface ViewSessionProviderProps {
  /**
   * The id of the session the view instance is rendered for.
   */
  sessionId: string;

  /**
   * The view content.
   */
  children: React.ReactNode;
}

/**
 * Provides a view instance's session to the components rendered
 * inside it, so that session-scoped state (transient view state, slot
 * claims) lands on the view's own session whether or not it is the
 * active one.
 */
export const ViewSessionProvider: React.FC<ViewSessionProviderProps> = ({
  sessionId,
  children,
}) => (
  <ViewSessionContext.Provider value={sessionId}>
    {children}
  </ViewSessionContext.Provider>
);

import React from 'react';

/* ============================================================
   TRANSIENT VIEW STATE SCOPE
   Accumulates a colon-joined key path so nested consumers get
   unique, stable state keys without knowing their ancestry.
   ============================================================ */

const TransientViewStateScopeContext = React.createContext<string>('');

export interface TransientViewStateScopeProps {
  /*
   * Content-derived key segment (e.g. an entity or layout ID).
   * Never use a render index, it breaks key stability when
   * siblings reorder.
   */
  segment: string;

  /*
   * The scoped content.
   */
  children: React.ReactNode;
}

/**
 * Appends a segment to the transient view state key path
 * for its children.
 */
export const TransientViewStateScope: React.FC<
  TransientViewStateScopeProps
> = ({ segment, children }) => {
  // Accumulated path from ancestor scopes
  const parentPath = React.useContext(TransientViewStateScopeContext);

  // Append this scope's segment to the path
  const path = parentPath ? `${parentPath}:${segment}` : segment;

  return (
    <TransientViewStateScopeContext.Provider value={path}>
      {children}
    </TransientViewStateScopeContext.Provider>
  );
};

/* Returns the full state key for a local key by prefixing the
   accumulated scope path. */
export function useTransientViewStateKey(localKey: string): string {
  // Accumulated path from ancestor scopes
  const scopePath = React.useContext(TransientViewStateScopeContext);

  return scopePath ? `${scopePath}:${localKey}` : localKey;
}

import React from 'react';

/* ============================================================
   TRANSIENT VIEW STATE CONTEXT
   Connects state-recording components (e.g. ScrollArea) to a
   storage backend provided higher up the tree. Without a
   provider, consumers no-op.
   ============================================================ */

export interface TransientViewStateContextValue {
  /*
   * Returns the stored value for the given full key, or
   * undefined when nothing is stored.
   */
  get: (key: string) => unknown;

  /*
   * Stores a JSON-serializable value under the full key.
   * Passing undefined removes the key.
   */
  set: (key: string, value: unknown) => void;
}

const TransientViewStateContext =
  React.createContext<TransientViewStateContextValue | null>(null);

export const TransientViewStateProvider = TransientViewStateContext.Provider;

/* Returns the transient view state backend, or null when no
   provider is present. Safe to call without a provider. */
export function useTransientViewStateContext(): TransientViewStateContextValue | null {
  return React.useContext(TransientViewStateContext);
}

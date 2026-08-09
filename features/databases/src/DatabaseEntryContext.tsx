import React, { createContext, useContext, useMemo } from 'react';
import { DatabaseEntryRenderSource } from '@minddrop/databases';

export type { DatabaseEntryRenderSource } from '@minddrop/databases';

/**
 * Context describing how database entries rendered within it
 * behave. Entries rendered outside a provider receive the
 * default values.
 */
export interface DatabaseEntryContextValue {
  /**
   * Whether the entries can be dragged.
   */
  draggable: boolean;

  /**
   * Whether the entries show an options menu button.
   */
  optionsMenu: boolean;

  /**
   * The source the entries are rendered from.
   */
  source?: DatabaseEntryRenderSource;
}

export const DatabaseEntryContext = createContext<DatabaseEntryContextValue>({
  draggable: false,
  optionsMenu: false,
});

export const useDatabaseEntryContext = () => useContext(DatabaseEntryContext);

export interface DatabaseEntryContextProviderProps
  extends Partial<DatabaseEntryContextValue> {
  /**
   * The content the context applies to.
   */
  children: React.ReactNode;
}

/**
 * Provides the database entry context for a portion of the UI.
 * Wrap the portions where entries should be draggable or show an
 * options menu (e.g. a view's content area but not its navigation
 * list). Omitted values are inherited from the parent context.
 */
export const DatabaseEntryContextProvider: React.FC<
  DatabaseEntryContextProviderProps
> = ({ children, draggable, optionsMenu, source }) => {
  const parentContext = useDatabaseEntryContext();

  // Override the provided values, inheriting the rest from the
  // parent context
  const value = useMemo(
    () => ({
      draggable: draggable ?? parentContext.draggable,
      optionsMenu: optionsMenu ?? parentContext.optionsMenu,
      source: source ?? parentContext.source,
    }),
    [parentContext, draggable, optionsMenu, source],
  );

  return (
    <DatabaseEntryContext.Provider value={value}>
      {children}
    </DatabaseEntryContext.Provider>
  );
};

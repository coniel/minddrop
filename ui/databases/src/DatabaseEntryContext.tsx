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

  /**
   * The ID of an entry whose layout should autofocus its editor
   * when the entry mounts, typically the just created entry.
   */
  autoFocusEntryId?: string;

  /**
   * Callback fired when the autofocus entry mounts, consuming
   * the autofocus so remounts do not steal focus later.
   */
  onEntryAutoFocused?: () => void;
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
> = ({
  children,
  draggable,
  optionsMenu,
  source,
  autoFocusEntryId,
  onEntryAutoFocused,
}) => {
  const parentContext = useDatabaseEntryContext();

  // Override the provided values, inheriting the rest from the
  // parent context
  const value = useMemo(
    () => ({
      draggable: draggable ?? parentContext.draggable,
      optionsMenu: optionsMenu ?? parentContext.optionsMenu,
      source: source ?? parentContext.source,
      autoFocusEntryId: autoFocusEntryId ?? parentContext.autoFocusEntryId,
      onEntryAutoFocused:
        onEntryAutoFocused ?? parentContext.onEntryAutoFocused,
    }),
    [
      parentContext,
      draggable,
      optionsMenu,
      source,
      autoFocusEntryId,
      onEntryAutoFocused,
    ],
  );

  return (
    <DatabaseEntryContext.Provider value={value}>
      {children}
    </DatabaseEntryContext.Provider>
  );
};

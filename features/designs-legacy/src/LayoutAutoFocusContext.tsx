import React, { createContext, useContext, useMemo, useRef } from 'react';

interface LayoutAutoFocusContextValue {
  /**
   * Claims the layout's editor autofocus. Returns true only for
   * the first caller while autofocus is active, so a layout with
   * multiple editors focuses just the first one to mount.
   */
  claimAutoFocus(): boolean;
}

const LayoutAutoFocusContext = createContext<LayoutAutoFocusContextValue>({
  claimAutoFocus: () => false,
});

/**
 * Returns the layout autofocus claim function. Outside a provider,
 * the claim always fails.
 */
export function useLayoutAutoFocus(): LayoutAutoFocusContextValue {
  return useContext(LayoutAutoFocusContext);
}

interface LayoutAutoFocusProviderProps {
  /**
   * Whether an editor in the layout should claim autofocus.
   */
  autoFocus: boolean;

  /**
   * The layout tree the autofocus applies to.
   */
  children: React.ReactNode;
}

/**
 * Provides the claim-once editor autofocus flag to a layout tree.
 */
export const LayoutAutoFocusProvider: React.FC<
  LayoutAutoFocusProviderProps
> = ({ autoFocus, children }) => {
  // Latest flag value, so claims from late-mounting editors see
  // the flag being cleared after the initial mount
  const autoFocusRef = useRef(autoFocus);

  // Whether an editor has already claimed the autofocus
  const claimedRef = useRef(false);

  // Keep the flag ref in sync with the prop
  autoFocusRef.current = autoFocus;

  // Stable context value so the layout tree does not re-render
  // when the flag clears
  const value = useMemo(
    () => ({
      claimAutoFocus: () => {
        // Fail the claim when autofocus is inactive or taken
        if (!autoFocusRef.current || claimedRef.current) {
          return false;
        }

        // Mark the autofocus as taken for subsequent callers
        claimedRef.current = true;

        return true;
      },
    }),
    [],
  );

  return (
    <LayoutAutoFocusContext.Provider value={value}>
      {children}
    </LayoutAutoFocusContext.Provider>
  );
};

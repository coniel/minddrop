import { useCallback, useMemo, useState } from 'react';
import { MenuTargetContextValue } from './MenuTargetContext';

export interface ActionsVisibleHold {
  /**
   * Whether any hold is currently active.
   */
  actionsVisible: boolean;

  /**
   * The context value to provide to the target's subtree.
   */
  menuTarget: MenuTargetContextValue;
}

/**
 * Tracks holds on a menu target's actions visibility, for menu
 * targets to provide to their subtree.
 *
 * @returns Whether the actions are held visible, and the context value providing the hold.
 */
export function useActionsVisibleHold(): ActionsVisibleHold {
  const [holds, setHolds] = useState(0);

  // Takes a hold on the actions' visibility. Releasing is delayed
  // so a popup closing to hand over to another does not flicker the
  // target, and a hold taken in the meantime keeps it held
  // throughout
  const holdActionsVisible = useCallback(() => {
    setHolds((currentHolds) => currentHolds + 1);

    let released = false;

    return () => {
      // Releases only count down once
      if (released) {
        return;
      }

      released = true;

      window.setTimeout(() => {
        setHolds((currentHolds) => currentHolds - 1);
      }, 100);
    };
  }, []);

  // Kept stable so holding does not re-run consumers' effects
  const menuTarget = useMemo(
    () => ({ holdActionsVisible }),
    [holdActionsVisible],
  );

  return { actionsVisible: holds > 0, menuTarget };
}

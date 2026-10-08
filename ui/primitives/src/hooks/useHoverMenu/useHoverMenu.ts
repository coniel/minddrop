import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { isEditableTarget } from '@minddrop/utils';
import type { HoverMenuContextValue } from '../../HoverMenuContext';
import type { PopoverRootChangeEventDetails } from '../../Popover';

export interface HoverMenuState {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Opens and closes the menu, for the popover's own open changes.
   * While the menu is locked or a field inside it is focused, a
   * close is taken from a press outside it or the escape key alone.
   */
  setOpen: (
    open: boolean,
    eventDetails?: PopoverRootChangeEventDetails,
  ) => void;

  /**
   * The context value to provide to the popup's content, through
   * which a popup opened from inside it locks the menu open.
   */
  hoverMenu: HoverMenuContextValue;

  /**
   * Props spread onto the trigger and the popup, marking them as
   * one menu so that crossing between them keeps it open.
   */
  hoverProps: {
    'data-hover-menu': string;
    onPointerEnter: () => void;
    onPointerLeave: (event: React.PointerEvent) => void;
  };
}

/**
 * How long after the pointer leaves the menu it closes. A pointer
 * that grazes past it gets a moment to come back.
 */
const CloseDelay = 80;

// The reasons a held menu closes for
const HeldCloseReasons: PopoverRootChangeEventDetails['reason'][] = [
  'outside-press',
  'escape-key',
];

/**
 * Holds a menu open while the pointer is on its trigger or its
 * popup. Closes it once the pointer leaves both.
 *
 * A popup opened from inside the menu locks it open, so the popup
 * can be used, and closed, with the pointer away from the menu. The
 * lock lifts once the pointer comes back, or the menu is closed by
 * a press outside it or the escape key. A field inside the menu
 * holds it open the same way while it is focused, so the pointer
 * can leave while typing.
 *
 * The menu closes itself rather than letting the popover do it. A
 * popover stops closing on hover for good once something inside it
 * has been pressed, which here is every time an option is chosen.
 *
 * @returns The menu's open state and the props holding it open.
 */
export function useHoverMenu(): HoverMenuState {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Whether the menu is locked open
  const lockedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Matches the trigger and the popup, which carry the menu's ID
  const menuSelector = `[data-hover-menu="${menuId}"]`;

  // Checks whether the menu is held open: locked, or a field inside
  // it focused.
  const isHeld = useCallback(() => {
    // Read the focused element
    const focused = document.activeElement;

    return (
      lockedRef.current ||
      (isEditableTarget(focused) && Boolean(focused?.closest(menuSelector)))
    );
  }, [menuSelector]);

  // Holds the menu open while the pointer is on it, lifting a lock
  const handlePointerEnter = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    lockedRef.current = false;
  }, []);

  // Closes the menu once the pointer leaves it for somewhere that
  // is neither the trigger nor the popup.
  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      const enteredElement = event.relatedTarget;

      // Keep the menu open while held
      if (isHeld()) {
        return;
      }

      // Keep it open when the pointer crossed to the trigger or the
      // popup.
      if (
        enteredElement instanceof Element &&
        enteredElement.closest(menuSelector)
      ) {
        return;
      }

      // Close it after the delay, restarting one already pending,
      // unless it has been held open since.
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => {
        if (!isHeld()) {
          setOpen(false);
        }
      }, CloseDelay);
    },
    [menuSelector, isHeld],
  );

  // Opens and closes the menu for the popover, holding a held menu
  // open against every close but a press outside it or the escape
  // key.
  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails?: PopoverRootChangeEventDetails) => {
      // Check for a close a held menu still takes
      const isHeldClose =
        !eventDetails || HeldCloseReasons.includes(eventDetails.reason);

      // Ignore any other close while held
      if (!nextOpen && !isHeldClose && isHeld()) {
        return;
      }

      // Closing lifts the lock, so the menu opens unlocked next time
      if (!nextOpen) {
        lockedRef.current = false;
      }

      setOpen(nextOpen);
    },
    [isHeld],
  );

  // Locks the menu open, cancelling a close the pointer has already
  // set off.
  const lock = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    lockedRef.current = true;
  }, []);

  // Kept stable so locking does not re-run consumers' effects
  const hoverMenu = useMemo(() => ({ lock }), [lock]);

  // The menu's state and the props holding it open
  return {
    open,
    setOpen: handleOpenChange,
    hoverMenu,
    hoverProps: {
      'data-hover-menu': menuId,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
  };
}

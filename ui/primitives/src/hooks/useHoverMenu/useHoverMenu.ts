import { useCallback, useId, useRef, useState } from 'react';

export interface HoverMenuState {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Opens and closes the menu, for the popover's own open changes.
   */
  setOpen: (open: boolean) => void;

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

/**
 * Holds a menu open while the pointer is on its trigger or its
 * popup. Closes it once the pointer leaves both.
 *
 * The menu closes itself rather than letting the popover do it. A
 * popover stops closing on hover for good once something inside it
 * has been pressed, which here is every time an option is chosen.
 *
 * @returns The menu's open state and the props holding it open.
 */
export function useHoverMenu(): HoverMenuState {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Holds the menu open while the pointer is on it
  const handlePointerEnter = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
  }, []);

  // Closes the menu once the pointer leaves it for somewhere that
  // is neither the trigger nor the popup.
  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      const enteredElement = event.relatedTarget;

      if (
        enteredElement instanceof Element &&
        enteredElement.closest(`[data-hover-menu="${menuId}"]`)
      ) {
        return;
      }

      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => setOpen(false), CloseDelay);
    },
    [menuId],
  );

  return {
    open,
    setOpen,
    hoverProps: {
      'data-hover-menu': menuId,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    },
  };
}

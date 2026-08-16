import React, { useEffect, useMemo, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  ScrollArea,
} from '@minddrop/ui-primitives';
import { RangeAnchor } from '../utils';
import './CursorMenu.css';

export interface CursorMenuProps {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Callback fired when the menu is dismissed.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The position and styling of the trigger text, measured when the menu was
   * opened.
   */
  anchor: RangeAnchor | null;

  /**
   * The hint rendered inline after the trigger text, prompting for a query.
   * Omit to render none.
   */
  hint?: React.ReactNode;

  /**
   * The menu's list of items.
   */
  children: React.ReactNode;

  /**
   * Class name applied to the menu's popup.
   */
  className?: string;

  /**
   * The index of the highlighted item, which the list is kept scrolled to.
   */
  activeIndex: number;
}

/**
 * Renders a menu against the text which triggered it, driven entirely from
 * the editor: the cursor stays where it is and the query keeps being typed
 * into the document.
 *
 * Shared by every menu opened by typing, so that they behave identically.
 */
export const CursorMenu: React.FC<CursorMenuProps> = ({
  open,
  onOpenChange,
  anchor,
  hint,
  children,
  className,
  activeIndex,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const selfScrolling = useRef(false);

  // Positioned against the trigger text rather than against a trigger
  // element, of which the menu has none
  const positionerAnchor = useMemo(
    () => (anchor ? { getBoundingClientRect: () => anchor.rect } : undefined),
    [anchor],
  );

  // Keep the highlighted item visible while navigating the list
  useEffect(() => {
    selfScrolling.current = true;

    popupRef.current
      ?.querySelector('[data-cursor-menu-active]')
      ?.scrollIntoView({ block: 'nearest' });

    // Scroll events are dispatched after the scroll is applied
    requestAnimationFrame(() => {
      selfScrolling.current = false;
    });
  }, [activeIndex]);

  // The menu is positioned against the text as it was when it opened, so the
  // page is held still while it is open. The menu scrolls its own list as
  // usual.
  useEffect(() => {
    if (!open) {
      return;
    }

    function preventScroll(event: Event): void {
      if (popupRef.current?.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
    }

    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [open]);

  // Scrolling which gets past the prevention, such as a page key or a
  // scrollbar drag, closes the menu rather than leaving it behind at the
  // position it was anchored to.
  useEffect(() => {
    if (!open || !anchor) {
      return;
    }

    function handleScroll(event: Event): void {
      // The menu scrolls its own list
      if (
        selfScrolling.current ||
        popupRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      onOpenChange(false);
    }

    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, anchor, onOpenChange]);

  return (
    <>
      {/* Hint rendered inline after the trigger text */}
      {hint && anchor && (
        <span
          className="cursor-menu-hint"
          style={{
            top: anchor.rect.top,
            left: anchor.rect.right,
            lineHeight: `${anchor.rect.height}px`,
            fontSize: anchor.fontSize,
            color: anchor.color,
          }}
        >
          {hint}
        </span>
      )}

      <Popover open={open} onOpenChange={onOpenChange} modal={false}>
        <PopoverPortal>
          <PopoverPositioner
            anchor={positionerAnchor}
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <PopoverContent
              ref={popupRef}
              className={className}
              // Focus stays in the editor so that the cursor remains visible
              // and the query can keep being typed
              initialFocus={false}
              finalFocus={false}
              onMouseDown={preventFocusLoss}
              onClick={stopPropagation}
            >
              <ScrollArea className="cursor-menu-scroll-area">
                {children}
              </ScrollArea>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </>
  );
};

/**
 * Prevents pressing the menu from moving focus out of the editor, which would
 * drop the cursor position the menu acts at.
 */
function preventFocusLoss(event: React.MouseEvent<HTMLDivElement>): void {
  event.preventDefault();
  event.stopPropagation();
}

function stopPropagation(event: React.MouseEvent<HTMLDivElement>): void {
  event.stopPropagation();
}

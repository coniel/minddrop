import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  MenuGroup,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  ScrollArea,
} from '@minddrop/ui-primitives';
import { BlockMenuItem, RangeAnchor } from '../utils';
import './BlockMenu.css';

export interface BlockMenuProps {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Callback fired when the menu is dismissed.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The position and styling of the trigger character, measured
   * when the menu was opened.
   */
  anchor: RangeAnchor | null;

  /**
   * Whether to render the hint prompting for a filter query.
   */
  showHint: boolean;

  /**
   * The entries listed in the menu, filtered by the query typed
   * into the editor.
   */
  menuItems: BlockMenuItem[];

  /**
   * The index of the highlighted entry.
   */
  activeIndex: number;

  /**
   * Callback fired when an entry is highlighted using the mouse.
   */
  onHighlight: (index: number) => void;

  /**
   * Callback fired when an entry is selected.
   */
  onSelect: (index: number) => void;
}

/**
 * Renders the list of block element types which can be inserted
 * into the editor, positioned against the cursor, along with a
 * hint rendered after the trigger character. Keyboard interaction
 * is driven from the editor, which keeps focus.
 */
export const BlockMenu: React.FC<BlockMenuProps> = ({
  open,
  onOpenChange,
  anchor,
  showHint,
  menuItems,
  activeIndex,
  onHighlight,
  onSelect,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const selfScrolling = useRef(false);
  const { t } = useTranslation();

  // Position the menu against the trigger character rather than
  // against a trigger element, of which the menu has none.
  const positionerAnchor = useMemo(
    () => (anchor ? { getBoundingClientRect: () => anchor.rect } : undefined),
    [anchor],
  );

  // Keep the highlighted entry visible while navigating the list
  useEffect(() => {
    selfScrolling.current = true;

    activeItemRef.current?.scrollIntoView({ block: 'nearest' });

    // Scroll events are dispatched after the scroll is applied
    requestAnimationFrame(() => {
      selfScrolling.current = false;
    });
  }, [activeIndex]);

  // The menu is positioned against the text as it was when it
  // opened, so the page is held still while it is open. The menu
  // scrolls its own list as usual.
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

  // Scrolling which gets past the prevention, such as a page key
  // or a scrollbar drag, closes the menu rather than leaving it
  // behind at the position it was anchored to. Only listened for
  // once anchored, by which point any scroll caused by typing the
  // trigger character has been applied.
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

  // Moves the highlight to the entry under the pointer
  function handleItemMouseMove(
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
  ): void {
    const { clientX, clientY } = event;
    const previous = pointerPosition.current;

    // Scrolling the list under a stationary pointer fires a move
    // event, which must not take the highlight off the entry the
    // keyboard navigated to.
    if (clientX === previous.x && clientY === previous.y) {
      return;
    }

    pointerPosition.current = { x: clientX, y: clientY };

    onHighlight(index);
  }

  return (
    <>
      {/* Hint rendered inline after the trigger character */}
      {showHint && anchor && (
        <span
          className="block-menu-hint"
          style={{
            top: anchor.rect.top,
            left: anchor.rect.right,
            lineHeight: `${anchor.rect.height}px`,
            fontSize: anchor.fontSize,
            color: anchor.color,
          }}
        >
          {t('editor.blockMenu.hint')}
        </span>
      )}

      {/* Block type list */}
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
              className="block-menu"
              // Focus stays in the editor so that the cursor
              // remains visible and the query can keep being typed
              initialFocus={false}
              finalFocus={false}
              onMouseDown={handlePopupMouseDown}
              onClick={stopPropagation}
            >
              <ScrollArea className="block-menu-scroll-area">
                <MenuGroup>
                  {menuItems.map((menuItem, index) => (
                    <MenuItem
                      key={menuItem.label}
                      ref={index === activeIndex ? activeItemRef : undefined}
                      label={menuItem.label}
                      icon={menuItem.icon}
                      active={index === activeIndex}
                      onMouseMove={(event) => handleItemMouseMove(event, index)}
                      onClick={() => onSelect(index)}
                    />
                  ))}
                </MenuGroup>
              </ScrollArea>
            </PopoverContent>
          </PopoverPositioner>
        </PopoverPortal>
      </Popover>
    </>
  );
};

/**
 * Prevents pressing the menu from moving focus out of the editor,
 * which would drop the cursor position at which the block is
 * inserted.
 */
function handlePopupMouseDown(event: React.MouseEvent<HTMLDivElement>): void {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Keeps menu events from reaching handlers outside of the editor.
 * The menu renders into a portal, but React events still bubble
 * through the tree the menu is rendered in.
 */
function stopPropagation(event: React.MouseEvent<HTMLDivElement>): void {
  event.stopPropagation();
}

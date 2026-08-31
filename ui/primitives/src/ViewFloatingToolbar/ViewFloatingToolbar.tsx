import React, { useEffect, useRef, useState } from 'react';
import { FloatingToolbar, FloatingToolbarProps } from '../FloatingToolbar';
import { propsToClass } from '../utils';
import './ViewFloatingToolbar.css';

export type ViewFloatingToolbarPosition = 'sticky' | 'absolute';

export interface ViewFloatingToolbarProps extends FloatingToolbarProps {
  /**
   * The toolbar's contents.
   */
  children?: React.ReactNode;

  /**
   * Whether a menu rendered inside the toolbar is open. While
   * open, the toolbar pins its right edge in place so that
   * content changes resize it leftward rather than re-centering
   * it (which would move the open menu).
   */
  menuOpen?: boolean;

  /**
   * How the toolbar is positioned.
   * - `sticky` - sticks to the bottom of the nearest scrollport
   * - `absolute` - pinned to the bottom of the nearest positioned
   *   ancestor, staying in place as its content scrolls
   * @default 'sticky'
   */
  position?: ViewFloatingToolbarPosition;

  /**
   * Class name applied to the toolbar element.
   */
  className?: string;
}

/**
 * Renders a view's primary floating toolbar, centered on the
 * bottom of the view.
 *
 * Unless made permanently visible, the toolbar is revealed while
 * its host is hovered, which requires the host element to carry
 * the `floating-toolbar-host` class.
 */
export const ViewFloatingToolbar: React.FC<ViewFloatingToolbarProps> = ({
  children,
  menuOpen = false,
  position = 'sticky',
  className,
  ...other
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  // The menu open state the pinning effect last reacted to, used
  // to ignore renders in which it did not change
  const previousMenuOpenRef = useRef(menuOpen);

  // The toolbar's right edge offset from the anchor while a menu
  // is open, pinning it in place
  const [pinnedRightOffset, setPinnedRightOffset] = useState<number | null>(
    null,
  );

  // Pin the toolbar's right edge while a menu is open, keeping
  // the menu trigger (and thus the open menu) in place. On close,
  // move the pin to the centered position so the CSS transition
  // animates the toolbar back to center.
  useEffect(() => {
    // Ignore renders in which the menu's open state did not change
    if (menuOpen === previousMenuOpenRef.current) {
      return;
    }

    previousMenuOpenRef.current = menuOpen;

    // Nothing to unpin when the toolbar was never pinned
    if (!menuOpen && pinnedRightOffset === null) {
      return;
    }

    const content = anchorRef.current?.querySelector('.floating-toolbar');

    if (!(content instanceof HTMLElement)) {
      setPinnedRightOffset(null);

      return;
    }

    // The toolbar is centered on the anchor, so its right edge
    // sits half its width to the right of it
    const centeredOffset = content.offsetWidth / 2;

    // Closing without a size change: already centered, unpin
    // directly as no transition will fire
    if (!menuOpen && pinnedRightOffset === centeredOffset) {
      setPinnedRightOffset(null);

      return;
    }

    setPinnedRightOffset(centeredOffset);
  }, [menuOpen, pinnedRightOffset]);

  // Unpin once the toolbar has animated back to the centered
  // position, at which point clearing the pin causes no movement
  function handleToolbarTransitionEnd(event: React.TransitionEvent) {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'right'
    ) {
      setPinnedRightOffset(null);
    }
  }

  return (
    /* A zero sized anchor which the toolbar is centered on */
    <div
      ref={anchorRef}
      className={propsToClass('view-floating-toolbar-anchor', { position })}
    >
      <FloatingToolbar
        className={propsToClass('view-floating-toolbar', { className })}
        style={
          pinnedRightOffset !== null
            ? { left: 'auto', right: -pinnedRightOffset, transform: 'none' }
            : undefined
        }
        onTransitionEnd={handleToolbarTransitionEnd}
        {...other}
      >
        {children}
      </FloatingToolbar>
    </div>
  );
};

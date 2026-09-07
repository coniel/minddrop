import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import React from 'react';
import { propsToClass } from '../utils';
import type { ScrollAreaEndPadding, ScrollAreaVisibility } from './ScrollArea';
import { useScrollStatePersistence } from './useScrollStatePersistence';
import { useScrollVisibility } from './useScrollVisibility';

export interface VerticalScrollAreaProps {
  children: React.ReactNode;
  /*
   * When to show the scrollbar.
   * @default 'hover'
   */
  visibility?: ScrollAreaVisibility;
  /*
   * Records and restores the scroll position via the
   * surrounding transient view state context, under this key
   * within the current scope. Omit to opt out (e.g. menus,
   * pickers).
   */
  stateKey?: string;
  /*
   * Whitespace kept below the content, so that it does not sit
   * against the bottom edge when scrolled to the end.
   */
  endPadding?: ScrollAreaEndPadding;
  className?: string;
  style?: React.CSSProperties;
}

export const VerticalScrollArea = React.forwardRef<
  HTMLDivElement,
  VerticalScrollAreaProps
>(
  (
    { children, visibility = 'hover', stateKey, endPadding, className, style },
    ref,
  ) => {
    const { setRef, handleScroll } = useScrollVisibility(visibility, ref);
    const { viewportRef, handlePersistScroll } =
      useScrollStatePersistence(stateKey);

    // Forward scroll events to persistence and visibility handling,
    // keeping the scrollbar hidden for programmatic restore scrolls
    const handleViewportScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const programmatic = handlePersistScroll(event);

      if (!programmatic) {
        handleScroll();
      }
    };

    return (
      <ScrollAreaPrimitive.Root
        ref={setRef}
        className={propsToClass('scroll-area', {
          visibility,
          endPadding,
          className,
        })}
        style={style}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="scroll-area-viewport"
          onScroll={handleViewportScroll}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className="scroll-area-scrollbar"
        >
          <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
        </ScrollAreaPrimitive.Scrollbar>
      </ScrollAreaPrimitive.Root>
    );
  },
);

VerticalScrollArea.displayName = 'VerticalScrollArea';

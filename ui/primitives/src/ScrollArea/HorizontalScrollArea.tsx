import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import React from 'react';
import { propsToClass } from '../utils';
import type { ScrollAreaVisibility } from './ScrollArea';
import { useScrollStatePersistence } from './useScrollStatePersistence';
import { useScrollVisibility } from './useScrollVisibility';

export interface HorizontalScrollAreaProps {
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
  className?: string;
  style?: React.CSSProperties;
}

export const HorizontalScrollArea = React.forwardRef<
  HTMLDivElement,
  HorizontalScrollAreaProps
>(({ children, visibility = 'hover', stateKey, className, style }, ref) => {
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
      className={propsToClass('scroll-area', { visibility, className })}
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
        orientation="horizontal"
        className="scroll-area-scrollbar"
      >
        <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
});

HorizontalScrollArea.displayName = 'HorizontalScrollArea';

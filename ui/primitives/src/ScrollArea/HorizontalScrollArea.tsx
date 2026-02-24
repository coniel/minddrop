import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import React from 'react';
import { propsToClass } from '../utils';
import { useScrollVisibility } from './useScrollVisibility';
import type { ScrollAreaVisibility } from './ScrollArea';

export interface HorizontalScrollAreaProps {
  children: React.ReactNode;
  /*
   * When to show the scrollbar.
   * @default 'hover'
   */
  visibility?: ScrollAreaVisibility;
  className?: string;
  style?: React.CSSProperties;
}

export const HorizontalScrollArea = React.forwardRef<
  HTMLDivElement,
  HorizontalScrollAreaProps
>(({ children, visibility = 'hover', className, style }, ref) => {
  const { setRef, handleScroll } = useScrollVisibility(visibility, ref);

  return (
    <ScrollAreaPrimitive.Root
      ref={setRef}
      className={propsToClass('scroll-area', { visibility, className })}
      style={style}
    >
      <ScrollAreaPrimitive.Viewport
        className="scroll-area-viewport"
        onScroll={handleScroll}
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

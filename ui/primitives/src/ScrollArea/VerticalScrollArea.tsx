import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import React from 'react';
import { propsToClass } from '../utils';
import type { ScrollAreaVisibility } from './ScrollArea';
import { useScrollVisibility } from './useScrollVisibility';

export interface VerticalScrollAreaProps {
  children: React.ReactNode;
  /*
   * When to show the scrollbar.
   * @default 'hover'
   */
  visibility?: ScrollAreaVisibility;
  className?: string;
  style?: React.CSSProperties;
}

export const VerticalScrollArea = React.forwardRef<
  HTMLDivElement,
  VerticalScrollAreaProps
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
        orientation="vertical"
        className="scroll-area-scrollbar"
      >
        <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
});

VerticalScrollArea.displayName = 'VerticalScrollArea';

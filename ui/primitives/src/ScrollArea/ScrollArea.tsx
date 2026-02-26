import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';
import React from 'react';
import { propsToClass } from '../utils';
import { useScrollVisibility } from './useScrollVisibility';
import './ScrollArea.css';

export type ScrollAreaVisibility = 'hover' | 'scroll' | 'always';

/* ============================================================
   PRIMITIVE RE-EXPORTS
   ============================================================ */

export type ScrollAreaRootProps = ScrollAreaPrimitive.Root.Props;
export type ScrollAreaViewportProps = ScrollAreaPrimitive.Viewport.Props;
export type ScrollAreaScrollbarProps = ScrollAreaPrimitive.Scrollbar.Props;
export type ScrollAreaThumbProps = ScrollAreaPrimitive.Thumb.Props;
export type ScrollAreaCornerProps = ScrollAreaPrimitive.Corner.Props;

export const ScrollAreaRoot = ScrollAreaPrimitive.Root;
export const ScrollAreaViewport = ScrollAreaPrimitive.Viewport;
export const ScrollAreaScrollbar = ScrollAreaPrimitive.Scrollbar;
export const ScrollAreaThumb = ScrollAreaPrimitive.Thumb;
export const ScrollAreaCorner = ScrollAreaPrimitive.Corner;

/* ============================================================
   SCROLL AREA — vertical + horizontal with corner
   ============================================================ */

export interface ScrollAreaProps {
  children: React.ReactNode;
  /*
   * When to show the scrollbars.
   * - hover  — visible when the container is hovered
   * - scroll — visible while scrolling, fades out after ~1.5s
   * - always — always visible
   * @default 'hover'
   */
  visibility?: ScrollAreaVisibility;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, visibility = 'scroll', className, style }, ref) => {
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

        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="scroll-area-scrollbar"
        >
          <ScrollAreaPrimitive.Thumb className="scroll-area-thumb" />
        </ScrollAreaPrimitive.Scrollbar>

        <ScrollAreaPrimitive.Corner className="scroll-area-corner" />
      </ScrollAreaPrimitive.Root>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';

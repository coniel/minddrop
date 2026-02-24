import React, { FC, useCallback, useRef, useState } from 'react';
import { Panel, propsToClass } from '@minddrop/ui-primitives';
import './Sidebar.css';

const minWidth = 240;
const maxWidth = 500;

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The initial width in px of the sidebar.
   */
  initialWidth?: number;

  /**
   * Callback fired when user finishes resizing the sidebar.
   */
  onResized?: (width: number) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  children,
  className,
  style = {},
  initialWidth = 300,
  onResized,
  ...other
}) => {
  const sidebar = useRef<HTMLDivElement>(null);
  const dragOffest = useRef<number>(initialWidth);
  const widthRef = useRef<number>(initialWidth);
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!sidebar.current || !dragOffest.current) {
        return;
      }

      const newWidth = Math.min(
        Math.max(event.clientX - dragOffest.current, minWidth),
        maxWidth,
      );

      setWidth(newWidth);
      widthRef.current = newWidth;
    },
    [dragOffest],
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setIsDragging(false);

    if (onResized && widthRef.current) {
      onResized(widthRef.current);
    }
  }, [onResized, handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      setIsDragging(true);
      dragOffest.current = event.clientX - width;
    },
    [width, handleMouseMove, handleMouseUp],
  );

  return (
    <Panel
      ref={sidebar}
      className={propsToClass('app-sidebar', { className, isDragging })}
      {...other}
      style={{ ...style, width }}
      data-width={width}
    >
      {children}
      <div
        className="resize-handle"
        data-testid="resize-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="resize-indicator" />
      </div>
    </Panel>
  );
};

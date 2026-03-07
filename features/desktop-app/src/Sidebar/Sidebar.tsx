import React, { FC, useCallback, useRef, useState } from 'react';
import { propsToClass } from '@minddrop/ui-primitives';
import './Sidebar.css';

const minWidth = 240;
const maxWidth = 500;

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width in px of the sidebar.
   */
  width?: number;

  /**
   * Callback fired when user finishes resizing the sidebar.
   */
  onResized?: (width: number) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  children,
  className,
  style = {},
  width: widthProp = 300,
  onResized,
  ...other
}) => {
  const sidebar = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<number>(0);
  const dragWidth = useRef<number>(widthProp);
  const [isDragging, setIsDragging] = useState(false);

  // Use local drag width during drag, prop value otherwise
  const width = isDragging ? dragWidth.current : widthProp;

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!sidebar.current) {
      return;
    }

    const newWidth = Math.min(
      Math.max(event.clientX - dragOffset.current, minWidth),
      maxWidth,
    );

    dragWidth.current = newWidth;

    // Update the DOM directly during drag for smooth resizing
    sidebar.current.style.width = `${newWidth}px`;
    sidebar.current.setAttribute('data-width', String(newWidth));
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setIsDragging(false);

    if (onResized) {
      onResized(dragWidth.current);
    }
  }, [onResized, handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      setIsDragging(true);
      dragOffset.current = event.clientX - widthProp;
      dragWidth.current = widthProp;
    },
    [widthProp, handleMouseMove, handleMouseUp],
  );

  return (
    <div
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
    </div>
  );
};

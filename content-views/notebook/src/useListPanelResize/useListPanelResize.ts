import { useCallback, useRef, useState } from 'react';
import { MAX_LIST_COLUMN_WIDTH, MIN_LIST_COLUMN_WIDTH } from '../constants';

interface UseListPanelResizeOptions {
  /**
   * The initial width of the list panel in pixels.
   */
  initialWidth: number;

  /**
   * Callback fired when the user finishes resizing.
   */
  onResizeEnd: (width: number) => void;
}

interface UseListPanelResizeResult {
  /**
   * The current width of the list panel.
   */
  width: number;

  /**
   * Whether the user is currently dragging the resize handle.
   */
  isDragging: boolean;

  /**
   * Mouse down handler for the resize handle.
   */
  startResize: (event: React.MouseEvent) => void;
}

/**
 * Hook that manages the resizable list panel width via mouse drag.
 */
export function useListPanelResize({
  initialWidth,
  onResizeEnd,
}: UseListPanelResizeOptions): UseListPanelResizeResult {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef(0);
  const widthRef = useRef(initialWidth);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Clamp the new width between the min and max bounds
    const newWidth = Math.min(
      Math.max(event.clientX - dragOffset.current, MIN_LIST_COLUMN_WIDTH),
      MAX_LIST_COLUMN_WIDTH,
    );

    setWidth(newWidth);
    widthRef.current = newWidth;
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = '';
    setIsDragging(false);

    onResizeEnd(widthRef.current);
  }, [onResizeEnd, handleMouseMove]);

  const startResize = useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      setIsDragging(true);
      dragOffset.current = event.clientX - width;
    },
    [width, handleMouseMove, handleMouseUp],
  );

  return { width, isDragging, startResize };
}

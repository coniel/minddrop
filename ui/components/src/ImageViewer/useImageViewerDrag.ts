import { useCallback, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ImageViewerDragResult {
  /**
   * Whether the user is currently dragging.
   */
  isDragging: boolean;

  /**
   * Mouse down handler to start drag panning.
   */
  handleMouseDown: (event: React.MouseEvent) => void;
}

/**
 * Manages drag-to-pan interaction for the image viewer.
 * Tracks mouse movement from the initial click position
 * and updates the pan offset accordingly.
 */
export function useImageViewerDrag(
  pan: Point,
  setPan: React.Dispatch<React.SetStateAction<Point>>,
  zoom: number,
  clampPan: (zoom: number, pan: Point) => Point,
): ImageViewerDragResult {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Start drag panning on left-click or middle-click
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0 && event.button !== 1) {
        return;
      }

      event.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - dragStartRef.current.x;
        const deltaY = moveEvent.clientY - dragStartRef.current.y;

        setPan(
          clampPan(zoom, {
            x: dragStartRef.current.panX + deltaX,
            y: dragStartRef.current.panY + deltaY,
          }),
        );
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [pan, setPan, zoom, clampPan],
  );

  return { isDragging, handleMouseDown };
}

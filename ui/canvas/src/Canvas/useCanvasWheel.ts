import { useCallback, useEffect } from 'react';
import { useCanvasContext } from '../CanvasContext';
import { scrollsNestedContent } from '../utils';

/**
 * Zooms and pans the canvas from wheel events over its viewport:
 * ctrl/cmd + scroll zooms toward the cursor, shift + scroll pans
 * horizontally and a plain scroll pans vertically. Scrolls which
 * scrollable canvas content can consume are left to it.
 */
export function useCanvasWheel(): void {
  const { store, viewportRef } = useCanvasContext();

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      // Let scrollable content inside the canvas consume plain
      // scrolls, zoom gestures still target the canvas
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        viewportRef.current &&
        scrollsNestedContent(event, viewportRef.current)
      ) {
        return;
      }

      event.preventDefault();

      // Ctrl/Cmd + scroll = zoom toward cursor
      if (event.ctrlKey || event.metaKey) {
        const rect = viewportRef.current?.getBoundingClientRect();

        if (!rect) {
          return;
        }

        // Mouse position relative to the viewport
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Compute new zoom from scroll delta
        const zoomFactor = 1 - event.deltaY * 0.005;
        const newZoom = store.getZoom() * zoomFactor;

        store.setZoom(newZoom, { x: mouseX, y: mouseY });

        return;
      }

      // Shift + scroll = horizontal pan
      const deltaX = event.shiftKey ? event.deltaY : event.deltaX;
      const deltaY = event.shiftKey ? 0 : event.deltaY;
      const currentPan = store.getPan();

      store.setPan(currentPan.x - deltaX, currentPan.y - deltaY);
    },
    [store, viewportRef],
  );

  // Attach wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, viewportRef]);
}

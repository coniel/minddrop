import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DesignStudioStore, updateElementStyle } from '../../DesignStudioStore';
import { FlatPagePanelDesignElement } from '../../types';
import { ContainerStudioDesignElement } from '../container';
import './PagePanelStudioDesignElement.css';

// Width bounds applied while dragging a panel edge
const MIN_PANEL_WIDTH = 120;
const MAX_PANEL_WIDTH = 640;

interface ResizeState {
  /**
   * The pointer X position where the resize started.
   */
  startX: number;

  /**
   * The panel width when the resize started.
   */
  startWidth: number;
}

export interface PagePanelStudioDesignElementProps {
  /**
   * The panel element to render in the studio.
   */
  element: FlatPagePanelDesignElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders a page panel in the design studio, wrapping the container
 * renderer with a draggable edge handle for width resizing. The width
 * updates live during the drag and is persisted when it ends.
 */
export const PagePanelStudioDesignElement: React.FC<
  PagePanelStudioDesignElementProps
> = ({ element, rootProps }) => {
  const resizeState = useRef<ResizeState | null>(null);
  const [width, setWidth] = useState(element.style.width);
  // Latest width for reading inside the mouse-up handler
  const widthRef = useRef(width);

  // Keep the local width in sync with the element when it changes
  // externally, but never while a resize is in progress
  useEffect(() => {
    if (!resizeState.current) {
      setWidth(element.style.width);
    }
  }, [element.style.width]);

  // Mirror the width into a ref for the mouse-up handler
  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  // Track pointer movement while resizing. The canvas is zoomed, so
  // screen-pixel deltas are scaled down by the current zoom. The left
  // panel grows as the handle moves right, the right panel grows as it
  // moves left.
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizeState.current) {
        return;
      }

      const scale = DesignStudioStore.getState().zoom || 1;
      const delta = (event.clientX - resizeState.current.startX) / scale;
      const signedDelta = element.side === 'left' ? delta : -delta;
      const nextWidth = Math.min(
        MAX_PANEL_WIDTH,
        Math.max(MIN_PANEL_WIDTH, resizeState.current.startWidth + signedDelta),
      );

      setWidth(nextWidth);
    },
    [element.side],
  );

  // End the resize on mouse up, persisting the width when it changed
  const handleMouseUp = useCallback(() => {
    if (!resizeState.current) {
      return;
    }

    resizeState.current = null;

    const nextWidth = Math.round(widthRef.current);

    if (nextWidth !== element.style.width) {
      updateElementStyle(element.id, 'width', nextWidth);
    }
  }, [element.id, element.style.width]);

  // Attach global mouse listeners for the resize interaction
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Start a resize on the handle, stopping propagation so the panel
  // is not selected by the same press
  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      resizeState.current = { startX: event.clientX, startWidth: width };
    },
    [width],
  );

  // Override the rendered width with the live resize width
  const panelElement = useMemo(
    () => ({ ...element, style: { ...element.style, width } }),
    [element, width],
  );

  return (
    <div className="page-panel-region">
      <ContainerStudioDesignElement
        element={panelElement}
        rootProps={rootProps}
      />
      <div
        className={`page-panel-resize-handle page-panel-resize-handle-${element.side}`}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

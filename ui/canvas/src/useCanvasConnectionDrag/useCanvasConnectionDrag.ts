import { useCallback, useEffect, useState } from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import { CONNECTION_PROXIMITY } from '../constants';
import { CanvasConnectionEnd, CanvasNodeSide } from '../types';
import {
  getConnectionDropTarget,
  getSideMidpoint,
  screenToCanvas,
} from '../utils';

/**
 * A completed drag-to-connect result: the source and target
 * endpoints of the new connection.
 */
export interface CanvasNodeConnection {
  /**
   * The endpoint the connection was dragged from.
   */
  from: CanvasConnectionEnd;

  /**
   * The endpoint the connection was dropped on.
   */
  to: CanvasConnectionEnd;
}

export interface UseCanvasConnectionDragOptions {
  /**
   * The ID of the node the connection handles belong to.
   */
  nodeId: string;

  /**
   * Called when a connection drag is dropped on a target node.
   */
  onConnect?: (connection: CanvasNodeConnection) => void;
}

export interface UseCanvasConnectionDragResult {
  /**
   * Returns props to spread onto the connection handle for the
   * given node side.
   */
  getConnectionHandleProps: (side: CanvasNodeSide) => {
    onMouseDown: (event: React.MouseEvent) => void;
  };
}

/**
 * Headless drag-to-connect behaviour for a canvas node's
 * connection handles: pressing a handle starts a connection drag
 * tracked in the canvas store, nodes near the cursor become the
 * drag's target with their nearest side, and dropping on a target
 * reports the connection.
 *
 * Does nothing without a CanvasProvider, since connections only
 * exist between nodes on a canvas.
 */
export function useCanvasConnectionDrag(
  options: UseCanvasConnectionDragOptions,
): UseCanvasConnectionDragResult {
  const { nodeId, onConnect } = options;

  // The active drag, driving the window mouse listeners
  const [dragging, setDragging] = useState(false);
  const context = useOptionalCanvasContext();

  // Start a connection drag when a handle is pressed
  const handleMouseDown = useCallback(
    (event: React.MouseEvent, side: CanvasNodeSide) => {
      // Only the left button starts a drag
      if (event.button !== 0) {
        return;
      }

      // Connections require a canvas instance
      if (!context) {
        return;
      }

      // Keep the press from starting a node drag or text selection
      event.preventDefault();
      event.stopPropagation();

      const frame = context.store.getNode(nodeId);

      // The node's frame is not registered yet
      if (!frame) {
        return;
      }

      // Track the drag from the pressed side's midpoint
      context.store.startConnectionDrag(
        nodeId,
        side,
        getSideMidpoint(frame, side),
      );

      setDragging(true);
    },
    [context, nodeId],
  );

  // Track the cursor and hovered target during the drag
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!context) {
        return;
      }

      const rect = context.viewportRef.current?.getBoundingClientRect();

      // Convert the cursor to canvas coordinates
      const point = screenToCanvas(
        {
          x: event.clientX - (rect?.left || 0),
          y: event.clientY - (rect?.top || 0),
        },
        context.store.getPan(),
        context.store.getZoom(),
      );

      // Resolve the target nearest the cursor, excluding the
      // drag's own source node
      const target = getConnectionDropTarget(
        context.store.getNodes(),
        point,
        nodeId,
        CONNECTION_PROXIMITY / context.store.getZoom(),
      );

      context.store.updateConnectionDrag(point, target);
    },
    [context, nodeId],
  );

  // End the drag on mouseup, reporting the connection when
  // dropped on a target
  const handleMouseUp = useCallback(() => {
    if (!context) {
      return;
    }

    const drag = context.store.getConnectionDrag();

    setDragging(false);
    context.store.clearConnectionDrag();

    // The drag ended off-target
    if (!drag?.targetNodeId || !drag.targetSide) {
      return;
    }

    if (onConnect) {
      onConnect({
        from: { nodeId: drag.fromNodeId, side: drag.fromSide },
        to: { nodeId: drag.targetNodeId, side: drag.targetSide },
      });
    }
  }, [context, onConnect]);

  // Cancel the drag on Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setDragging(false);
      context?.store.clearConnectionDrag();
    },
    [context],
  );

  // Attach global listeners while a drag is active
  useEffect(() => {
    if (!dragging) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dragging, handleMouseMove, handleMouseUp, handleKeyDown]);

  // Lock text selection globally while a drag is active, so
  // moving the pointer across text content does not paint a
  // selection
  useEffect(() => {
    if (!dragging) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;

    document.body.style.userSelect = 'none';

    return () => {
      document.body.style.userSelect = previousUserSelect;
    };
  }, [dragging]);

  const getConnectionHandleProps = useCallback(
    (side: CanvasNodeSide) => ({
      onMouseDown: (event: React.MouseEvent) => handleMouseDown(event, side),
    }),
    [handleMouseDown],
  );

  return { getConnectionHandleProps };
}

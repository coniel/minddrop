import { useCallback, useEffect, useState } from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import { CONNECTION_PROXIMITY } from '../constants';
import {
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasNodeFrame,
  CanvasNodeSide,
  CanvasPoint,
} from '../types';
import { useInteractionLock } from '../useInteractionLock';
import {
  getConnectionDropTarget,
  getSideAnchorPoint,
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

  /**
   * Called when a connection drag is released over the empty
   * canvas: with no target node and outside every node frame.
   * Escape-cancelled drags do not fire it.
   * @param point - The release point in canvas coordinates.
   * @param from - The endpoint the connection was dragged from.
   */
  onConnectRelease?: (point: CanvasPoint, from: CanvasConnectionEnd) => void;

  /**
   * Whether the preview curve is held, frozen at the release
   * point, after a release which fired onConnectRelease. The
   * consumer clears the held preview via the store's
   * clearConnectionDrag, e.g. when its follow-up UI closes.
   */
  holdPreviewOnRelease?: boolean;

  /**
   * Resolves the hovered drop target: return null to reject it,
   * keeping the drag unsnapped over it, or the target to snap
   * to, optionally re-anchored to another side or offset.
   * Targets are accepted as hovered when omitted.
   * @param from - The endpoint the connection is dragged from.
   * @param target - The hovered target.
   */
  resolveTarget?: (
    from: CanvasConnectionEnd,
    target: CanvasConnectionDragTarget,
  ) => CanvasConnectionDragTarget | null;
}

export interface UseCanvasConnectionDragResult {
  /**
   * Returns props to spread onto the connection handle for the
   * given node side.
   */
  getConnectionHandleProps: (
    side: CanvasNodeSide,
    offset?: number,
  ) => {
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
  const {
    nodeId,
    onConnect,
    onConnectRelease,
    holdPreviewOnRelease,
    resolveTarget,
  } = options;

  // The active drag, driving the window mouse listeners
  const [dragging, setDragging] = useState(false);
  const context = useOptionalCanvasContext();

  // Hold the pointer for the drag, keeping the handle's cursor
  // over whatever content the connection is dragged across
  useInteractionLock(dragging ? 'crosshair' : null);

  // Start a connection drag when a handle is pressed
  const handleMouseDown = useCallback(
    (event: React.MouseEvent, side: CanvasNodeSide, offset?: number) => {
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

      // Track the drag from the pressed side's anchor
      context.store.startConnectionDrag(
        nodeId,
        side,
        getSideAnchorPoint(frame, side, offset),
        undefined,
        offset,
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
      let target = getConnectionDropTarget(
        context.store.getNodes(),
        point,
        nodeId,
        CONNECTION_PROXIMITY / context.store.getZoom(),
      );

      // Let the consumer reject or re-anchor the hovered target
      const drag = context.store.getConnectionDrag();

      if (target && drag && resolveTarget) {
        const from: CanvasConnectionEnd = {
          nodeId: drag.fromNodeId,
          side: drag.fromSide,
          offset: drag.fromOffset,
        };

        target = resolveTarget(from, target);
      }

      context.store.updateConnectionDrag(point, target);
    },
    [context, nodeId, resolveTarget],
  );

  // End the drag on mouseup, reporting the connection when
  // dropped on a target
  const handleMouseUp = useCallback(() => {
    if (!context) {
      return;
    }

    const drag = context.store.getConnectionDrag();

    setDragging(false);

    // No drag was in progress
    if (!drag) {
      context.store.clearConnectionDrag();

      return;
    }

    // The drag ended off-target
    if (!drag.targetNodeId || !drag.targetSide) {
      // Releases over a node frame cancel; only releases on the
      // empty canvas are reported
      const overNode = Object.values(context.store.getNodes()).some((frame) =>
        pointInFrame(drag.point, frame),
      );

      if (!overNode && onConnectRelease) {
        // Hold the preview at the release point for the
        // consumer's follow-up UI
        if (!holdPreviewOnRelease) {
          context.store.clearConnectionDrag();
        }

        onConnectRelease(drag.point, {
          nodeId: drag.fromNodeId,
          side: drag.fromSide,
          offset: drag.fromOffset,
        });

        return;
      }

      context.store.clearConnectionDrag();

      return;
    }

    context.store.clearConnectionDrag();

    if (onConnect) {
      onConnect({
        from: {
          nodeId: drag.fromNodeId,
          side: drag.fromSide,
          offset: drag.fromOffset,
        },
        to: {
          nodeId: drag.targetNodeId,
          side: drag.targetSide,
          offset: drag.targetOffset,
        },
      });
    }
  }, [context, onConnect, onConnectRelease, holdPreviewOnRelease]);

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

  const getConnectionHandleProps = useCallback(
    (side: CanvasNodeSide, offset?: number) => ({
      onMouseDown: (event: React.MouseEvent) =>
        handleMouseDown(event, side, offset),
    }),
    [handleMouseDown],
  );

  return { getConnectionHandleProps };
}

/**
 * Checks whether a canvas point lies within a node frame.
 */
function pointInFrame(point: CanvasPoint, frame: CanvasNodeFrame): boolean {
  return (
    point.x >= frame.x &&
    point.x <= frame.x + frame.width &&
    point.y >= frame.y &&
    point.y <= frame.y + frame.height
  );
}

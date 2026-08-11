import { useCallback, useEffect, useRef, useState } from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import {
  CONNECTION_PROXIMITY,
  CONNECTION_RECONNECT_DRAG_THRESHOLD,
} from '../constants';
import {
  CanvasConnection,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasPoint,
} from '../types';
import { useInteractionLock } from '../useInteractionLock';
import {
  getConnectionDropTarget,
  getFixedConnectionEnd,
  screenToCanvas,
} from '../utils';

/**
 * A completed re-connect drag result: the re-routed connection,
 * the end that moved and the endpoint it now attaches to.
 */
export interface CanvasConnectionReconnection {
  /**
   * The ID of the re-routed connection.
   */
  connectionId: string;

  /**
   * The connection end that was dragged.
   */
  end: 'from' | 'to';

  /**
   * The endpoint the dragged end now attaches to, or null when
   * the drag was dropped on empty canvas.
   */
  target: CanvasConnectionEnd | null;
}

export interface UseCanvasConnectionReconnectOptions {
  /**
   * Called when a re-connect drag is dropped on a target node.
   */
  onReconnect?: (reconnection: CanvasConnectionReconnection) => void;

  /**
   * Resolves the hovered drop target: return null to reject it,
   * keeping the drag unsnapped over it, or the target to snap
   * to, optionally re-anchored to another side or offset.
   * Targets are accepted as hovered when omitted.
   * @param reconnect - The connection being re-routed and its dragged end.
   * @param target - The hovered target.
   */
  resolveTarget?: (
    reconnect: CanvasConnectionReconnect,
    target: CanvasConnectionDragTarget,
  ) => CanvasConnectionDragTarget | null;
}

export interface UseCanvasConnectionReconnectResult {
  /**
   * Returns props to spread onto the hit area of the given
   * connection.
   */
  getConnectionProps: (connection: CanvasConnection) => {
    onMouseDown: (event: React.MouseEvent) => void;
  };

  /**
   * Whether the pointer moved past the drag threshold during the
   * latest press. Used to distinguish clicks from drags.
   */
  wasDragged: () => boolean;
}

/**
 * A pressed connection, armed to become a re-connect drag once
 * the cursor travels past the drag threshold.
 */
interface PendingReconnect {
  /**
   * The pressed connection.
   */
  connection: CanvasConnection;

  /**
   * The press position in client coordinates.
   */
  client: CanvasPoint;

  /**
   * The press position in canvas coordinates.
   */
  point: CanvasPoint;
}

/**
 * Headless re-connect behaviour for existing connections:
 * dragging a connection's curve detaches the end nearest the grab
 * point and tracks it as a connection drag in the canvas store,
 * while the other end stays anchored. Dropping reports the
 * re-connection, with a null target when the drag landed on empty
 * canvas. Presses that never travel past the drag threshold are
 * left to click handling.
 *
 * Does nothing without a CanvasProvider, since connections only
 * exist between nodes on a canvas.
 */
export function useCanvasConnectionReconnect(
  options: UseCanvasConnectionReconnectOptions,
): UseCanvasConnectionReconnectResult {
  const { onReconnect, resolveTarget } = options;

  // The pressed connection, armed until the cursor travels past
  // the drag threshold
  const [pending, setPending] = useState<PendingReconnect | null>(null);

  // Whether the armed press has become a drag
  const [dragging, setDragging] = useState(false);

  // Read by the click handling the hook leaves to the consumer,
  // after the drag state has already been reset
  const didDrag = useRef(false);

  const context = useOptionalCanvasContext();

  // Hold the pointer for the drag, keeping the curve's cursor
  // over whatever content the end is dragged across
  useInteractionLock(dragging ? 'grabbing' : null);

  // Convert a mouse event's position to canvas coordinates
  const eventToCanvas = useCallback(
    (event: { clientX: number; clientY: number }): CanvasPoint => {
      const rect = context?.viewportRef.current?.getBoundingClientRect();

      return screenToCanvas(
        {
          x: event.clientX - (rect?.left || 0),
          y: event.clientY - (rect?.top || 0),
        },
        context?.store.getPan() || { x: 0, y: 0 },
        context?.store.getZoom() || 1,
      );
    },
    [context],
  );

  // Arm a re-connect drag when a connection is pressed
  const handleMouseDown = useCallback(
    (event: React.MouseEvent, connection: CanvasConnection) => {
      // Only the left button arms a drag
      if (event.button !== 0) {
        return;
      }

      // Connections require a canvas instance
      if (!context) {
        return;
      }

      // Keep the browser from starting a text selection anchored
      // at the curve. It has to happen on the press: a selection
      // already under way carries on painting regardless of the
      // content it is dragged across being unselectable.
      event.preventDefault();

      didDrag.current = false;

      // Arm the press; the drag starts once the cursor travels
      // past the drag threshold
      setPending({
        connection,
        client: { x: event.clientX, y: event.clientY },
        point: eventToCanvas(event),
      });
    },
    [context, eventToCanvas],
  );

  // Start the drag past the threshold, then track the cursor and
  // hovered target
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!context || !pending) {
        return;
      }

      const point = eventToCanvas(event);

      // Start the drag once the cursor travels past the threshold
      if (!dragging) {
        const travel = Math.hypot(
          event.clientX - pending.client.x,
          event.clientY - pending.client.y,
        );

        // Still within the click threshold
        if (travel < CONNECTION_RECONNECT_DRAG_THRESHOLD) {
          return;
        }

        const fixed = getFixedConnectionEnd(
          pending.connection,
          pending.point,
          context.store.getNodes(),
        );

        // An endpoint frame is missing; the drag cannot start
        if (!fixed) {
          setPending(null);

          return;
        }

        // Anchor the drag to the fixed end, marking the nearer
        // end as the one being re-routed
        context.store.startConnectionDrag(
          fixed.end.nodeId,
          fixed.end.side,
          fixed.point,
          { connectionId: pending.connection.id, end: fixed.looseEnd },
          fixed.end.offset,
        );

        didDrag.current = true;

        setDragging(true);
      }

      const drag = context.store.getConnectionDrag();

      // The drag was cancelled elsewhere
      if (!drag) {
        return;
      }

      // Resolve the target nearest the cursor, excluding the
      // fixed end's node
      let target = getConnectionDropTarget(
        context.store.getNodes(),
        point,
        drag.fromNodeId,
        CONNECTION_PROXIMITY / context.store.getZoom(),
      );

      // Let the consumer reject or re-anchor the hovered target
      if (target && drag.reconnect && resolveTarget) {
        target = resolveTarget(drag.reconnect, target);
      }

      context.store.updateConnectionDrag(point, target);
    },
    [context, pending, dragging, eventToCanvas, resolveTarget],
  );

  // End the drag on mouseup, reporting the re-connection when
  // dropped on a target
  const handleMouseUp = useCallback(() => {
    if (!context) {
      return;
    }

    const drag = context.store.getConnectionDrag();

    // Disarm the press
    setPending(null);
    setDragging(false);

    // The press never became a drag; leave it to click handling
    if (!dragging) {
      return;
    }

    context.store.clearConnectionDrag();

    // The drag was not re-routing a connection
    if (!drag?.reconnect) {
      return;
    }

    // Report the drop with a null target when it landed on empty
    // canvas
    if (onReconnect) {
      onReconnect({
        connectionId: drag.reconnect.connectionId,
        end: drag.reconnect.end,
        target:
          drag.targetNodeId && drag.targetSide
            ? {
                nodeId: drag.targetNodeId,
                side: drag.targetSide,
                offset: drag.targetOffset,
              }
            : null,
      });
    }
  }, [context, dragging, onReconnect]);

  // Cancel the drag on Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setPending(null);
      setDragging(false);
      context?.store.clearConnectionDrag();
    },
    [context],
  );

  // Attach global listeners while a press is armed or dragging
  useEffect(() => {
    if (!pending) {
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
  }, [pending, handleMouseMove, handleMouseUp, handleKeyDown]);

  const getConnectionProps = useCallback(
    (connection: CanvasConnection) => ({
      onMouseDown: (event: React.MouseEvent) =>
        handleMouseDown(event, connection),
    }),
    [handleMouseDown],
  );

  const wasDragged = useCallback(() => didDrag.current, []);

  return { getConnectionProps, wasDragged };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvasContext } from '../CanvasContext';
import { SELECTION_BOX_PADDING } from '../constants';
import { CanvasNodeFrame } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import { useInteractionLock } from '../useInteractionLock';
import { getSelectionBounds, snapToGrid } from '../utils';
import './CanvasSelectionBox.css';

export interface CanvasSelectionBoxProps {
  /**
   * Called once with the final frames of every node moved by a
   * group drag.
   */
  onNodesFrameChange?: (frames: Record<string, CanvasNodeFrame>) => void;
}

/**
 * Renders the box wrapping a multi-node selection, which drags
 * every selected node as one. Rendered by the Canvas component
 * inside the transform layer above the nodes, so presses within
 * the box move the group rather than reaching node content.
 */
export const CanvasSelectionBox: React.FC<CanvasSelectionBoxProps> = ({
  onNodesFrameChange,
}) => {
  const { store } = useCanvasContext();
  // Where the drag started: the cursor position, and the bounds
  // origin the grid snaps against
  const dragStart = useRef<DragStart | null>(null);
  const [dragging, setDragging] = useState(false);
  const selectedNodeIds = useCanvasStore((state) =>
    state.selection?.type === 'nodes' ? state.selection.ids : null,
  );
  const nodes = useCanvasStore((state) => state.nodes);
  const zoom = useCanvasStore((state) => state.zoom);

  // Hold the pointer for the drag, so moving the group over text
  // content neither selects it nor swaps the cursor
  useInteractionLock(dragging ? 'grabbing' : null);

  // The bounds of the selected nodes. Their registered frames
  // already carry the group drag offset, so the box tracks the
  // drag without applying it again.
  const bounds = selectedNodeIds
    ? getSelectionBounds(selectedNodeIds, nodes)
    : null;

  // Start a group drag, anchoring it to the cursor and the
  // current bounds
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      // Only the left button drags the group
      if (event.button !== 0 || !bounds) {
        return;
      }

      // Keep the browser from starting a text selection anchored
      // at the box
      event.preventDefault();

      dragStart.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        origin: { x: bounds.x, y: bounds.y },
      };

      setDragging(true);
      store.startSelectionDrag();
    },
    [store, bounds],
  );

  // Track the drag, publishing the offset for the selected nodes
  // to follow
  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const start = dragStart.current;

      if (!start) {
        return;
      }

      // Nodes live in the zoomed canvas coordinate space, so
      // screen-pixel mouse deltas are scaled down by the zoom
      const scale = store.getZoom();
      const rawX = (event.clientX - start.clientX) / scale;
      const rawY = (event.clientY - start.clientY) / scale;

      // The group lands its bounds' top left corner on the grid
      const snap = store.getSnapToGrid();
      const offsetX = snap
        ? snapToGrid(start.origin.x + rawX) - start.origin.x
        : rawX;
      const offsetY = snap
        ? snapToGrid(start.origin.y + rawY) - start.origin.y
        : rawY;

      store.updateSelectionDrag({ x: offsetX, y: offsetY });
    };

    const handleMouseUp = () => {
      dragStart.current = null;

      setDragging(false);

      // Report every moved node in one call. Per-node reporting
      // would have consumers applying N updates against the same
      // stale snapshot within a tick.
      if (onNodesFrameChange && store.getSelectionDrag()) {
        onNodesFrameChange(getMovedFrames(store));
      }

      // Cleared after reporting, so the consumer's new positions
      // and the dropped offset land in the same render
      store.clearSelectionDrag();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, store, onNodesFrameChange]);

  // A single node keeps its own outline and handles, so the box
  // only wraps an actual group
  if (!selectedNodeIds || selectedNodeIds.length < 2 || !bounds) {
    return null;
  }

  return (
    <div
      className="ui-canvas-selection-box"
      style={{
        transform: `translate(${bounds.x - SELECTION_BOX_PADDING}px, ${
          bounds.y - SELECTION_BOX_PADDING
        }px)`,
        width: bounds.width + SELECTION_BOX_PADDING * 2,
        height: bounds.height + SELECTION_BOX_PADDING * 2,
        // The layer is scaled by the canvas transform, so the
        // border is unscaled to stay one screen pixel wide
        borderWidth: 1 / zoom,
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

/**
 * An in-progress group drag's anchor points.
 */
interface DragStart {
  /**
   * The press's horizontal position in client coordinates.
   */
  clientX: number;

  /**
   * The press's vertical position in client coordinates.
   */
  clientY: number;

  /**
   * The selection bounds' top left corner when the drag started,
   * which grid snapping aligns.
   */
  origin: { x: number; y: number };
}

/**
 * Returns the rounded frames of the selected nodes, which carry
 * the group drag's offset through their registered frames.
 */
function getMovedFrames(
  store: ReturnType<typeof useCanvasContext>['store'],
): Record<string, CanvasNodeFrame> {
  const nodes = store.getNodes();
  const frames: Record<string, CanvasNodeFrame> = {};

  store.getSelectedNodeIds().forEach((id) => {
    const frame = nodes[id];

    // The node is not mounted, so it never moved
    if (!frame) {
      return;
    }

    frames[id] = {
      x: Math.round(frame.x),
      y: Math.round(frame.y),
      width: Math.round(frame.width),
      height: Math.round(frame.height),
    };
  });

  return frames;
}

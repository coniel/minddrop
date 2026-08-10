import { useCallback } from 'react';
import { isInteractiveTarget } from '@minddrop/utils';
import { CanvasNodeFrame } from '../types';
import {
  CanvasNodeConnection,
  useCanvasConnectionDrag,
} from '../useCanvasConnectionDrag';
import { CanvasNodeResizeEdge, useCanvasNode } from '../useCanvasNode';
import { useCanvasStore } from '../useCanvasStore';
import './CanvasNode.css';

export interface CanvasNodeProps {
  /**
   * The node's unique ID within the canvas.
   */
  id: string;

  /**
   * The node's horizontal position in canvas coordinates.
   */
  x: number;

  /**
   * The node's vertical position in canvas coordinates.
   */
  y: number;

  /**
   * The node's width.
   */
  width: number;

  /**
   * The node's height. Omit for auto-height nodes whose height
   * follows their content.
   */
  height?: number;

  /**
   * The minimum width the node can be resized to.
   */
  minWidth?: number;

  /**
   * The minimum height the node can be resized to.
   */
  minHeight?: number;

  /**
   * Which resize handles to render: 'all' renders edge and corner
   * handles, 'horizontal' only the left/right edges (for
   * auto-height nodes), 'none' disables resizing.
   */
  resizeEdges?: 'all' | 'horizontal' | 'none';

  /**
   * How the node is dragged: 'node' (default) makes the whole
   * node the drag handle, 'handle' confines dragging to an
   * invisible bar along the node's top edge, leaving the content
   * fully interactive.
   */
  dragMode?: 'node' | 'handle';

  /**
   * Whether pressing the node selects it on the canvas. Defaults
   * to true.
   */
  selectable?: boolean;

  /**
   * Whether the node renders connection handles on its side
   * midpoints, from which connections to other nodes can be
   * dragged.
   */
  connectable?: boolean;

  /**
   * Called when a connection dragged from one of the node's
   * connection handles is dropped on another node.
   */
  onConnect?: (connection: CanvasNodeConnection) => void;

  /**
   * Called once when a drag or resize ends and the frame changed,
   * with the rounded result frame.
   */
  onFrameChange?: (frame: CanvasNodeFrame) => void;

  /**
   * Called when the node is clicked without being dragged.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Called when the node is double-clicked.
   */
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Optional additional class name for the node element.
   */
  className?: string;

  /**
   * The node content.
   */
  children: React.ReactNode;
}

/** The resize edges rendered for each resizeEdges setting. */
const RESIZE_EDGES: Record<'all' | 'horizontal', CanvasNodeResizeEdge[]> = {
  all: [
    'left',
    'right',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ],
  horizontal: ['left', 'right'],
};

/**
 * Renders a draggable, resizable canvas node. Dragging happens
 * from the whole node or a top-edge bar depending on the drag
 * mode; resize handles are rendered on the configured edges.
 * Pressing the node's drag handle selects it on the canvas.
 * Must be rendered within a Canvas.
 */
export const CanvasNode: React.FC<CanvasNodeProps> = ({
  id,
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  resizeEdges = 'all',
  dragMode = 'node',
  selectable,
  connectable,
  onConnect,
  onFrameChange,
  onClick,
  onDoubleClick,
  className,
  children,
}) => {
  const {
    nodeProps,
    getDragHandleProps,
    getSelectionProps,
    getResizeHandleProps,
    selected,
    isDragging,
    isResizing,
    wasDragged,
  } = useCanvasNode({
    id,
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    selectable,
    onFrameChange,
  });
  const { getConnectionHandleProps } = useCanvasConnectionDrag({
    nodeId: id,
    onConnect,
  });

  // The side an in-progress connection drag started from on this
  // node, keeping its handle visible during the drag
  const connectionSourceSide = useCanvasStore((state) =>
    connectable === true && state.connectionDrag?.fromNodeId === id
      ? state.connectionDrag.fromSide
      : null,
  );

  // Whether any connection drag is in progress, suppressing
  // proximity handles on other nodes
  const connectionDragActive = useCanvasStore(
    (state) => connectable === true && state.connectionDrag !== null,
  );

  // The side of this node whose edge the cursor is near, tracked
  // by the canvas from viewport cursor movement
  const hoverSide = useCanvasStore((state) =>
    connectable === true && state.hoveredConnectionHandle?.nodeId === id
      ? state.hoveredConnectionHandle.side
      : null,
  );

  // Whether an in-progress connection drag is targeting this node,
  // highlighting it as the drop target
  const isConnectionTarget = useCanvasStore(
    (state) =>
      connectable === true && state.connectionDrag?.targetNodeId === id,
  );

  // Select the node on press, and start a drag from the whole
  // node when the drag mode makes it the handle. Presses on
  // interactive content within the node do neither, so the content
  // stays usable without having to swallow the event.
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      getSelectionProps().onMouseDown(event);

      if (dragMode === 'node' && !isInteractiveTarget(event.target)) {
        getDragHandleProps().onMouseDown(event);
      }
    },
    [getSelectionProps, getDragHandleProps, dragMode],
  );

  // Fire clicks only when the press did not drag the node
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (onClick && !wasDragged()) {
        onClick(event);
      }
    },
    [onClick, wasDragged],
  );

  // The resize edges to render handles for
  const edges = resizeEdges === 'none' ? [] : RESIZE_EDGES[resizeEdges];

  // The connection handle to render: the drag's source side while
  // one is in progress, otherwise the cursor-adjacent side, hidden
  // during other interactions
  const connectionSide =
    connectionSourceSide ??
    (isDragging || isResizing || connectionDragActive ? null : hoverSide);

  return (
    <div
      {...nodeProps}
      className={`ui-canvas-node${selected ? ' ui-canvas-node-selected' : ''}${
        isDragging ? ' ui-canvas-node-dragging' : ''
      }${isConnectionTarget ? ' ui-canvas-node-connection-target' : ''}${
        className ? ` ${className}` : ''
      }`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      {children}

      {/* Invisible drag bar along the node's top edge */}
      {dragMode === 'handle' && (
        <div className="ui-canvas-node-drag-handle" {...getDragHandleProps()} />
      )}

      {/* Resize handles for the configured edges */}
      {edges.map((edge) => (
        <div
          key={edge}
          className={`ui-canvas-node-resize-handle ui-canvas-node-resize-handle-${edge}`}
          {...getResizeHandleProps(edge)}
        />
      ))}

      {/* Connection handle on the edge-adjacent side's midpoint */}
      {connectable && connectionSide && (
        <div
          className={`ui-canvas-node-connection-handle ui-canvas-node-connection-handle-${connectionSide}`}
          {...getConnectionHandleProps(connectionSide)}
        />
      )}
    </div>
  );
};

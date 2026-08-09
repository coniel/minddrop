import { useCallback } from 'react';
import { CanvasNodeFrame } from '../types';
import { CanvasNodeResizeEdge, useCanvasNode } from '../useCanvasNode';
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
   * Whether the node is selected, adding selection styling.
   */
  selected?: boolean;

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
  selected,
  onFrameChange,
  onClick,
  onDoubleClick,
  className,
  children,
}) => {
  const {
    nodeProps,
    getDragHandleProps,
    getResizeHandleProps,
    isDragging,
    wasDragged,
  } = useCanvasNode({
    id,
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    onFrameChange,
  });

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

  return (
    <div
      {...nodeProps}
      className={`ui-canvas-node${selected ? ' ui-canvas-node-selected' : ''}${
        isDragging ? ' ui-canvas-node-dragging' : ''
      }${className ? ` ${className}` : ''}`}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      {...(dragMode === 'node' ? getDragHandleProps() : {})}
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
    </div>
  );
};

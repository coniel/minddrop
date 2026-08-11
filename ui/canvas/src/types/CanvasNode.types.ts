/**
 * A point in canvas or viewport coordinates.
 */
export interface CanvasPoint {
  /**
   * The horizontal coordinate.
   */
  x: number;

  /**
   * The vertical coordinate.
   */
  y: number;
}

/**
 * A node's position and size in canvas (un-zoomed) pixels.
 */
export interface CanvasNodeFrame {
  /**
   * The horizontal position.
   */
  x: number;

  /**
   * The vertical position.
   */
  y: number;

  /**
   * The width.
   */
  width: number;

  /**
   * The height.
   */
  height: number;
}

/**
 * The edges and corners from which a node can be resized.
 */
export type CanvasNodeResizeEdge =
  | 'left'
  | 'right'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * An in-progress node resize: the edge being dragged and the
 * node's frame when the drag started.
 */
export interface CanvasNodeResizeState {
  /**
   * The edge or corner being dragged.
   */
  edge: CanvasNodeResizeEdge;

  /**
   * The press's horizontal position in client coordinates.
   */
  startX: number;

  /**
   * The press's vertical position in client coordinates.
   */
  startY: number;

  /**
   * The node's width when the resize started.
   */
  originWidth: number;

  /**
   * The node's height when the resize started.
   */
  originHeight: number;

  /**
   * The node's horizontal position when the resize started.
   */
  originX: number;

  /**
   * The node's vertical position when the resize started.
   */
  originY: number;
}

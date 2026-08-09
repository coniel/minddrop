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

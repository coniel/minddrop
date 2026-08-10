import { CanvasNodeFrame, CanvasPoint } from './CanvasNode.types';

/**
 * A selection of canvas nodes.
 */
export interface CanvasNodeSelection {
  /**
   * Identifies the selection as containing nodes.
   */
  type: 'nodes';

  /**
   * The IDs of the selected nodes.
   */
  ids: string[];
}

/**
 * A selection of canvas connections.
 */
export interface CanvasConnectionSelection {
  /**
   * Identifies the selection as containing connections.
   */
  type: 'connections';

  /**
   * The IDs of the selected connections.
   */
  ids: string[];
}

/**
 * The canvas's current selection. Nodes and connections are never
 * selected together: selecting either type replaces a selection of
 * the other.
 */
export type CanvasSelection = CanvasNodeSelection | CanvasConnectionSelection;

/**
 * An in-progress drag-to-select marquee.
 */
export interface CanvasLassoState {
  /**
   * The point the drag started from, in canvas coordinates.
   */
  origin: CanvasPoint;

  /**
   * The current cursor position, in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * Whether the lasso adds to the selection that existed when the
   * drag started, rather than replacing it.
   */
  additive: boolean;
}

/**
 * Geometry queries against a canvas's connections, registered by
 * the connections layer since it is what holds them. The canvas
 * itself only knows about nodes.
 */
export interface CanvasConnectionGeometry {
  /**
   * Returns the IDs of the connections whose paths pass through
   * a frame.
   *
   * @param frame - The frame to test, in canvas coordinates.
   */
  hitTest: (frame: CanvasNodeFrame) => string[];

  /**
   * Returns the frame enclosing the given connections' paths, or
   * null when none of them resolve.
   *
   * @param ids - The IDs of the connections to enclose.
   */
  getBounds: (ids: string[]) => CanvasNodeFrame | null;
}

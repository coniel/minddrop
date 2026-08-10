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

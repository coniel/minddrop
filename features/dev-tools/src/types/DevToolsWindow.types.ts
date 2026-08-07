/**
 * Position and size of the floating dev tools window, in pixels.
 */
export interface DevToolsWindowRect {
  /**
   * Horizontal position of the window's left edge.
   */
  x: number;

  /**
   * Vertical position of the window's top edge.
   */
  y: number;

  /**
   * Width of the window.
   */
  width: number;

  /**
   * Height of the window.
   */
  height: number;
}

/**
 * An edge or corner of the floating dev tools window which
 * can be dragged to resize it.
 */
export type DevToolsWindowResizeEdge =
  | 'n'
  | 's'
  | 'e'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw';

/**
 * A side of the app window the dev tools window can snap to.
 */
export type DevToolsWindowSnapSide = 'left' | 'right';

export interface PointerPosition {
  /**
   * The horizontal position of the pointer in the viewport.
   */
  x: number;

  /**
   * The vertical position of the pointer in the viewport.
   */
  y: number;
}

export type PointerMoveListener = (position: PointerPosition) => void;

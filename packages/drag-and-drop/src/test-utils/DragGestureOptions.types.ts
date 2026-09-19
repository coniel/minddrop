export interface DragGestureOptions {
  /**
   * The horizontal position of the pointer in the viewport.
   *
   * @default 0
   */
  clientX?: number;

  /**
   * The vertical position of the pointer in the viewport.
   *
   * @default 0
   */
  clientY?: number;

  /**
   * Whether the Shift key is held for the press.
   *
   * @default false
   */
  shiftKey?: boolean;
}

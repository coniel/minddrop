/**
 * A box positioned by its top left corner.
 */
export interface Rect {
  /**
   * The distance of the box's left edge from the origin.
   */
  left: number;

  /**
   * The distance of the box's top edge from the origin.
   */
  top: number;

  /**
   * The box's width.
   */
  width: number;

  /**
   * The box's height.
   */
  height: number;
}

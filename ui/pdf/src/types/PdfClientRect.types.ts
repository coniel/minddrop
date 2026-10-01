/**
 * A box in CSS pixels, relative to a page or the document column.
 */
export interface PdfClientRect {
  /**
   * The distance from the left edge.
   */
  left: number;

  /**
   * The distance from the top edge.
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

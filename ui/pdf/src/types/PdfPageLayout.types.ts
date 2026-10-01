/**
 * Where a rendered page sits in the document's scrolling column, in
 * CSS pixels.
 */
export interface PdfPageRect {
  /**
   * The distance from the top of the column to the page's top edge.
   */
  top: number;

  /**
   * The page's rendered width.
   */
  width: number;

  /**
   * The page's rendered height.
   */
  height: number;
}

/**
 * The rendered pages laid out in a column, in CSS pixels.
 */
export interface PdfPageLayout {
  /**
   * The rect of each page, in page order.
   */
  pages: PdfPageRect[];

  /**
   * The column's total height, including the padding around the
   * pages.
   */
  height: number;

  /**
   * The widest page's rendered width.
   */
  width: number;
}

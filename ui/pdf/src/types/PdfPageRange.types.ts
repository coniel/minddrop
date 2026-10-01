/**
 * A run of pages, by page number.
 */
export interface PdfPageRange {
  /**
   * The first page in the range, 1-based.
   */
  first: number;

  /**
   * The last page in the range, 1-based and inclusive.
   */
  last: number;
}

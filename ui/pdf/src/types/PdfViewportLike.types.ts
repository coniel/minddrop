/**
 * The part of a pdf.js page viewport which maps between PDF user
 * space and the page's rendered CSS pixels.
 */
export interface PdfViewportLike {
  /**
   * Maps a point in the rendered page to PDF user space.
   */
  convertToPdfPoint: (x: number, y: number) => number[];

  /**
   * Maps a PDF user space rect to the rendered page.
   */
  convertToViewportRectangle: (rect: number[]) => number[];
}

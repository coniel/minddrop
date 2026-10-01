/**
 * A mounted reader showing a document.
 */
export interface PdfReader {
  /**
   * The absolute path of the PDF file the reader shows.
   */
  path: string;

  /**
   * The ID of the view area the reader renders in.
   */
  viewAreaId: string;
}
